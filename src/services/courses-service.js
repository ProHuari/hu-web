/**
 * Courses Service for Huari Civic Academy.
 * Connects to Spring Boot /cursos, /modulos, /aulas, /categorias, /autores,
 * /matriculas, and /progresso-aulas endpoints without falling back to static mocks in prod.
 */

import { apiClient } from './api';
import { MOCK_COURSES, COURSE_CATEGORIES } from '../data/courses';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';
const MOCK_STORAGE_KEY = 'huari_courses_v1';

function slugify(text) {
    return (
        String(text || 'curso')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || `curso-${Date.now()}`
    );
}

function parseDurationMinutes(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.max(0, Math.round(value));
    }
    const match = String(value || '').match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 15;
}

function formatTotalDuration(totalMinutes) {
    if (!totalMinutes || totalMinutes <= 0) return 'Livre';
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}min`;
    if (hours > 0) return `${hours}h`;
    return `${mins} min`;
}

function normalizeLesson(lesson, index) {
    const durationInMinutes = parseDurationMinutes(
        lesson?.durationInMinutes ?? lesson?.duration
    );
    const resources = Array.isArray(lesson?.resources)
        ? lesson.resources.map((res, rIdx) => ({
            id: res.id || `res-${Date.now()}-${rIdx}`,
            title: res.title || 'Material complementar',
            url: res.url || res.fileUrl || '',
        }))
        : lesson?.pdfUrl
            ? [{ id: `res-${lesson.id || index}`, title: 'Guia de estudo em PDF', url: lesson.pdfUrl }]
            : [];

    return {
        id: lesson?.id ?? `lesson-${index + 1}-${Date.now()}`,
        title: lesson?.title || `Aula ${index + 1}`,
        durationInMinutes,
        duration: lesson?.duration || `${durationInMinutes} min`,
        position: lesson?.position || index + 1,
        completed: Boolean(lesson?.completed),
        videoUrl: lesson?.videoUrl || '',
        summary: lesson?.summary || lesson?.description || '',
        resources,
    };
}

function normalizeModule(mod, index) {
    const rawLessons = Array.isArray(mod?.lessons) ? mod.lessons : [];
    const sortedLessons = [...rawLessons].sort((a, b) => (a?.position || 0) - (b?.position || 0));
    return {
        id: mod?.id ?? `mod-${index + 1}-${Date.now()}`,
        title: mod?.title || `Módulo ${index + 1}`,
        description: mod?.description || '',
        position: mod?.position || index + 1,
        lessons: sortedLessons.map((lesson, lIdx) => normalizeLesson(lesson, lIdx)),
    };
}

export function normalizeCourse(item) {
    if (!item) return null;

    const rawModules = Array.isArray(item.modules) ? item.modules : [];
    const sortedModules = [...rawModules].sort((a, b) => (a?.position || 0) - (b?.position || 0));
    const normalizedModules = sortedModules.map((mod, idx) => normalizeModule(mod, idx));
    const computedLessonsCount = normalizedModules.reduce(
        (acc, mod) => acc + (mod.lessons?.length || 0),
        0
    );
    const computedMinutes = normalizedModules.reduce(
        (acc, mod) =>
            acc + mod.lessons.reduce((lAcc, l) => lAcc + (l.durationInMinutes || 0), 0),
        0
    );

    const categoryName =
        typeof item.category === 'object'
            ? item.category?.name || 'Geral'
            : item.category || 'Geral';

    const categoryId =
        typeof item.category === 'object'
            ? item.category?.id ?? null
            : item.categoryId ?? null;

    const authorId =
        typeof item.author === 'object'
            ? item.author?.id ?? null
            : item.authorId ?? null;

    return {
        ...item,
        id: item.id || slugify(item.title),
        title: item.title || 'Trilha sem título',
        description: item.description || '',
        category: categoryName,
        categoryId,
        authorId,
        level: item.level || 'Introdutório',
        duration: item.duration || formatTotalDuration(computedMinutes),
        status: item.status || 'PUBLISHED',
        progress: typeof item.progress === 'number' ? item.progress : 0,
        lessonsCount: computedLessonsCount > 0 ? computedLessonsCount : item.lessonsCount || 0,
        instructor:
            item.author?.channelName ||
            item.author?.name ||
            item.instructor ||
            'Academia Cívica Huari',
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
    const normalizedCat = category === 'Todas' || category === 'All' ? 'All' : category;
    const lowerSearch = search.trim().toLowerCase();

    return list.filter((course) => {
        const matchesCategory = normalizedCat === 'All' || course.category === normalizedCat;
        const matchesStatus = status === 'ALL' || course.status === status;
        const matchesSearch = !lowerSearch
            ? true
            : course.title.toLowerCase().includes(lowerSearch) ||
              course.description.toLowerCase().includes(lowerSearch) ||
              course.instructor.toLowerCase().includes(lowerSearch);
        return matchesCategory && matchesStatus && matchesSearch;
    });
}

async function resolveCategoryId(payload) {
    if (typeof payload.categoryId === 'number' && payload.categoryId > 0) {
        return payload.categoryId;
    }

    const desiredName = String(payload.category || 'Educação Cívica').trim();
    const res = await apiClient('/categorias', { params: { page: 0, size: 100 } });
    const list = res?.content ?? (Array.isArray(res) ? res : []);
    const matched = list.find(
        (c) => String(c.name || '').trim().toLowerCase() === desiredName.toLowerCase()
    );
    if (matched?.id) return matched.id;
    if (list.length > 0 && !payload.category) return list[0].id;

    try {
        const created = await apiClient('/categorias', {
            method: 'POST',
            body: { name: desiredName },
        });
        if (created?.id) return created.id;
    } catch {
        if (list.length > 0) return list[0].id;
    }
    return 1;
}

async function resolveAuthorId(payload) {
    if (typeof payload.authorId === 'number' && payload.authorId > 0) {
        return payload.authorId;
    }

    const desiredName = String(payload.instructor || 'Academia Cívica Huari').trim();
    const res = await apiClient('/autores', { params: { page: 0, size: 100 } });
    const list = res?.content ?? (Array.isArray(res) ? res : []);
    const matched = list.find(
        (a) =>
            String(a.channelName || '').trim().toLowerCase() === desiredName.toLowerCase() ||
            String(a.name || '').trim().toLowerCase() === desiredName.toLowerCase()
    );
    if (matched?.id) return matched.id;
    if (list.length > 0) return list[0].id;

    const created = await apiClient('/autores', {
        method: 'POST',
        body: { name: desiredName, channelName: desiredName },
    });
    return created?.id || 1;
}

function buildLessonVideoUrl(lesson, courseId, modIndex, lessonIndex) {
    const candidate = String(lesson?.videoUrl || '').trim();
    if (/^https?:\/\/.+/i.test(candidate)) {
        return candidate;
    }
    return `https://www.youtube.com/watch?v=huari-${courseId}-${modIndex + 1}-${lessonIndex + 1}-${Date.now().toString(36)}`;
}

