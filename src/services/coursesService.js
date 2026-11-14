/**
 * Courses Service for Huari Civic Academy.
 * Connects to Spring Boot /cursos endpoints with nested JSON payloads
 * and localStorage-backed mock persistence when VITE_USE_MOCKS=true.
 */

import { apiClient } from './api';
import { MOCK_COURSES, COURSE_CATEGORIES } from '../data/courses';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const MOCK_STORAGE_KEY = 'huari_courses_v1';

function slugify(text) {
    return String(text || 'course')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `course-${Date.now()}`;
}

function normalizeLesson(lesson, index) {
    const resources = Array.isArray(lesson?.resources)
        ? lesson.resources.map((res, rIdx) => ({
            id: res.id || `res-${Date.now()}-${rIdx}`,
            title: res.title || 'Supporting PDF Guide',
            url: res.url || res.fileUrl || '',
        }))
        : lesson?.pdfUrl
            ? [{ id: `res-${lesson.id || index}`, title: 'PDF Study Guide', url: lesson.pdfUrl }]
            : [];

    return {
        id: lesson?.id || `lesson-${index + 1}-${Date.now()}`,
        title: lesson?.title || `Lesson ${index + 1}`,
        duration: lesson?.duration || '15 min',
        completed: Boolean(lesson?.completed),
        videoUrl: lesson?.videoUrl || '',
        summary: lesson?.summary || '',
        resources,
    };
}

function normalizeModule(mod, index) {
    const rawLessons = Array.isArray(mod?.lessons) ? mod.lessons : [];
    return {
        id: mod?.id || `mod-${index + 1}-${Date.now()}`,
        title: mod?.title || `Module ${index + 1}`,
        lessons: rawLessons.map((lesson, lIdx) => normalizeLesson(lesson, lIdx)),
    };
}

export function normalizeCourse(item) {
    if (!item) return null;

    const rawModules = Array.isArray(item.modules) ? item.modules : [];
    const normalizedModules = rawModules.map((mod, idx) => normalizeModule(mod, idx));
    const computedLessonsCount = normalizedModules.reduce(
        (acc, mod) => acc + (mod.lessons?.length || 0),
        0
    );

    const categoryName =
        typeof item.category === 'object'
            ? item.category?.name || 'General'
            : item.category || 'General';

    return {
        ...item,
        id: item.id || slugify(item.title),
        title: item.title || 'Untitled Course',
        description: item.description || '',
        category: categoryName,
        level: item.level || 'Beginner',
        duration: item.duration || '2h 00m',
        status: item.status || 'PUBLISHED',
        progress: typeof item.progress === 'number' ? item.progress : 0,
        lessonsCount: computedLessonsCount > 0 ? computedLessonsCount : item.lessonsCount || 0,
        instructor: item.author?.channelName || item.instructor || 'Huari Civic Academy',
        image: item.image || item.thumbnailUrl || item.coverUrl || null,
        objectives: Array.isArray(item.objectives) ? item.objectives.filter(Boolean) : [],
        modules: normalizedModules,
        updatedAt: item.updatedAt || new Date().toISOString(),
    };
}

function readMockStore() {
    try {
        const raw = localStorage.getItem(MOCK_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed.map(normalizeCourse);
            }
        }
    } catch (err) {
        console.warn('Failed to parse mock courses store, resetting seed', err);
    }

    const seeded = MOCK_COURSES.map((c) =>
        normalizeCourse({
            ...c,
            status: c.status || 'PUBLISHED',
        })
    );
    writeMockStore(seeded);
    return seeded;
}

function writeMockStore(courses) {
    try {
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(courses));
    } catch (err) {
        console.error('Failed to persist mock courses store', err);
    }
}

function applyCourseFilters(list, filters = {}) {
    const { category = 'All', search = '', status = 'ALL' } = filters;
    const lowerSearch = search.trim().toLowerCase();

    return list.filter((course) => {
        const matchesCategory = category === 'All' || course.category === category;
        const matchesStatus = status === 'ALL' || course.status === status;
        const matchesSearch = !lowerSearch
            ? true
            : course.title.toLowerCase().includes(lowerSearch) ||
            course.description.toLowerCase().includes(lowerSearch) ||
            course.instructor.toLowerCase().includes(lowerSearch);
        return matchesCategory && matchesStatus && matchesSearch;
    });
}

