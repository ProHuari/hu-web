/**
 * Courses Service for Huari Civic Academy.
 * Connects to Spring Boot /courses endpoints with MOCK_COURSES fallback.
 */

import { apiClient } from './api';
import { MOCK_COURSES, COURSE_CATEGORIES } from '../data/courses';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const coursesService = {
    async getCourses(filters = {}) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            const { category = 'All', search = '' } = filters;

            return MOCK_COURSES.filter((course) => {
                const matchesCategory =
                    category === 'All' || course.category === category;
                const matchesSearch =
                    course.title.toLowerCase().includes(search.toLowerCase()) ||
                    course.description.toLowerCase().includes(search.toLowerCase());
                return matchesCategory && matchesSearch;
            });
        }

        return apiClient('/courses', {
            params: {
                category: filters.category,
                search: filters.search,
            },
        });
    },

    async getCourseById(courseId) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            const course = MOCK_COURSES.find((c) => c.id === courseId);
            return course || null;
        }

        return apiClient(`/courses/${courseId}`);
    },

    async getCategories() {
        if (USE_MOCKS) {
            return COURSE_CATEGORIES;
        }
        return apiClient('/courses/categories');
    },
};
