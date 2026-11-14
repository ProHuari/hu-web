import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    FiArrowLeft,
    FiSave,
    FiSend,
    FiEye,
    FiSliders,
    FiLayers,
    FiBookOpen,
} from 'react-icons/fi';
import { PageTransition } from '../../components/motion/MotionPrimitives';
import Button from '../../components/button';
import EmptyState from '../../components/empty-state';
import ConfirmModal from '../../components/confirm-modal';
import { CourseOverviewSkeleton } from '../../components/skeleton';
import CourseMetadataForm from '../../components/admin/course-metadata-form';
import CurriculumBuilder from '../../components/admin/curriculum-builder';
import LessonEditorDrawer from '../../components/admin/lesson-editor-drawer';
import { useCourseEditor } from '../../hooks/useCourseEditor';
import './style.css';

export default function AdminCourseEditorPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');
    const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

    const {
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
    } = useCourseEditor(courseId);

    const handleBack = () => {
        if (isDirty) {
            setConfirmLeaveOpen(true);
            return;
        }
        navigate('/admin/courses');
    };

    const handleSave = async (targetStatus) => {
        const result = await saveCourse(targetStatus);
        if (result.success && !isEditing && result.savedCourse?.id) {
            navigate(`/admin/courses/${result.savedCourse.id}/edit`, { replace: true });
        }
    };

    if (loading) {
        return (
            <div className="admin-editor-page">
                <CourseOverviewSkeleton />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="admin-editor-page">
                <EmptyState
                    icon={FiBookOpen}
                    title="Course unavailable"
                    description={loadError}
                    actionText="Back to Courses"
                    onAction={() => navigate('/admin/courses')}
                />
            </div>
        );
    }

    const totalLessons = (course.modules || []).reduce(
        (acc, mod) => acc + (mod.lessons?.length || 0),
        0
    );

    return (
        <PageTransition className="admin-editor-page">
            <header className="admin-editor-topbar">
                <div className="admin-editor-topbar-left">
                    <button type="button" className="admin-back-btn" onClick={handleBack}>
                        <FiArrowLeft size={15} /> Back
                    </button>
                    <div>
                        <h1 className="admin-editor-heading">
                            {isEditing ? course.title || 'Edit Course' : 'Create New Course'}
                        </h1>
                    </div>
                    <span
                        className={`admin-status-pill ${
                            course.status === 'PUBLISHED'
                                ? 'admin-status-pill--published'
                                : 'admin-status-pill--draft'
                        }`}
                    >
                        <span className="admin-status-dot" aria-hidden="true" />
                        {course.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                    </span>
                    {isDirty && <span className="admin-dirty-tag">Unsaved changes</span>}
                </div>

                <div className="admin-editor-actions">
                    {course.id && (
                        <Link
                            to={`/learn/${course.id}/overview`}
                            className="admin-icon-btn"
                            style={{ height: '38px', padding: '0 0.9rem' }}
                        >
                            <FiEye size={14} /> Preview Student View
                        </Link>
                    )}

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={saving}
                        onClick={() => handleSave('DRAFT')}
                    >
                        <FiSave size={15} /> {saving ? 'Saving...' : 'Save Draft'}
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        disabled={saving}
                        onClick={() => handleSave('PUBLISHED')}
                    >
                        <FiSend size={15} /> {course.status === 'PUBLISHED' ? 'Save & Update' : 'Publish Course'}
                    </Button>
                </div>
            </header>

            <div className="admin-editor-tabs" role="tablist" aria-label="Course editor sections">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'details'}
                    className={`admin-editor-tab ${
                        activeTab === 'details' ? 'admin-editor-tab--active' : ''
                    }`}
                    onClick={() => setActiveTab('details')}
                >
                    {activeTab === 'details' && (
                        <motion.span
                            layoutId="adminEditorTabPill"
                            className="admin-editor-tab-pill"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                    )}
                    <FiSliders size={15} /> Course Details
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'curriculum'}
                    className={`admin-editor-tab ${
                        activeTab === 'curriculum' ? 'admin-editor-tab--active' : ''
                    }`}
                    onClick={() => setActiveTab('curriculum')}
                >
                    {activeTab === 'curriculum' && (
                        <motion.span
                            layoutId="adminEditorTabPill"
                            className="admin-editor-tab-pill"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                    )}
                    <FiLayers size={15} /> Curriculum ({course.modules?.length || 0} modules •{' '}
                    {totalLessons} lessons)
                </button>
            </div>

            {activeTab === 'details' ? (
                <CourseMetadataForm
                    course={course}
                    errors={validationErrors}
                    onFieldChange={updateField}
                    onAddObjective={addObjective}
                    onUpdateObjective={updateObjective}
                    onRemoveObjective={removeObjective}
                />
            ) : (
                <CurriculumBuilder
                    modules={course.modules || []}
                    error={validationErrors.modules}
                    activeLessonPos={activeLessonPos}
                    onAddModule={addModule}
                    onUpdateModuleTitle={updateModuleTitle}
                    onRemoveModule={removeModule}
                    onMoveModule={moveModule}
                    onAddLesson={addLesson}
                    onEditLesson={(moduleIndex, lessonIndex) =>
                        setActiveLessonPos({ moduleIndex, lessonIndex })
                    }
                    onRemoveLesson={removeLesson}
                    onMoveLesson={moveLesson}
                />
            )}

            <LessonEditorDrawer
                lesson={activeLesson}
                moduleIndex={activeLessonPos?.moduleIndex ?? 0}
                lessonIndex={activeLessonPos?.lessonIndex ?? 0}
                onClose={() => setActiveLessonPos(null)}
                onChange={(patch) => {
                    if (activeLessonPos) {
                        updateLesson(activeLessonPos.moduleIndex, activeLessonPos.lessonIndex, patch);
                    }
                }}
            />

            <ConfirmModal
                isOpen={confirmLeaveOpen}
                title="Discard unsaved changes?"
                description="You have edited fields in this course that have not been saved yet."
                confirmText="Discard & Leave"
                cancelText="Keep Editing"
                variant="danger"
                onConfirm={() => navigate('/admin/courses')}
                onCancel={() => setConfirmLeaveOpen(false)}
            />
        </PageTransition>
    );
}

