import { COURSE_CATEGORIES } from '../data/courses';

export const COURSE_LEVELS = ['Introdutório', 'Intermediário', 'Avançado'];
export const COURSE_STATUSES = ['DRAFT', 'PUBLISHED'];
export const AVAILABLE_CATEGORIES = COURSE_CATEGORIES.filter(
    (c) => c !== 'All' && c !== 'Todas'
);

export function isValidHttpUrl(value) {
    if (!value || !String(value).trim()) return false;
    try {
        const parsed = new URL(String(value).trim());
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

export function isValidVideoUrl(value) {
    if (!value || !String(value).trim()) return true;
    if (!isValidHttpUrl(value)) return false;
    const raw = String(value).trim().toLowerCase();
    return (
        raw.includes('youtube.com') ||
        raw.includes('youtu.be') ||
        raw.includes('vimeo.com') ||
        raw.endsWith('.mp4') ||
        raw.endsWith('.webm') ||
        raw.includes('youtube-nocookie.com')
    );
}

export function createEmptyLesson(index = 0) {
    return {
        id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: `Aula ${index + 1}`,
        duration: '15 min',
        completed: false,
        videoUrl: '',
        summary: '',
        resources: [],
    };
}

export function createEmptyModule(index = 0) {
    return {
        id: `mod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: `Módulo ${index + 1}: Novo tema`,
        lessons: [createEmptyLesson(0)],
    };
}

export function createEmptyCourse() {
    return {
        id: null,
        title: '',
        description: '',
        category: AVAILABLE_CATEGORIES[0] || 'Educação Cívica',
        level: 'Introdutório',
        duration: 'Livre',
        instructor: 'Academia Cívica Huari',
        image: '',
        status: 'DRAFT',
        objectives: [''],
        modules: [createEmptyModule(0)],
    };
}

export function validateCourseForSave(course, targetStatus = 'DRAFT') {
    const errors = {};
    const title = String(course?.title || '').trim();
    const description = String(course?.description || '').trim();
    const image = String(course?.image || '').trim();

    if (title.length < 3) {
        errors.title = 'O título do curso deve ter pelo menos 3 caracteres.';
    }

    if (!course?.category || !String(course.category).trim()) {
        errors.category = 'Selecione uma categoria.';
    }

    if (image && !isValidHttpUrl(image)) {
        errors.image = 'A URL da imagem de capa precisa começar com http:// ou https://.';
    }

    if (targetStatus === 'PUBLISHED') {
        if (description.length < 20) {
            errors.description = 'Para publicar, escreva uma descrição com pelo menos 20 caracteres.';
        }

        const modules = Array.isArray(course?.modules) ? course.modules : [];
        if (modules.length === 0) {
            errors.modules = 'Adicione pelo menos 1 módulo antes de publicar.';
        } else {
            const totalLessons = modules.reduce(
                (acc, mod) => acc + (Array.isArray(mod.lessons) ? mod.lessons.length : 0),
                0
            );
            if (totalLessons === 0) {
                errors.modules = 'Adicione pelo menos 1 aula antes de publicar.';
            }

            for (let m = 0; m < modules.length; m++) {
                const mod = modules[m];
                if (!String(mod?.title || '').trim()) {
                    errors.modules = `O módulo ${m + 1} precisa de um título.`;
                    break;
                }
                const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
                for (let l = 0; l < lessons.length; l++) {
                    const lesson = lessons[l];
                    if (!String(lesson?.title || '').trim()) {
                        errors.modules = `A aula ${l + 1} do módulo ${m + 1} precisa de um título.`;
                        break;
                    }
                    if (lesson.videoUrl && !isValidVideoUrl(lesson.videoUrl)) {
                        errors.modules = `"${lesson.title}" tem uma URL de vídeo inválida (use YouTube, Vimeo ou link direto MP4/WebM).`;
                        break;
                    }
                    const badRes = (lesson.resources || []).find(
                        (r) => r.url && !isValidHttpUrl(r.url)
                    );
                    if (badRes) {
                        errors.modules = `"${lesson.title}" possui um link de material inválido.`;
                        break;
                    }
                }
                if (errors.modules) break;
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
