import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
    RiBookOpenLine,
    RiTimeLine,
    RiArrowRightLine,
} from 'react-icons/ri';
import ProgressBar from '../progress-bar';
import './style.css';

/**
 * CourseCard - Civic Academy course preview card component.
 */
export default function CourseCard({ course }) {
    const {
        id,
        title,
        description,
        category = 'General',
        level = 'Beginner',
        duration = '2h 30m',
        progress = 0,
        lessonsCount = 6,
        image,
    } = course;

    // Route directly to the course overview
    const courseUrl = `/learn/${id}/overview`;

    return (
        <article className="huari-course-card">
            <div
                className="huari-course-card-thumb"
                style={image ? { backgroundImage: `url(${image})` } : {}}
            >
                <div className="course-thumb-overlay" />
                <span className="course-category-badge">{category}</span>
                <span className="course-level-badge">{level}</span>
            </div>

            <div className="huari-course-card-body">
                <div className="course-meta-tags">
                    <span className="course-meta-tag">
                        <RiTimeLine size={14} aria-hidden="true" />
                        {duration}
                    </span>
                    <span className="course-meta-tag">
                        <RiBookOpenLine size={14} aria-hidden="true" />
                        {lessonsCount} lessons
                    </span>
                </div>

                <h3 className="course-card-title">{title}</h3>
                <p className="course-card-desc">{description}</p>

                <div className="course-progress-wrapper">
                    <ProgressBar progress={progress} />
                </div>

                <NavLink to={courseUrl} className="course-start-btn">
                    <span>{progress > 0 ? 'Continue Course' : 'Start Track'}</span>
                    <RiArrowRightLine size={16} aria-hidden="true" />
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
