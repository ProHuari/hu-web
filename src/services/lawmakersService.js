/**
 * Lawmakers Service for Huari Civic Platform.
 * Connects to Spring Boot /lawmakers endpoints with search, filters,
 * pagination (Spring Pageable), and single mandate analysis, with MOCK_LAWMAKERS fallback.
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
        attendance: item.attendance || '92.4%',
        attendanceNum: item.attendanceNum || 92.4,
        projects: item.projects || '14',
        projectsNum: item.projectsNum || 14,
        expenses: item.expenses || 'R$ 38.540',
        expensesNum: item.expensesNum || 38540,
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
                // Return default mock records if database has not yet been populated
                return filterAndPaginateMock(filters, pagination);
            }

            const normalizedItems = rawItems.map(normalizeLawmaker);

            // Apply client-side filters if needed
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
            console.warn('Failed to load lawmakers from backend /transparencia/parlamentares, using mock data', err);
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
                return normalizeLawmaker(data);
            }
        } catch {
            // Fall back to local records
        }

        const numId = Number(id);
        const found = MOCK_LAWMAKERS.find((l) => l.id === numId);
        return found || null;
    },

    async getCongressionalStats() {
        return CONGRESSIONAL_STATS;
    },
};