async function persistCurriculumForCourse(courseId, modules = []) {
    if (!Array.isArray(modules) || modules.length === 0) {
        return [];
    }

    const savedModules = [];
    for (let mIdx = 0; mIdx < modules.length; mIdx += 1) {
        const mod = modules[mIdx];
        const modPayload = {
            title: String(mod.title || `Módulo ${mIdx + 1}`).trim(),
            description: String(mod.description || '').trim() || undefined,
            position: mIdx + 1,
            courseId: Number(courseId),
        };

        const numericModId = /^\d+$/.test(String(mod.id)) ? Number(mod.id) : null;
        const savedMod = await apiClient(
            numericModId ? `/modulos/${numericModId}` : '/modulos',
            {
                method: numericModId ? 'PUT' : 'POST',
                body: modPayload,
            }
        );

        const modId = savedMod?.id;
        const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
        const savedLessons = [];

        for (let lIdx = 0; lIdx < lessons.length; lIdx += 1) {
            const lesson = lessons[lIdx];
            const lessonPayload = {
                title: String(lesson.title || `Aula ${lIdx + 1}`).trim(),
                description:
                    String(lesson.summary || lesson.description || lesson.title || `Conteúdo da aula ${lIdx + 1}`).trim(),
                videoUrl: buildLessonVideoUrl(lesson, courseId, mIdx, lIdx),
                position: lIdx + 1,
                durationInMinutes: parseDurationMinutes(lesson.durationInMinutes ?? lesson.duration),
                moduleId: Number(modId),
            };

            const numericLessonId = /^\d+$/.test(String(lesson.id)) ? Number(lesson.id) : null;
            const savedLesson = await apiClient(
                numericLessonId ? `/aulas/${numericLessonId}` : '/aulas',
                {
                    method: numericLessonId ? 'PUT' : 'POST',
                    body: lessonPayload,
                }
            );
            if (savedLesson) savedLessons.push(savedLesson);
        }

        savedModules.push({ ...savedMod, lessons: savedLessons });
    }

    return savedModules;
}