export const coursesService = {
    async getCourses(filters = {}) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 180));
            const all = readMockStore().filter((c) => c.status === 'PUBLISHED');
            return applyCourseFilters(all, filters);
        }

        const res = await apiClient('/cursos');
        const rawList = Array.isArray(res) ? res : res?.content ?? res?.items ?? [];
        const normalized = rawList
            .map(normalizeCourse)
            .filter((c) => !c.status || c.status === 'PUBLISHED');
        return applyCourseFilters(normalized, filters);
    },

    async getAdminCourses(filters = {}) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 180));
            const all = readMockStore();
            return applyCourseFilters(all, filters);
        }

        const res = await apiClient('/cursos');
        const rawList = Array.isArray(res) ? res : res?.content ?? res?.items ?? [];
        const normalized = rawList.map(normalizeCourse);
        return applyCourseFilters(normalized, filters);
    },

    async getCourseById(courseId) {
        if (!courseId) return null;

        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 160));
            const all = readMockStore();
            return all.find((c) => String(c.id) === String(courseId)) || null;
        }

        try {
            const courseData = await apiClient(`/cursos/${encodeURIComponent(courseId)}`);
            return courseData ? normalizeCourse(courseData) : null;
        } catch (err) {
            if (err?.status === 404) return null;
            throw err;
        }
    },

    async createCourse(payload) {
        const normalized = normalizeCourse({
            ...payload,
            id: payload.id || `${slugify(payload.title)}-${Date.now().toString(36)}`,
            updatedAt: new Date().toISOString(),
        });

        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 260));
            const current = readMockStore();
            const next = [normalized, ...current];
            writeMockStore(next);
            return normalized;
        }

        const created = await apiClient('/cursos', {
            method: 'POST',
            body: normalized,
        });
        return normalizeCourse(created);
    },

    async updateCourse(courseId, payload) {
        const normalized = normalizeCourse({
            ...payload,
            id: courseId,
            updatedAt: new Date().toISOString(),
        });

        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 260));
            const current = readMockStore();
            const exists = current.some((c) => String(c.id) === String(courseId));
            const next = exists
                ? current.map((c) => (String(c.id) === String(courseId) ? normalized : c))
                : [normalized, ...current];
            writeMockStore(next);
            return normalized;
        }

        const updated = await apiClient(`/cursos/${encodeURIComponent(courseId)}`, {
            method: 'PUT',
            body: normalized,
        });
        return normalizeCourse(updated);
    },

    async updateCourseStatus(courseId, status) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 180));
            const current = readMockStore();
            let updatedCourse = null;
            const next = current.map((c) => {
                if (String(c.id) === String(courseId)) {
                    updatedCourse = { ...c, status, updatedAt: new Date().toISOString() };
                    return updatedCourse;
                }
                return c;
            });
            writeMockStore(next);
            return updatedCourse;
        }

        const existing = await this.getCourseById(courseId);
        if (!existing) throw new Error('Course not found');
        return this.updateCourse(courseId, { ...existing, status });
    },

    async deleteCourse(courseId) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            const current = readMockStore();
            const next = current.filter((c) => String(c.id) !== String(courseId));
            writeMockStore(next);
            return { success: true, id: courseId };
        }

        await apiClient(`/cursos/${encodeURIComponent(courseId)}`, {
            method: 'DELETE',
        });
        return { success: true, id: courseId };
    },

    async getCategories() {
        if (USE_MOCKS) {
            const store = readMockStore();
            const dynamicNames = store.map((c) => c.category).filter(Boolean);
            return ['All', ...new Set([...COURSE_CATEGORIES.filter((c) => c !== 'All'), ...dynamicNames])];
        }

        try {
            const res = await apiClient('/categorias');
            const list = Array.isArray(res) ? res : res?.content ?? res?.items ?? [];
            if (list.length > 0) {
                const names = list.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean);
                return ['All', ...new Set(names)];
            }
            return COURSE_CATEGORIES;
        } catch {
            return COURSE_CATEGORIES;
        }
    },

    async toggleLesson(courseId, lessonId) {
        if (USE_MOCKS) {
            return { success: true, courseId, lessonId };
        }
        try {
            return await apiClient(`/cursos/${encodeURIComponent(courseId)}/aulas/${encodeURIComponent(lessonId)}/concluir`, {
                method: 'PATCH',
            });
        } catch {
            return { success: true, courseId, lessonId };
        }
    },
};
