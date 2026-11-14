import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'motion/react';
import { FiX, FiPlus, FiTrash2, FiUploadCloud, FiVideo } from 'react-icons/fi';
import Button from '../../button';
import VideoPlayer from '../../video-player';
import './style.css';

export default function LessonEditorDrawer({
    lesson,
    moduleIndex,
    lessonIndex,
    onClose,
    onChange,
}) {
    useEffect(() => {
        if (!lesson) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [lesson, onClose]);

    const handleResourceChange = (resIdx, field, value) => {
        const nextResources = (lesson.resources || []).map((res, idx) =>
            idx === resIdx ? { ...res, [field]: value } : res
        );
        onChange({ resources: nextResources });
    };

    const handleAddResource = () => {
        const nextResources = [
            ...(lesson.resources || []),
            {
                id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                title: 'Supporting PDF Guide',
                url: '',
            },
        ];
        onChange({ resources: nextResources });
    };

    const handleRemoveResource = (resIdx) => {
        const nextResources = (lesson.resources || []).filter((_, idx) => idx !== resIdx);
        onChange({ resources: nextResources });
    };

    return (
        <AnimatePresence>
            {lesson && (
                <motion.div
                    className="lesson-drawer-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                >
                    <motion.aside
                        className="lesson-drawer-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Edit Lesson ${lessonIndex + 1}`}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="lesson-drawer-header">
                            <div>
                                <span
                                    style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        color: 'var(--color-primary)',
                                    }}
                                >
                                    Module {moduleIndex + 1} • Lesson {lessonIndex + 1}
                                </span>
                                <h3 className="lesson-drawer-title">Edit Lesson Content</h3>
                            </div>
                            <button
                                type="button"
                                className="lesson-drawer-close"
                                onClick={onClose}
                                aria-label="Close lesson drawer"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="lesson-drawer-body">
                            <div className="admin-field-group">
                                <label htmlFor="lesson-title-input" className="admin-field-label">
                                    Lesson Title *
                                </label>
                                <input
                                    id="lesson-title-input"
                                    type="text"
                                    className="admin-field-input"
                                    value={lesson.title || ''}
                                    onChange={(e) => onChange({ title: e.target.value })}
                                    placeholder="e.g. Anatomy of Municipal Procurement"
                                />
                            </div>

                            <div className="admin-field-row">
                                <div className="admin-field-group">
                                    <label htmlFor="lesson-duration-input" className="admin-field-label">
                                        Duration
                                    </label>
                                    <input
                                        id="lesson-duration-input"
                                        type="text"
                                        className="admin-field-input"
                                        value={lesson.duration || ''}
                                        onChange={(e) => onChange({ duration: e.target.value })}
                                        placeholder="e.g. 18 min"
                                    />
                                </div>

                                <div className="admin-field-group">
                                    <label htmlFor="lesson-video-input" className="admin-field-label">
                                        Video URL (YouTube / MP4)
                                    </label>
                                    <input
                                        id="lesson-video-input"
                                        type="url"
                                        className="admin-field-input"
                                        value={lesson.videoUrl || ''}
                                        onChange={(e) => onChange({ videoUrl: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                            </div>

                            <div className="admin-field-group">
                                <span className="admin-field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <FiVideo size={14} /> Live Video Preview
                                </span>
                                <div className="lesson-drawer-preview">
                                    <VideoPlayer
                                        videoUrl={lesson.videoUrl}
                                        title={lesson.title || 'Lesson Preview'}
                                        duration={lesson.duration || '15 min'}
                                    />
                                </div>
                            </div>

                            <div className="admin-field-group">
                                <label htmlFor="lesson-summary-input" className="admin-field-label">
                                    Lesson Summary & Takeaways
                                </label>
                                <textarea
                                    id="lesson-summary-input"
                                    rows={4}
                                    className="admin-field-textarea"
                                    value={lesson.summary || ''}
                                    onChange={(e) => onChange({ summary: e.target.value })}
                                    placeholder="Describe key concepts covered in this lesson..."
                                />
                            </div>

                            <div className="admin-field-group">
                                <label className="admin-field-label">External PDF & Study Materials</label>
                                <div className="lesson-drawer-resources">
                                    {(lesson.resources || []).map((res, rIdx) => (
                                        <div key={res.id || rIdx} className="lesson-resource-item">
                                            <input
                                                type="text"
                                                className="admin-field-input"
                                                placeholder="Label (e.g. Study Guide)"
                                                value={res.title || ''}
                                                onChange={(e) =>
                                                    handleResourceChange(rIdx, 'title', e.target.value)
                                                }
                                            />
                                            <input
                                                type="url"
                                                className="admin-field-input"
                                                placeholder="https://.../guide.pdf"
                                                value={res.url || ''}
                                                onChange={(e) =>
                                                    handleResourceChange(rIdx, 'url', e.target.value)
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="admin-remove-btn"
                                                onClick={() => handleRemoveResource(rIdx)}
                                                aria-label={`Remove material ${rIdx + 1}`}
                                            >
                                                <FiTrash2 size={15} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="admin-add-inline-btn"
                                        onClick={handleAddResource}
                                    >
                                        <FiPlus size={14} /> Add PDF Resource Link
                                    </button>
                                    <span className="admin-field-hint">
                                        <FiUploadCloud size={14} /> External PDF URLs active now; direct document upload ready for storage integration.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lesson-drawer-footer">
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                Changes sync automatically into your course draft.
                            </span>
                            <Button type="button" variant="primary" onClick={onClose}>
                                Done Editing
                            </Button>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

LessonEditorDrawer.propTypes = {
    lesson: PropTypes.object,
    moduleIndex: PropTypes.number,
    lessonIndex: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

