import { useState, useEffect, useCallback, useMemo } from 'react';
import { coursesService } from '../services/coursesService';
import { useToast } from '../context/useToast';
import {
    createEmptyCourse,
    createEmptyModule,
    createEmptyLesson,
    validateCourseForSave,
} from '../schemas/courseValidation';

function moveArrayItem(list, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= list.length) return list;
    const copy = [...list];
    const [moved] = copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, moved);
    return copy;
}

export function useCourseEditor(courseId) {
    const toast = useToast();
    const isEditing = Boolean(courseId);

    const [course, setCourse] = useState(() => createEmptyCourse());
    const [initialSnapshot, setInitialSnapshot] = useState(() => JSON.stringify(createEmptyCourse()));
    const [loading, setLoading] = useState(isEditing);
    const [loadError, setLoadError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [activeLessonPos, setActiveLessonPos] = useState(null);

    useEffect(() => {
        let active = true;

        async function fetchCourse() {
            if (!courseId) {
                const blank = createEmptyCourse();
                setCourse(blank);
                setInitialSnapshot(JSON.stringify(blank));
                setLoading(false);
                setLoadError(null);
                setValidationErrors({});
                return;
            }

            setLoading(true);
            setLoadError(null);
            try {
                const found = await coursesService.getCourseById(courseId);
                if (!active) return;

                if (!found) {
                    setLoadError('Course not found.');
                } else {
                    const normalized = {
                        ...found,
                        objectives:
                            found.objectives && found.objectives.length > 0 ? found.objectives : [''],
                        modules:
                            found.modules && found.modules.length > 0
                                ? found.modules
                                : [createEmptyModule(0)],
                    };
                    setCourse(normalized);
                    setInitialSnapshot(JSON.stringify(normalized));
                }
            } catch (err) {
                if (!active) return;
                setLoadError(err.message || 'Failed to load course details.');
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchCourse();
        return () => {
            active = false;
        };
    }, [courseId]);

    const isDirty = useMemo(
        () => JSON.stringify(course) !== initialSnapshot,
        [course, initialSnapshot]
    );

    const updateField = useCallback((field, value) => {
        setCourse((prev) => ({ ...prev, [field]: value }));
        setValidationErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const addObjective = useCallback(() => {
        setCourse((prev) => ({ ...prev, objectives: [...(prev.objectives || []), ''] }));
    }, []);

    const updateObjective = useCallback((index, value) => {
        setCourse((prev) => {
            const next = [...(prev.objectives || [])];
            next[index] = value;
            return { ...prev, objectives: next };
        });
    }, []);

    const removeObjective = useCallback((index) => {
        setCourse((prev) => {
            const next = (prev.objectives || []).filter((_, i) => i !== index);
            return { ...prev, objectives: next.length > 0 ? next : [''] };
        });
    }, []);

    const addModule = useCallback(() => {
        setCourse((prev) => ({
            ...prev,
            modules: [...(prev.modules || []), createEmptyModule((prev.modules || []).length)],
        }));
    }, []);

    const updateModuleTitle = useCallback((moduleIndex, title) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.map((mod, idx) =>
                idx === moduleIndex ? { ...mod, title } : mod
            ),
        }));
    }, []);

    const removeModule = useCallback((moduleIndex) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.filter((_, idx) => idx !== moduleIndex),
        }));
        setActiveLessonPos((pos) => (pos && pos.moduleIndex === moduleIndex ? null : pos));
    }, []);

    const moveModule = useCallback((moduleIndex, direction) => {
        setCourse((prev) => ({
            ...prev,
            modules: moveArrayItem(prev.modules, moduleIndex, moduleIndex + direction),
        }));
    }, []);

    const addLesson = useCallback((moduleIndex) => {
        setCourse((prev) => {
            const updatedModules = prev.modules.map((mod, idx) => {
                if (idx !== moduleIndex) return mod;
                const nextLessons = [...(mod.lessons || []), createEmptyLesson((mod.lessons || []).length)];
                return { ...mod, lessons: nextLessons };
            });
            return { ...prev, modules: updatedModules };
        });
    }, []);

    const updateLesson = useCallback((moduleIndex, lessonIndex, patch) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.map((mod, mIdx) => {
                if (mIdx !== moduleIndex) return mod;
                return {
                    ...mod,
                    lessons: mod.lessons.map((lesson, lIdx) =>
                        lIdx === lessonIndex ? { ...lesson, ...patch } : lesson
                    ),
                };
            }),
        }));
    }, []);

    const removeLesson = useCallback((moduleIndex, lessonIndex) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.map((mod, mIdx) => {
                if (mIdx !== moduleIndex) return mod;
                return {
                    ...mod,
                    lessons: mod.lessons.filter((_, lIdx) => lIdx !== lessonIndex),
                };
            }),
        }));
        setActiveLessonPos((pos) =>
            pos && pos.moduleIndex === moduleIndex && pos.lessonIndex === lessonIndex ? null : pos
        );
    }, []);

    const moveLesson = useCallback((moduleIndex, lessonIndex, direction) => {
        setCourse((prev) => ({
            ...prev,
            modules: prev.modules.map((mod, mIdx) => {
                if (mIdx !== moduleIndex) return mod;
                return {
                    ...mod,
                    lessons: moveArrayItem(mod.lessons, lessonIndex, lessonIndex + direction),
                };
            }),
        }));
    }, []);

    const activeLesson = useMemo(() => {
        if (!activeLessonPos) return null;
        const mod = course.modules?.[activeLessonPos.moduleIndex];
        return mod?.lessons?.[activeLessonPos.lessonIndex] || null;
    }, [course.modules, activeLessonPos]);

    const saveCourse = useCallback(
        async (targetStatus = course.status || 'DRAFT') => {
            const cleanedObjectives = (course.objectives || [])
                .map((o) => String(o).trim())
                .filter(Boolean);

            const payload = {
                ...course,
                status: targetStatus,
                objectives: cleanedObjectives,
            };

            const { isValid, errors } = validateCourseForSave(payload, targetStatus);
            setValidationErrors(errors);

            if (!isValid) {
                const firstMsg = Object.values(errors)[0];
                toast.error(firstMsg || 'Please fix the highlighted fields before saving.');
                return { success: false, savedCourse: null };
            }

            setSaving(true);
            try {
                const saved = isEditing
                    ? await coursesService.updateCourse(course.id, payload)
                    : await coursesService.createCourse(payload);

                const normalizedSaved = {
                    ...saved,
                    objectives: saved.objectives?.length ? saved.objectives : [''],
                };
                setCourse(normalizedSaved);
                setInitialSnapshot(JSON.stringify(normalizedSaved));

                toast.success(
                    targetStatus === 'PUBLISHED'
                        ? `"${saved.title}" saved & published!`
                        : `"${saved.title}" saved as draft.`
                );
                return { success: true, savedCourse: saved };
            } catch (err) {
                toast.error(err.message || 'Could not save course.');
                return { success: false, savedCourse: null };
            } finally {
                setSaving(false);
            }
        },
        [course, isEditing, toast]
    );

    return {
        isEditing,
        course,
        loading,
        loadError,
        saving,
        isDirty,
        validationErrors,
        activeLessonPos,
        activeLesson,
        setActiveLessonPos,
        updateField,
        addObjective,
        updateObjective,
        removeObjective,
        addModule,
        updateModuleTitle,
        removeModule,
        moveModule,
        addLesson,
        updateLesson,
        removeLesson,
        moveLesson,
        saveCourse,
    };
}

