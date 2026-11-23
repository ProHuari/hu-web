/**
 * Lawmakers Service for Huari Civic Platform.
 * Connects to Spring Boot /transparencia endpoints with server-side search/filters,
 * pagination (Spring Pageable), real CEAP expenses, legislative bills, and metrics.
 */

import { apiClient } from './api';
import { MOCK_LAWMAKERS, CONGRESSIONAL_STATS } from '../data/lawmakers';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
export const DEFAULT_LAWMAKER_AVATAR = '/images/default-avatar.png';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const compactCurrencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
});

function resolveOfficialPhotoUrl(item) {
    const explicit = item?.avatar || item?.photoUrl || item?.urlFoto;
    if (typeof explicit === 'string' && explicit.trim() !== '') {
        return explicit.trim();
    }
    if (!item?.externalId) {
        return null;
    }
    const externalId = encodeURIComponent(String(item.externalId).trim());
    if (item.chamber === 'FEDERAL_SENATE') {
        return `https://www.senado.leg.br/senadores/img/fotos-oficiais/senador${externalId}.jpg`;
    }
    return `https://www.camara.leg.br/internet/deputado/bandep/${externalId}.jpg`;
}

export function normalizeLawmaker(item) {
    if (!item) return null;
    const isSenator = item.chamber === 'FEDERAL_SENATE';
    const roleLabel = isSenator ? 'Senador' : 'Deputado Federal';
    const chamberLabel = isSenator ? 'Senado Federal' : 'Câmara dos Deputados';
    const avatar = resolveOfficialPhotoUrl(item) || DEFAULT_LAWMAKER_AVATAR;

    const billsCount = Number(item.billsCount ?? item.projectsNum ?? (parseInt(item.projects, 10) || 0));
    const expensesCount = Number(item.expensesCount ?? 0);
    const totalExpensesNum = Number(item.totalExpenses ?? item.expensesNum ?? 0);

    return {
        ...item,
        id: item.id,
        name: item.name,
        party: item.party,
        state: item.state,
        chamber: item.chamber,
        chamberLabel,
        role: item.role || roleLabel,
        position: item.position || roleLabel,
        avatar,
        attendance: item.attendance || null,
        attendanceNum: typeof item.attendanceNum === 'number' ? item.attendanceNum : null,
        billsCount,
        projects: String(billsCount),
        projectsNum: billsCount,
        expensesCount,
        expenses: totalExpensesNum > 0
            ? compactCurrencyFormatter.format(totalExpensesNum)
            : (item.expenses || 'Sem registros'),
        expensesNum: totalExpensesNum,
        totalExpensesFormatted: currencyFormatter.format(totalExpensesNum),
    };
}

function mapSortToBackend(sortKey) {
    switch (sortKey) {
        case 'name_desc':
            return 'name,desc';
        case 'party_asc':
            return 'party,asc';
        case 'state_asc':
            return 'state,asc';
        case 'name_asc':
        default:
            return 'name,asc';
    }
}

function sortClientItems(items, sortKey) {
    const list = [...items];
    list.sort((a, b) => {
        if (sortKey === 'name_desc') return (b.name || '').localeCompare(a.name || '');
        if (sortKey === 'bills_desc') return (b.billsCount || 0) - (a.billsCount || 0);
        if (sortKey === 'expenses_asc') return (a.expensesNum || 0) - (b.expensesNum || 0);
        if (sortKey === 'expenses_desc') return (b.expensesNum || 0) - (a.expensesNum || 0);
        return (a.name || '').localeCompare(b.name || '');
    });
    return list;
}

function filterAndPaginateMock(filters = {}, pagination = { page: 1, limit: 6 }) {
    const { search = '', state = '', party = '', chamber = '', sort = 'name_asc' } = filters;
    const { page = 1, limit = 6 } = pagination;

    const filtered = MOCK_LAWMAKERS.filter((item) => {
        const matchesSearch = search
            ? item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.party.toLowerCase().includes(search.toLowerCase())
            : true;
        const matchesState = state ? item.state === state : true;
        const matchesParty = party ? item.party === party : true;
        const matchesChamber = chamber ? item.chamber === chamber : true;
        return matchesSearch && matchesState && matchesParty && matchesChamber;
    });

    const sorted = sortClientItems(filtered.map(normalizeLawmaker), sort);
    const totalElements = sorted.length;
    const startIndex = (page - 1) * limit;
    const items = sorted.slice(startIndex, startIndex + limit);

    return {
        items,
        totalElements,
        totalPages: Math.ceil(totalElements / limit) || 1,
        currentPage: page,
    };
}