export const coursesService = {
    async getCourses(filters = {}) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 180));
            const all = readMockStore().filter((c) => c.status === 'PUBLISHED');
            return applyCourseFilters(all, filters);
        }

        const res = await apiClient('/cursos', {
            params: { page: 0, size: 100 },
        });
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

        const res = await apiClient('/cursos', {
            params: { page: 0, size: 100 },
        });
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
            if (/^\d+$/.test(String(courseId))) {
                const courseData = await apiClient(`/cursos/${encodeURIComponent(courseId)}`);
                if (courseData) return normalizeCourse(courseData);
            }

            const allCourses = await this.getCourses();
            const found = allCourses.find(
                (c) => String(c.id) === String(courseId) || slugify(c.title) === String(courseId)
            );
            if (found) {
                if (/^\d+$/.test(String(found.id))) {
                    try {
                        const detailed = await apiClient(`/cursos/${found.id}`);
                        if (detailed) return normalizeCourse(detailed);
                    } catch {
                        // usa o objeto encontrado
                    }
                }
                return found;
            }
            return null;
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

        const [categoryId, authorId] = await Promise.all([
            resolveCategoryId(payload),
            resolveAuthorId(payload),
        ]);

        const requestBody = {
            title: payload.title,
            description: payload.description || 'Trilha de formação cívica e auditoria cidadã.',
            videoUrl: /^https?:\/\/.+/i.test(String(payload.videoUrl || ''))
                ? payload.videoUrl.trim()
                : undefined,
            categoryId,
            authorId,
        };

        const created = await apiClient('/cursos', {
            method: 'POST',
            body: requestBody,
        });

        let syncedModules = [];
        if (created?.id && Array.isArray(payload.modules) && payload.modules.length > 0) {
            syncedModules = await persistCurriculumForCourse(created.id, payload.modules);
        }

        return normalizeCourse({ ...created, modules: syncedModules.length > 0 ? syncedModules : payload.modules });
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

        const [categoryId, authorId] = await Promise.all([
            resolveCategoryId(payload),
            resolveAuthorId(payload),
        ]);

        const requestBody = {
            title: payload.title,
            description: payload.description || 'Trilha de formação cívica e auditoria cidadã.',
            videoUrl: /^https?:\/\/.+/i.test(String(payload.videoUrl || ''))
                ? payload.videoUrl.trim()
                : undefined,
            categoryId,
            authorId,
        };

        const updated = await apiClient(`/cursos/${encodeURIComponent(courseId)}`, {
            method: 'PUT',
            body: requestBody,
        });

        let syncedModules = payload.modules;
        if (updated?.id && Array.isArray(payload.modules) && payload.modules.length > 0) {
            try {
                const persisted = await persistCurriculumForCourse(updated.id, payload.modules);
                if (persisted.length > 0) syncedModules = persisted;
            } catch (syncErr) {
                console.warn('Falha parcial ao sincronizar módulos/aulas do curso', syncErr);
            }
        }

        return normalizeCourse({ ...updated, modules: syncedModules });
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
        if (!existing) throw new Error('Curso não encontrado.');
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
            return ['Todas', ...new Set([...COURSE_CATEGORIES.filter((c) => c !== 'All'), ...dynamicNames])];
        }

        const res = await apiClient('/categorias', { params: { page: 0, size: 100 } });
        const list = Array.isArray(res) ? res : res?.content ?? res?.items ?? [];
        const names = list.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean);
        return ['Todas', ...new Set(names)];
    },

    async getCategoriesDetailed() {
        if (USE_MOCKS) {
            return COURSE_CATEGORIES.filter((c) => c !== 'All').map((name, idx) => ({
                id: idx + 1,
                name,
            }));
        }
        const res = await apiClient('/categorias', { params: { page: 0, size: 100 } });
        return Array.isArray(res) ? res : res?.content ?? res?.items ?? [];
    },

    async ensureEnrolled(courseId) {
        if (USE_MOCKS || !/^\d+$/.test(String(courseId))) {
            return { enrolled: true };
        }
        try {
            await apiClient('/matriculas', {
                method: 'POST',
                body: { courseId: Number(courseId) },
            });
            return { enrolled: true };
        } catch (err) {
            if (err?.status === 409) {
                return { enrolled: true, alreadyEnrolled: true };
            }
            throw err;
        }
    },

    async getCompletedLessonIds() {
        if (USE_MOCKS) {
            return [];
        }
        const res = await apiClient('/progresso-aulas', { params: { page: 0, size: 200 } });
        const list = res?.content ?? (Array.isArray(res) ? res : []);
        return list
            .filter((item) => item?.status === 'COMPLETED' && item?.lessonId != null)
            .map((item) => String(item.lessonId));
    },

    async toggleLesson(courseId, lessonId, completed = true) {
        if (USE_MOCKS) {
            return { success: true, courseId, lessonId, completed };
        }

        const numericCourseId = parseInt(String(courseId).replace(/\D+/g, ''), 10);
        const numericLessonId = parseInt(String(lessonId).replace(/\D+/g, ''), 10);
        if (!numericLessonId) {
            throw new Error('Identificador inválido para registrar o progresso da aula.');
        }

        if (numericCourseId) {
            await this.ensureEnrolled(numericCourseId);
        }

        return apiClient('/progresso-aulas', {
            method: 'POST',
            body: {
                lessonId: numericLessonId,
                status: completed ? 'COMPLETED' : 'IN_PROGRESS',
            },
        });
    },
};
