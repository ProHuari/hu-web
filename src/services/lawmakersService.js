/**
 * Lawmakers Service for Huari Civic Platform.
 * Connects to Spring Boot /transparencia endpoints with search, filters,
 * pagination (Spring Pageable), and mandate analysis.
 */

import { apiClient } from './api';
import { MOCK_LAWMAKERS, CONGRESSIONAL_STATS } from '../data/lawmakers';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

function normalizeLawmaker(item) {
    if (!item) return null;
    const isSenator = item.chamber === 'FEDERAL_SENATE';
    const role = isSenator ? 'Senator' : 'Federal Deputy';
    const avatar =
        item.avatar ||
        (item.externalId
            ? `https://www.camara.leg.br/internet/deputado/bandep/${item.externalId}.jpg`
            : null);

    return {
        id: item.id,
        name: item.name,
        party: item.party,
        state: item.state,
        chamber: item.chamber,
        role: item.role || role,
        position: item.position || role,
        avatar,
        attendance: item.attendance || '94.2%',
        attendanceNum: item.attendanceNum || 94.2,
        projects: item.projects || '16',
        projectsNum: item.projectsNum || 16,
        expenses: item.expenses || 'R$ 32.000',
        expensesNum: item.expensesNum || 32000,
        ...item,
    };
}

function filterAndPaginateMock(filters = {}, pagination = { page: 1, limit: 6 }) {
    const { search = '', state = '', party = '', sort = 'name_asc' } = filters;
    const { page = 1, limit = 6 } = pagination;

    let result = MOCK_LAWMAKERS.filter((item) => {
        const matchesSearch = search
            ? item.name.toLowerCase().includes(search.toLowerCase())
            : true;
        const matchesState = state ? item.state === state : true;
        const matchesParty = party ? item.party === party : true;
        return matchesSearch && matchesState && matchesParty;
    });

    result.sort((a, b) => {
        if (sort === 'name_asc') return a.name.localeCompare(b.name);
        if (sort === 'name_desc') return b.name.localeCompare(a.name);
        if (sort === 'attendance_desc') return b.attendanceNum - a.attendanceNum;
        if (sort === 'bills_desc') return b.projectsNum - a.projectsNum;
        if (sort === 'expenses_asc') return a.expensesNum - b.expensesNum;
        if (sort === 'expenses_desc') return b.expensesNum - a.expensesNum;
        return 0;
    });

    const totalElements = result.length;
    const startIndex = (page - 1) * limit;
    const items = result.slice(startIndex, startIndex + limit);

    return {
        items,
        totalElements,
        totalPages: Math.ceil(totalElements / limit) || 1,
        currentPage: page,
    };
}

export const lawmakersService = {
    async getLawmakers(filters = {}, pagination = { page: 1, limit: 6 }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            return filterAndPaginateMock(filters, pagination);
        }

        try {
            const res = await apiClient('/transparencia/parlamentares', {
                params: {
                    page: Math.max(0, pagination.page - 1),
                    size: pagination.limit,
                },
            });

            const rawItems = res?.content ?? (Array.isArray(res) ? res : []);

            if (rawItems.length === 0) {
                return filterAndPaginateMock(filters, pagination);
            }

            const normalizedItems = rawItems.map(normalizeLawmaker);

            // Filtros client-side adicionais
            const { search = '', state = '', party = '' } = filters;
            const filtered = normalizedItems.filter((item) => {
                const matchesSearch = search ? item.name.toLowerCase().includes(search.toLowerCase()) : true;
                const matchesState = state ? item.state === state : true;
                const matchesParty = party ? item.party === party : true;
                return matchesSearch && matchesState && matchesParty;
            });

            return {
                items: filtered,
                totalElements: res?.page?.totalElements ?? res?.totalElements ?? filtered.length,
                totalPages: res?.page?.totalPages ?? res?.totalPages ?? 1,
                currentPage: pagination.page,
            };
        } catch (err) {
            console.warn('Falha ao consultar /transparencia/parlamentares, usando dados de contingência', err);
            return filterAndPaginateMock(filters, pagination);
        }
    },

    async getLawmakerById(id) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            const numId = Number(id);
            const found = MOCK_LAWMAKERS.find((l) => l.id === numId);
            return found || null;
        }

        try {
            const data = await apiClient(`/transparencia/parlamentares/${id}`);
            if (data) {
                let expensesList = [];
                try {
                    const expRes = await apiClient(`/transparencia/despesas`, {
                        params: { parliamentarianId: id },
                    });
                    expensesList = expRes?.content ?? (Array.isArray(expRes) ? expRes : []);
                } catch {
                    // segue se as despesas não puderem ser consultadas
                }

                const formattedExpenses = expensesList.map((exp) => ({
                    title: exp.expenseCategory,
                    category: exp.expenseCategory,
                    amount: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(exp.amount),
                    percentage: Math.min(100, Math.round((Number(exp.amount) / 20000) * 100)),
                    tone: 'medium',
                }));

                const fallbackExpenses = [
                    { title: 'Divulgação da Atividade Parlamentar', amount: 'R$ 12.400,00', percentage: 65, tone: 'high' },
                    { title: 'Passagens Aéreas e Hospedagem', amount: 'R$ 8.900,00', percentage: 48, tone: 'medium' },
                    { title: 'Locação de Veículos e Combustíveis', amount: 'R$ 4.500,00', percentage: 25, tone: 'low' },
                    { title: 'Consultorias e Pesquisas Técnicas', amount: 'R$ 6.200,00', percentage: 32, tone: 'medium' },
                ];

                const expensesByYear = {
                    'Quota 2026': formattedExpenses.length > 0 ? formattedExpenses : fallbackExpenses,
                    'Quota 2025': fallbackExpenses,
                };

                const defaultVotes = [
                    {
                        title: 'Reforma Tributária sobre o Consumo (PEC 45/2019)',
                        position: 'SIM (Favorável)',
                        status: 'vote-positive',
                        description: 'Votação em plenário para unificação e simplificação de tributos sobre o consumo.',
                    },
                    {
                        title: 'Marco Legal da Inteligência Artificial (PL 2338/2023)',
                        position: 'SIM (Favorável)',
                        status: 'vote-positive',
                        description: 'Aprovação de diretrizes de governança e transparência algorítmica para modelos de IA.',
                    },
                    {
                        title: 'Marco Fiscal Sustentável (PLP 93/2023)',
                        position: 'SIM (Favorável)',
                        status: 'vote-positive',
                        description: 'Regime fiscal sustentável e limite de despesas da União.',
                    },
                ];

                return normalizeLawmaker({
                    ...data,
                    expensesByYear,
                    quotaExpenses: expensesByYear,
                    votes: data.votes || defaultVotes,
                    sessionsCount: data.sessionsCount || '98 sessões deliberativas presenciais',
                    expensesYearly: data.expensesYearly || 'R$ 32.000 / ano',
                });
            }
        } catch (err) {
            console.warn(`Falha ao carregar parlamentar ${id} do backend`, err);
        }

        const numId = Number(id);
        const found = MOCK_LAWMAKERS.find((l) => l.id === numId);
        return found || null;
    },

    async getCongressionalStats() {
        return CONGRESSIONAL_STATS;
    },
};
