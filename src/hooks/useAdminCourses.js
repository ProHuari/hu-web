import { useState, useEffect, useCallback } from 'react';
import { coursesService } from '../services/coursesService';
import { useToast } from '../context/useToast';

export function useAdminCourses() {
    const toast = useToast();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        let active = true;

        coursesService
            .getAdminCourses({
                search: searchQuery,
                status: statusFilter,
                category: categoryFilter,
            })
            .then((list) => {
                if (active) {
                    setCourses(list);
                    setError(null);
                }
            })
            .catch((err) => {
                if (active) {
                    console.error('Failed to load admin courses:', err);
                    setError(err.message || 'Unable to load courses.');
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [searchQuery, statusFilter, categoryFilter]);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await coursesService.getAdminCourses({
                search: searchQuery,
                status: statusFilter,
                category: categoryFilter,
            });
            setCourses(list);
        } catch (err) {
            console.error('Failed to reload admin courses:', err);
            setError(err.message || 'Unable to load courses.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, statusFilter, categoryFilter]);

    const toggleCourseStatus = useCallback(
        async (course) => {
            const nextStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
            try {
                const updated = await coursesService.updateCourseStatus(course.id, nextStatus);
                setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)));
                toast.success(
                    nextStatus === 'PUBLISHED'
                        ? `"${course.title}" is now published to learners.`
                        : `"${course.title}" moved to draft.`
                );
                return updated;
            } catch (err) {
                toast.error(err.message || 'Could not update course status.');
                return null;
            }
        },
        [toast]
    );

    const removeCourse = useCallback(
        async (course) => {
            try {
                await coursesService.deleteCourse(course.id);
                setCourses((prev) => prev.filter((c) => c.id !== course.id));
                toast.success(`"${course.title}" has been deleted.`);
                return true;
            } catch (err) {
                toast.error(err.message || 'Failed to delete course.');
                return false;
            }
        },
        [toast]
    );

    return {
        courses,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        reload,
        toggleCourseStatus,
        removeCourse,
    };
}
