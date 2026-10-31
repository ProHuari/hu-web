import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
    RiArrowDownSLine,
    RiCheckboxCircleFill,
    RiPlayCircleLine,
    RiTimeLine,
} from 'react-icons/ri';
import './style.css';

/**
 * LessonAccordion - Molécula para listar módulos e aulas expansíveis.
 * Destaca a aula atual e indica as aulas concluídas com visto verde.
 *
 * @param {Array} modules - Lista de módulos contendo suas respectivas aulas
 * @param {string} currentCourseId - ID do curso atual
 * @param {string} currentLessonId - ID da aula selecionada/ativa
 * @param {function} onSelectLesson - Callback opcional ao trocar de aula
 */
export default function LessonAccordion({
    modules = [],
    currentCourseId,
    currentLessonId,
    onSelectLesson,
}) {
    // Controla quais módulos estão abertos (por padrão o primeiro fica aberto)
    const [openModules, setOpenModules] = useState({ 0: true });

    const toggleModule = (index) => {
        setOpenModules((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    return (
        <aside className="huari-lesson-accordion" aria-label="Conteúdo programático da trilha">
            <div className="accordion-header-title">
                <h3>Conteúdo da Trilha</h3>
                <span className="accordion-modules-count">{modules.length} Módulos</span>
            </div>

            <div className="accordion-modules-list">
                {modules.map((moduleItem, modIdx) => {
                    const isOpen = Boolean(openModules[modIdx]);

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

                            {isOpen && (
                                <ul className="module-lessons-list">
                                    {moduleItem.lessons.map((lesson) => {
                                        const isCurrent = lesson.id === currentLessonId;
                                        const lessonUrl = `/learn/${currentCourseId}/${lesson.id}`;

                                        return (
                                            <li key={lesson.id}>
                                                <NavLink
                                                    to={lessonUrl}
                                                    onClick={() => onSelectLesson?.(lesson)}
                                                    className={`lesson-item-btn ${isCurrent ? 'is-current' : ''}`}
                                                >
                                                    <div className="lesson-item-left">
                                                        {lesson.completed ? (
                                                            <RiCheckboxCircleFill
                                                                className="lesson-check-done"
                                                                size={18}
                                                                title="Aula Concluída"
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
                                                        <span className="lesson-duration">
                                                            <RiTimeLine size={13} />
                                                            {lesson.duration}
                                                        </span>
                                                    )}
                                                </NavLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
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
                    id: PropTypes.string.isRequired,
                    title: PropTypes.string.isRequired,
                    duration: PropTypes.string,
                    completed: PropTypes.bool,
                })
            ).isRequired,
        })
    ).isRequired,
    currentCourseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    currentLessonId: PropTypes.string,
    onSelectLesson: PropTypes.func,
};
