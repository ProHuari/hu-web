import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
    RiBookOpenLine,
    RiTimeLine,
    RiBarChartLine,
    RiArrowRightLine,
} from 'react-icons/ri';
import ProgressBar from '../progress-bar';
import './style.css';

/**
 * CourseCard - Molécula para exibição de trilha/curso na Academia Cívica.
 *
 * @param {Object} course - Dados do curso { id, title, description, category, level, duration, progress, lessonsCount, image }
 */
export default function CourseCard({ course }) {
    const {
        id,
        title,
        description,
        category = 'Geral',
        level = 'Iniciante',
        duration = '2h 30m',
        progress = 0,
        lessonsCount = 6,
        image,
    } = course;

    // Rota direta para a primeira aula da trilha
    const courseUrl = `/learn/${id}/aula-1`;

    return (
        <article className="huari-course-card">
            {/* Capa / Imagem da Trilha */}
            <div
                className="huari-course-card-thumb"
                style={image ? { backgroundImage: `url(${image})` } : {}}
            >
                <div className="course-thumb-overlay" />
                <span className="course-category-badge">{category}</span>
                <span className="course-level-badge">{level}</span>
            </div>

            {/* Conteúdo Informativo */}
            <div className="huari-course-card-body">
                <div className="course-meta-tags">
                    <span className="course-meta-tag">
                        <RiTimeLine size={14} />
                        {duration}
                    </span>
                    <span className="course-meta-tag">
                        <RiBookOpenLine size={14} />
                        {lessonsCount} aulas
                    </span>
                </div>

                <h3 className="course-card-title">{title}</h3>
                <p className="course-card-desc">{description}</p>

                {/* Átomo: ProgressBar */}
                <div className="course-progress-wrapper">
                    <ProgressBar progress={progress} />
                </div>

                {/* Botão de Ação com NavLink */}
                <NavLink to={courseUrl} className="course-start-btn">
                    <span>{progress > 0 ? 'Continuar Curso' : 'Iniciar Trilha'}</span>
                    <RiArrowRightLine size={16} />
                </NavLink>
            </div>
        </article>
    );
}

CourseCard.propTypes = {
    course: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        category: PropTypes.string,
        level: PropTypes.string,
        duration: PropTypes.string,
        progress: PropTypes.number,
        lessonsCount: PropTypes.number,
        image: PropTypes.string,
    }).isRequired,
};