function groupExpensesByYearAndCategory(rawExpenses = []) {
    if (!Array.isArray(rawExpenses) || rawExpenses.length === 0) {
        return { expensesByYear: {}, formattedRows: [], grandTotal: 0 };
    }

    const groupedByYear = {};
    const formattedRows = [];
    let grandTotal = 0;

    rawExpenses.forEach((exp) => {
        const numericAmount = Number(exp.amount || 0);
        grandTotal += numericAmount;
        const rawDate = exp.expenseDate || '';
        const yearMatch = String(rawDate).match(/^(\d{4})/);
        const yearKey = yearMatch ? `Cota ${yearMatch[1]}` : 'Registros CEAP';
        const category = exp.expenseCategory || 'Outras despesas parlamentares';

        if (!groupedByYear[yearKey]) {
            groupedByYear[yearKey] = { total: 0, byCategory: {} };
        }
        groupedByYear[yearKey].total += numericAmount;
        groupedByYear[yearKey].byCategory[category] =
            (groupedByYear[yearKey].byCategory[category] || 0) + numericAmount;

        formattedRows.push({
            id: exp.id,
            date: rawDate,
            yearKey,
            category,
            supplier: exp.supplierName || 'Fornecedor não informado',
            amountNum: numericAmount,
            amountFormatted: currencyFormatter.format(numericAmount),
            documentUrl: exp.documentUrl || null,
        });
    });

    const expensesByYear = {};
    Object.keys(groupedByYear)
        .sort((a, b) => b.localeCompare(a))
        .forEach((yearKey) => {
            const yearBucket = groupedByYear[yearKey];
            const yearTotal = yearBucket.total || 1;

            expensesByYear[yearKey] = Object.entries(yearBucket.byCategory)
                .map(([category, sumAmount]) => {
                    const percentage = Math.min(100, Math.max(1, Math.round((sumAmount / yearTotal) * 100)));
                    const tone = percentage >= 35 ? 'high' : percentage >= 18 ? 'medium' : 'low';
                    return {
                        title: category,
                        category,
                        amountNum: sumAmount,
                        amount: currencyFormatter.format(sumAmount),
                        percentage,
                        tone,
                    };
                })
                .sort((a, b) => b.amountNum - a.amountNum);
        });

    const grandDenominator = grandTotal || 1;
    const enrichedRows = formattedRows.map((row) => ({
        ...row,
        percentage: Number(((row.amountNum / grandDenominator) * 100).toFixed(1)),
    }));

    return { expensesByYear, formattedRows: enrichedRows, grandTotal };
}

export const lawmakersService = {
    async getLawmakers(filters = {}, pagination = { page: 1, limit: 6 }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            return filterAndPaginateMock(filters, pagination);
        }

        const { search = '', state = '', party = '', chamber = '', sort = 'name_asc' } = filters;
        const pageNumber = Math.max(0, (pagination.page || 1) - 1);
        const pageSize = pagination.limit || 6;

        const res = await apiClient('/transparencia/parlamentares', {
            params: {
                page: pageNumber,
                size: pageSize,
                sort: mapSortToBackend(sort),
                search: search.trim() || undefined,
                state: state.trim() || undefined,
                party: party.trim() || undefined,
                chamber: chamber || undefined,
            },
        });

        const rawItems = res?.content ?? (Array.isArray(res) ? res : []);
        let normalizedItems = rawItems.map(normalizeLawmaker);

        if (sort === 'bills_desc' || sort === 'expenses_asc' || sort === 'expenses_desc') {
            normalizedItems = sortClientItems(normalizedItems, sort);
        }

        return {
            items: normalizedItems,
            totalElements: res?.page?.totalElements ?? res?.totalElements ?? normalizedItems.length,
            totalPages: res?.page?.totalPages ?? res?.totalPages ?? 1,
            currentPage: pagination.page || 1,
        };
    },

    async getLawmakerById(id) {
        if (!id) return null;

        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            const numId = Number(id);
            const found = MOCK_LAWMAKERS.find((l) => l.id === numId);
            return found ? normalizeLawmaker(found) : null;
        }

        const [lawmakerRes, expensesRes, billsRes] = await Promise.allSettled([
            apiClient(`/transparencia/parlamentares/${encodeURIComponent(id)}`),
            apiClient('/transparencia/despesas', {
                params: { parliamentarianId: id, size: 200 },
            }),
            apiClient('/transparencia/projetos-lei', {
                params: { authorId: id, size: 50 },
            }),
        ]);

        if (lawmakerRes.status === 'rejected') {
            if (lawmakerRes.reason?.status === 404) return null;
            throw lawmakerRes.reason;
        }

        const data = lawmakerRes.value;
        if (!data) return null;

        const rawExpenses =
            expensesRes.status === 'fulfilled'
                ? expensesRes.value?.content ?? (Array.isArray(expensesRes.value) ? expensesRes.value : [])
                : [];

        const rawBills =
            billsRes.status === 'fulfilled'
                ? billsRes.value?.content ?? (Array.isArray(billsRes.value) ? billsRes.value : [])
                : [];

        const { expensesByYear, formattedRows, grandTotal } = groupExpensesByYearAndCategory(rawExpenses);
        const totalExpenses = grandTotal > 0 ? grandTotal : Number(data.totalExpenses || 0);
        const billsCount = rawBills.length > 0 ? rawBills.length : Number(data.billsCount || 0);
        const expensesCount = rawExpenses.length > 0 ? rawExpenses.length : Number(data.expensesCount || 0);

        return normalizeLawmaker({
            ...data,
            totalExpenses,
            expensesCount,
            billsCount,
            expensesByYear,
            quotaExpenses: expensesByYear,
            expenseRecords: formattedRows,
            bills: rawBills,
            totalExpensesFormatted: currencyFormatter.format(totalExpenses),
        });
    },

    async getCongressionalStats() {
        if (USE_MOCKS) {
            return CONGRESSIONAL_STATS;
        }

        const data = await apiClient('/transparencia/resumo');
        const deputiesCount = Number(data?.deputiesCount || 0);
        const senatorsCount = Number(data?.senatorsCount || 0);
        const totalParliamentarians = Number(data?.totalParliamentarians ?? deputiesCount + senatorsCount);
        const totalExpensesAmount = Number(data?.totalExpensesAmount || 0);
        const totalExpensesCount = Number(data?.totalExpensesCount || 0);
        const totalBillsCount = Number(data?.totalBillsCount || 0);

        return {
            totalParliamentarians,
            deputiesCount,
            senatorsCount,
            totalExpensesAmount,
            totalExpensesFormatted: currencyFormatter.format(totalExpensesAmount),
            totalExpensesCount,
            totalBillsCount,
        };
    },
};
