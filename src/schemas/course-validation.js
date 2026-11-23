import { COURSE_CATEGORIES } from '../data/courses';

export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const COURSE_STATUSES = ['DRAFT', 'PUBLISHED'];
export const AVAILABLE_CATEGORIES = COURSE_CATEGORIES.filter((c) => c !== 'All');

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
    if (!value || !String(value).trim()) return true; // optional unless enforced
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
        title: `Lesson ${index + 1}`,
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
        title: `Module ${index + 1}: New Topic`,
        lessons: [createEmptyLesson(0)],
    };
}

export function createEmptyCourse() {
    return {
        id: null,
        title: '',
        description: '',
        category: AVAILABLE_CATEGORIES[0] || 'Legislation',
        level: 'Beginner',
        duration: '2h 00m',
        instructor: 'Huari Civic Academy',
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
        errors.title = 'Course title must be at least 3 characters.';
    }

    if (!course?.category || !String(course.category).trim()) {
        errors.category = 'Please choose a category.';
    }

    if (image && !isValidHttpUrl(image)) {
        errors.image = 'Cover image must be a valid http/https URL.';
    }

    if (targetStatus === 'PUBLISHED') {
        if (description.length < 20) {
            errors.description = 'Published courses require a description of at least 20 characters.';
        }

        const modules = Array.isArray(course?.modules) ? course.modules : [];
        if (modules.length === 0) {
            errors.modules = 'Add at least 1 module before publishing.';
        } else {
            const totalLessons = modules.reduce(
                (acc, mod) => acc + (Array.isArray(mod.lessons) ? mod.lessons.length : 0),
                0
            );
            if (totalLessons === 0) {
                errors.modules = 'Add at least 1 lesson before publishing.';
            }

            for (let m = 0; m < modules.length; m++) {
                const mod = modules[m];
                if (!String(mod?.title || '').trim()) {
                    errors.modules = `Module ${m + 1} needs a title.`;
                    break;
                }
                const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
                for (let l = 0; l < lessons.length; l++) {
                    const lesson = lessons[l];
                    if (!String(lesson?.title || '').trim()) {
                        errors.modules = `Module ${m + 1}, Lesson ${l + 1} needs a title.`;
                        break;
                    }
                    if (lesson.videoUrl && !isValidVideoUrl(lesson.videoUrl)) {
                        errors.modules = `"${lesson.title}" has an invalid video URL (use YouTube, Vimeo, or direct MP4/WebM URL).`;
                        break;
                    }
                    const badRes = (lesson.resources || []).find(
                        (r) => r.url && !isValidHttpUrl(r.url)
                    );
                    if (badRes) {
                        errors.modules = `"${lesson.title}" has an invalid PDF/material link URL.`;
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

