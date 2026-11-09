/**
 * Courses Service for Huari Civic Academy.
 * Connects to Spring Boot /courses endpoints with MOCK_COURSES fallback.
 */

import { apiClient } from './api';
import { MOCK_COURSES, COURSE_CATEGORIES } from '../data/courses';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

function normalizeCourse(item) {
    if (!item) return null;
    return {
        id: item.id,
        title: item.title,
        description: item.description,
        category: typeof item.category === 'object' ? (item.category?.name || 'General') : (item.category || 'General'),
        level: item.level || 'Beginner',
        duration: item.duration || '2h 30m',
        progress: item.progress || 0,
        lessonsCount: item.lessonsCount || 6,
        instructor: item.author?.channelName || item.instructor || 'Huari Civic Academy',
        image: item.image || item.videoUrl || null,
        modules: item.modules || [
            {
                id: 'module-1',
                title: 'Foundations & Institutional Architecture',
                lessons: [
                    { id: 'lesson-1', title: 'Introduction to Legislative Oversight', duration: '12 min' },
                    { id: 'lesson-2', title: 'Open Data Repositories & API Access', duration: '18 min' },
                ],
            },
        ],
        ...item,
    };
}

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

        try {
            const res = await apiClient('/cursos');
            const rawList = Array.isArray(res) ? res : (res?.content ?? res?.items ?? []);

            if (rawList.length === 0) {
                // Return MOCK_COURSES as default seed when backend database is newly initialized
                return MOCK_COURSES;
            }

            let normalized = rawList.map(normalizeCourse);
            const { category = 'All', search = '' } = filters;

            return normalized.filter((course) => {
                const matchesCategory =
                    category === 'All' || course.category === category;
                const matchesSearch = search
                    ? course.title.toLowerCase().includes(search.toLowerCase()) ||
                      course.description.toLowerCase().includes(search.toLowerCase())
                    : true;
                return matchesCategory && matchesSearch;
            });
        } catch (err) {
            console.warn('Failed to load courses from backend /cursos, using mock tracks', err);
            return MOCK_COURSES;
        }
    },

    async getCourseById(courseId) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            const course = MOCK_COURSES.find((c) => String(c.id) === String(courseId));
            return course || null;
        }

        try {
            if (/^\d+$/.test(courseId)) {
                const courseData = await apiClient(`/cursos/${courseId}`);
                if (courseData) {
                    return normalizeCourse(courseData);
                }
            }
        } catch {
            // Fall back to local courses
        }

        const foundMock = MOCK_COURSES.find((c) => String(c.id) === String(courseId));
        return foundMock || null;
    },

    async getCategories() {
        if (USE_MOCKS) {
            return COURSE_CATEGORIES;
        }

        try {
            const res = await apiClient('/categorias');
            const list = Array.isArray(res) ? res : (res?.content ?? res?.items ?? []);
            if (list.length > 0) {
                const names = list.map((c) => c.name);
                return ['All', ...new Set(names)];
            }
            return COURSE_CATEGORIES;
        } catch {
            return COURSE_CATEGORIES;
        }
    },

    async toggleLesson(courseId, lessonId) {
        return { success: true, courseId, lessonId };
    },
};
