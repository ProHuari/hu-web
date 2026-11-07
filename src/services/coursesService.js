/**
 * Courses Service for Huari Civic Academy.
 * Connects to Spring Boot /courses endpoints with MOCK_COURSES fallback.
 */

import { apiClient } from './api';
import { MOCK_COURSES, COURSE_CATEGORIES } from '../data/courses';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

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

        const res = await apiClient('/courses', {
            params: {
                category: filters.category !== 'All' ? filters.category : undefined,
                search: filters.search || undefined,
            },
        });

        return Array.isArray(res) ? res : (res?.content ?? res?.items ?? []);
    },

    async getCourseById(courseId) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            const course = MOCK_COURSES.find((c) => c.id === courseId);
            return course || null;
        }

        try {
            return await apiClient(`/courses/${courseId}`);
        } catch (err) {
            if (err.status === 404) {
                return null;
            }
            throw err;
        }
    },

    async getCategories() {
        if (USE_MOCKS) {
            return COURSE_CATEGORIES;
        }
        return apiClient('/courses/categories');
    },

    async toggleLesson(courseId, lessonId) {
        if (USE_MOCKS) {
            return { success: true, courseId, lessonId };
        }

        return apiClient(`/courses/${courseId}/lessons/${lessonId}/toggle`, {
            method: 'POST',
        });
    },
};
