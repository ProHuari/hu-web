/**
 * Lawmakers Service for Huari Civic Platform.
 * Connects to Spring Boot /lawmakers endpoints with search, filters,
 * pagination, and single mandate analysis, with MOCK_LAWMAKERS fallback.
 */

import { apiClient } from './api';
import { MOCK_LAWMAKERS, CONGRESSIONAL_STATS } from '../data/lawmakers';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const lawmakersService = {
    async getLawmakers(filters = {}, pagination = { page: 1, limit: 6 }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 250));
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
                totalPages: Math.ceil(totalElements / limit),
                currentPage: page,
            };
        }

        return apiClient('/lawmakers', {
            params: {
                page: pagination.page,
                size: pagination.limit,
                search: filters.search,
                state: filters.state,
                party: filters.party,
                sort: filters.sort,
            },
        });
    },

    async getLawmakerById(id) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            const numId = Number(id);
            const found = MOCK_LAWMAKERS.find((l) => l.id === numId);
            if (!found) {
                return null;
            }
            return found;
        }

        return apiClient(`/lawmakers/${id}`);
    },

    async getCongressionalStats() {
        if (USE_MOCKS) {
            return CONGRESSIONAL_STATS;
        }
        return apiClient('/lawmakers/stats');
    },
};
