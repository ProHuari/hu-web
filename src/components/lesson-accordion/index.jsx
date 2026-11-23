import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    RiArrowDownSLine,
    RiCheckboxCircleFill,
    RiPlayCircleLine,
    RiTimeLine,
} from 'react-icons/ri';
import { useApp } from '../../context/AppContext';
import './style.css';

export default function LessonAccordion({
    modules = [],
    currentCourseId,
    currentLessonId,
    onSelectLesson,
}) {
    const { isLessonCompleted } = useApp() || {};
    const [toggledModules, setToggledModules] = useState({});

    const activeModuleIndex = useMemo(
        () =>
            modules.findIndex((mod) =>
                (mod.lessons || []).some((l) => String(l.id) === String(currentLessonId))
            ),
        [modules, currentLessonId]
    );

    const isModuleOpen = (index) => {
        if (Object.prototype.hasOwnProperty.call(toggledModules, index)) {
            return toggledModules[index];
        }
        return activeModuleIndex >= 0 ? index === activeModuleIndex : index === 0;
    };

    const toggleModule = (index) => {
        const currentlyOpen = isModuleOpen(index);
        setToggledModules((prev) => ({ ...prev, [index]: !currentlyOpen }));
    };

    return (
        <aside className="huari-lesson-accordion" aria-label="Conteúdo da trilha">
            <div className="accordion-header-title">
                <h3>Conteúdo da trilha</h3>
                <span className="accordion-modules-count">
                    {modules.length} {modules.length === 1 ? 'módulo' : 'módulos'}
                </span>
            </div>

            <div className="accordion-modules-list">
                {modules.map((moduleItem, modIdx) => {
                    const isOpen = isModuleOpen(modIdx);

                    return (
                        <div key={moduleItem.id || modIdx} className="accordion-module-group">
                            <button
                                type="button"
                                className="module-toggle-trigger"
                                onClick={() => toggleModule(modIdx)}
                                aria-expanded={isOpen}
                            >
                                <div className="module-title-wrapper">
                                    <span className="module-index-badge">Módulo {modIdx + 1}</span>
                                    <strong className="module-title">{moduleItem.title}</strong>
                                </div>
                                <RiArrowDownSLine
                                    size={20}
                                    className={`module-arrow ${isOpen ? 'rotated' : ''}`}
                                />
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        className="module-lessons-list"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        {(moduleItem.lessons || []).map((lesson) => {
                                            const isCurrent = String(lesson.id) === String(currentLessonId);
                                            const lessonUrl = `/learn/${currentCourseId}/${lesson.id}`;
                                            const completed = isLessonCompleted
                                                ? isLessonCompleted(currentCourseId, lesson.id)
                                                : Boolean(lesson.completed);

                                            return (
                                                <div key={lesson.id} className="module-lesson-entry">
                                                    <NavLink
                                                        to={lessonUrl}
                                                        onClick={() => onSelectLesson?.(lesson)}
                                                        className={`lesson-item-btn ${isCurrent ? 'is-current' : ''}`}
                                                    >
                                                        <div className="lesson-item-left">
                                                            {completed ? (
                                                                <RiCheckboxCircleFill
                                                                    className="lesson-check-done"
                                                                    size={18}
                                                                    title="Aula concluída"
                                                                />
                                                            ) : (
                                                                <RiPlayCircleLine
                                                                    className="lesson-play-icon"
                                                                    size={18}
                                                                />
                                                            )}
                                                            <span className="lesson-item-title">{lesson.title}</span>
                                                        </div>

                                                        {lesson.duration && (
                                                            <span className="lesson-duration tabular-nums">
                                                                <RiTimeLine size={13} />
                                                                {lesson.duration}
                                                            </span>
                                                        )}
                                                    </NavLink>
                                                </div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}

LessonAccordion.propTypes = {
    modules: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            title: PropTypes.string.isRequired,
            lessons: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                    title: PropTypes.string.isRequired,
                    duration: PropTypes.string,
                    completed: PropTypes.bool,
                })
            ),
        })
    ),
    currentCourseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    currentLessonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelectLesson: PropTypes.func,
};
