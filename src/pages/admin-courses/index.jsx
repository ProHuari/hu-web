import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiShield, FiBookOpen } from 'react-icons/fi';
import { PageTransition } from '../../components/motion/MotionPrimitives';
import Button from '../../components/button';
import EmptyState from '../../components/empty-state';
import ConfirmModal from '../../components/confirm-modal';
import { AdminTableSkeleton } from '../../components/skeleton';
import AdminCourseTable from '../../components/admin/course-table';
import { useAdminCourses } from '../../hooks/useAdminCourses';
import { COURSE_CATEGORIES } from '../../data/courses';
import './style.css';

export default function AdminCoursesPage() {
    const navigate = useNavigate();
    const {
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
    } = useAdminCourses();

    const [courseToDelete, setCourseToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const stats = useMemo(() => {
        const published = courses.filter((c) => c.status === 'PUBLISHED').length;
        const drafts = courses.filter((c) => c.status !== 'PUBLISHED').length;
        const lessons = courses.reduce((sum, c) => sum + (c.lessonsCount || 0), 0);
        return {
            total: courses.length,
            published,
            drafts,
            lessons,
        };
    }, [courses]);

    const handleConfirmDelete = async () => {
        if (!courseToDelete) return;
        setDeleting(true);
        await removeCourse(courseToDelete);
        setDeleting(false);
        setCourseToDelete(null);
    };

    return (
        <PageTransition className="admin-courses-page">
            <header className="admin-page-topbar">
                <div>
                    <span className="admin-page-kicker">
                        <FiShield size={13} /> Admin Studio
                    </span>
                    <h1 className="admin-page-title">Manage Courses</h1>
                    <p className="admin-page-subtitle">
                        Create, organize, publish, and refine civic education tracks across Huari Academy.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Link
                        to="/learn"
                        className="admin-icon-btn"
                        style={{ height: '40px', padding: '0 1rem' }}
                    >
                        View Student Catalog
                    </Link>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => navigate('/admin/courses/new')}
                    >
                        <FiPlus size={16} /> New Course
                    </Button>
                </div>
            </header>

            <section className="admin-stats-strip" aria-label="Course catalog summary">
                <div className="admin-stat-tile">
                    <span className="admin-stat-label">Visible Courses</span>
                    <span className="admin-stat-value tabular-nums">{stats.total}</span>
                </div>
                <div className="admin-stat-tile">
                    <span className="admin-stat-label">Published</span>
                    <span className="admin-stat-value tabular-nums" style={{ color: 'var(--color-scale-success-700, #047857)' }}>
                        {stats.published}
                    </span>
                </div>
                <div className="admin-stat-tile">
                    <span className="admin-stat-label">Drafts</span>
                    <span className="admin-stat-value tabular-nums" style={{ color: 'var(--color-scale-warning-700, #b45309)' }}>
                        {stats.drafts}
                    </span>
                </div>
                <div className="admin-stat-tile">
                    <span className="admin-stat-label">Total Lessons</span>
                    <span className="admin-stat-value tabular-nums">{stats.lessons}</span>
                </div>
            </section>

            <section className="admin-toolbar" aria-label="Filter courses">
                <div className="admin-search-box">
                    <FiSearch size={16} className="admin-search-icon" aria-hidden="true" />
                    <input
                        type="search"
                        className="admin-search-input"
                        placeholder="Search by course title or instructor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search courses"
                    />
                </div>

                <div className="admin-filter-group">
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label="Filter by status"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PUBLISHED">Published Only</option>
                        <option value="DRAFT">Drafts Only</option>
                    </select>

                    <select
                        className="admin-filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        aria-label="Filter by category"
                    >
                        {COURSE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === 'All' ? 'All Categories' : cat}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            {error ? (
                <EmptyState
                    icon={FiBookOpen}
                    title="Could not load courses"
                    description={error}
                    actionText="Try Again"
                    onAction={reload}
                />
            ) : loading ? (
                <AdminTableSkeleton rows={5} />
            ) : courses.length === 0 ? (
                <EmptyState
                    icon={FiBookOpen}
                    title="No courses match your filters"
                    description="Create a new civic track or clear your active search and status filters."
                    actionText="Create First Course"
                    onAction={() => navigate('/admin/courses/new')}
                />
            ) : (
                <AdminCourseTable
                    courses={courses}
                    onToggleStatus={toggleCourseStatus}
                    onDeleteRequest={(course) => setCourseToDelete(course)}
                />
            )}

            <ConfirmModal
                isOpen={Boolean(courseToDelete)}
                title="Delete course permanently?"
                description={
                    courseToDelete
                        ? `This will permanently remove "${courseToDelete.title}" and all of its modules and lessons.`
                        : ''
                }
                confirmText="Delete Course"
                cancelText="Cancel"
                variant="danger"
                isLoading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => !deleting && setCourseToDelete(null)}
            />
        </PageTransition>
    );
}

