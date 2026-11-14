import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'motion/react';
import {
    FiPlus,
    FiChevronDown,
    FiChevronRight,
    FiArrowUp,
    FiArrowDown,
    FiTrash2,
    FiEdit3,
    FiPlayCircle,
    FiFileText,
} from 'react-icons/fi';
import Button from '../../button';
import './style.css';

export default function CurriculumBuilder({
    modules = [],
    error,
    activeLessonPos,
    onAddModule,
    onUpdateModuleTitle,
    onRemoveModule,
    onMoveModule,
    onAddLesson,
    onEditLesson,
    onRemoveLesson,
    onMoveLesson,
}) {
    const [collapsedMap, setCollapsedMap] = useState({});

    const toggleCollapse = (modId) => {
        setCollapsedMap((prev) => ({ ...prev, [modId]: !prev[modId] }));
    };

    return (
        <div className="admin-curriculum-wrapper">
            <div className="admin-curriculum-header">
                <div>
                    <h2 className="admin-curriculum-title">Course Curriculum</h2>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.86rem', color: 'var(--text-tertiary)' }}>
                        Organize modules, reorder with arrows, and click any lesson to edit video URL, summary, and PDFs.
                    </p>
                </div>
                <Button type="button" variant="secondary" onClick={onAddModule}>
                    <FiPlus size={16} /> Add Module
                </Button>
            </div>

            {error && <div className="admin-curriculum-error">{error}</div>}

            {modules.map((mod, mIdx) => {
                const isCollapsed = Boolean(collapsedMap[mod.id]);
                const lessons = mod.lessons || [];

                return (
                    <motion.div
                        key={mod.id || mIdx}
                        layout
                        className="admin-module-card"
                    >
                        <div className="admin-module-header">
                            <button
                                type="button"
                                className="admin-module-toggle-btn"
                                onClick={() => toggleCollapse(mod.id)}
                                aria-label={isCollapsed ? 'Expand module' : 'Collapse module'}
                                aria-expanded={!isCollapsed}
                            >
                                {isCollapsed ? <FiChevronRight size={17} /> : <FiChevronDown size={17} />}
                            </button>

                            <span className="admin-module-badge">Module {mIdx + 1}</span>

                            <input
                                type="text"
                                className="admin-module-title-input"
                                value={mod.title || ''}
                                onChange={(e) => onUpdateModuleTitle(mIdx, e.target.value)}
                                placeholder={`Module ${mIdx + 1} Title`}
                                aria-label={`Module ${mIdx + 1} title`}
                            />

                            <div className="admin-reorder-group">
                                <button
                                    type="button"
                                    className="admin-mini-btn"
                                    disabled={mIdx === 0}
                                    onClick={() => onMoveModule(mIdx, -1)}
                                    title="Move module up"
                                    aria-label={`Move module ${mIdx + 1} up`}
                                >
                                    <FiArrowUp size={14} />
                                </button>
                                <button
                                    type="button"
                                    className="admin-mini-btn"
                                    disabled={mIdx === modules.length - 1}
                                    onClick={() => onMoveModule(mIdx, 1)}
                                    title="Move module down"
                                    aria-label={`Move module ${mIdx + 1} down`}
                                >
                                    <FiArrowDown size={14} />
                                </button>
                                <button
                                    type="button"
                                    className="admin-mini-btn admin-mini-btn--danger"
                                    disabled={modules.length <= 1}
                                    onClick={() => onRemoveModule(mIdx)}
                                    title={modules.length <= 1 ? 'Keep at least 1 module' : 'Remove module'}
                                    aria-label={`Remove module ${mIdx + 1}`}
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <AnimatePresence initial={false}>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div className="admin-lessons-body">
                                        {lessons.map((lesson, lIdx) => {
                                            const isActive =
                                                activeLessonPos?.moduleIndex === mIdx &&
                                                activeLessonPos?.lessonIndex === lIdx;
                                            const pdfCount = lesson.resources?.length || 0;

                                            return (
                                                <motion.div
                                                    key={lesson.id || lIdx}
                                                    layout
                                                    className={`admin-lesson-row ${
                                                        isActive ? 'admin-lesson-row--active' : ''
                                                    }`}
                                                >
                                                    <button
                                                        type="button"
                                                        className="admin-lesson-main"
                                                        onClick={() => onEditLesson(mIdx, lIdx)}
                                                    >
                                                        <span className="admin-lesson-index">{lIdx + 1}</span>
                                                        <div className="admin-lesson-info">
                                                            <span className="admin-lesson-name">
                                                                {lesson.title || 'Untitled Lesson'}
                                                            </span>
                                                            <span className="admin-lesson-sub">
                                                                <span>{lesson.duration || '15 min'}</span>
                                                                <span>•</span>
                                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                    <FiPlayCircle size={12} />
                                                                    {lesson.videoUrl ? 'Video linked' : 'No video URL'}
                                                                </span>
                                                                {pdfCount > 0 && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                                            <FiFileText size={12} />
                                                                            {pdfCount} PDF
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </button>

                                                    <div className="admin-lesson-actions">
                                                        <button
                                                            type="button"
                                                            className="admin-mini-btn"
                                                            onClick={() => onEditLesson(mIdx, lIdx)}
                                                            title="Edit lesson content"
                                                            aria-label={`Edit ${lesson.title}`}
                                                        >
                                                            <FiEdit3 size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="admin-mini-btn"
                                                            disabled={lIdx === 0}
                                                            onClick={() => onMoveLesson(mIdx, lIdx, -1)}
                                                            title="Move lesson up"
                                                            aria-label={`Move ${lesson.title} up`}
                                                        >
                                                            <FiArrowUp size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="admin-mini-btn"
                                                            disabled={lIdx === lessons.length - 1}
                                                            onClick={() => onMoveLesson(mIdx, lIdx, 1)}
                                                            title="Move lesson down"
                                                            aria-label={`Move ${lesson.title} down`}
                                                        >
                                                            <FiArrowDown size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="admin-mini-btn admin-mini-btn--danger"
                                                            onClick={() => onRemoveLesson(mIdx, lIdx)}
                                                            title="Remove lesson"
                                                            aria-label={`Remove ${lesson.title}`}
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            className="admin-add-inline-btn admin-add-lesson-btn"
                                            onClick={() => onAddLesson(mIdx)}
                                        >
                                            <FiPlus size={14} /> Add Lesson to Module {mIdx + 1}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
}

CurriculumBuilder.propTypes = {
    modules: PropTypes.array.isRequired,
    error: PropTypes.string,
    activeLessonPos: PropTypes.shape({
        moduleIndex: PropTypes.number,
        lessonIndex: PropTypes.number,
    }),
    onAddModule: PropTypes.func.isRequired,
    onUpdateModuleTitle: PropTypes.func.isRequired,
    onRemoveModule: PropTypes.func.isRequired,
    onMoveModule: PropTypes.func.isRequired,
    onAddLesson: PropTypes.func.isRequired,
    onEditLesson: PropTypes.func.isRequired,
    onRemoveLesson: PropTypes.func.isRequired,
    onMoveLesson: PropTypes.func.isRequired,
};

