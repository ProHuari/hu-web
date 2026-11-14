import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    RiBookOpenLine,
    RiTimeLine,
    RiArrowRightLine,
    RiEditLine,
} from 'react-icons/ri';
import { useApp } from '../../context/AppContext';
import ProgressBar from '../progress-bar';
import './style.css';

/**
 * CourseCard - Civic Academy course preview card with live progress & contextual admin edit shortcut.
 */
export default function CourseCard({ course, isPreview = false }) {
    const { isAdmin = false, getCourseProgress } = useApp() || {};
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

    const liveProgress = !isPreview && getCourseProgress ? getCourseProgress(course) : progress;
    const courseUrl = `/learn/${id}/overview`;
    const editUrl = `/admin/courses/${id}/edit`;

    return (
        <motion.article
            className="huari-course-card"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        >
            <div
                className="huari-course-card-thumb"
                style={image ? { backgroundImage: `url(${image})` } : {}}
            >
                <div className="course-thumb-overlay" />
                <span className="course-category-badge">{category}</span>
                <div className="course-thumb-right">
                    <span className="course-level-badge">{level}</span>
                    {isAdmin && !isPreview && (
                        <NavLink
                            to={editUrl}
                            className="course-admin-edit-pill"
                            title={`Edit "${title}"`}
                            aria-label={`Edit course ${title}`}
                        >
                            <RiEditLine size={13} aria-hidden="true" />
                            <span>Edit</span>
                        </NavLink>
                    )}
                </div>
            </div>

            <div className="huari-course-card-body">
                <div className="course-meta-tags">
                    <span className="course-meta-tag">
                        <RiTimeLine size={14} aria-hidden="true" />
                        {duration}
                    </span>
                    <span className="course-meta-tag">
                        <RiBookOpenLine size={14} aria-hidden="true" />
                        {lessonsCount} {lessonsCount === 1 ? 'lesson' : 'lessons'}
                    </span>
                </div>

                <h3 className="course-card-title">{title}</h3>
                <p className="course-card-desc">{description}</p>

                <div className="course-progress-wrapper">
                    <ProgressBar progress={liveProgress} />
                </div>

                {isPreview ? (
                    <span className="course-start-btn" aria-hidden="true">
                        <span>Start Track</span>
                        <RiArrowRightLine size={16} />
                    </span>
                ) : (
                    <NavLink to={courseUrl} className="course-start-btn">
                        <span>{liveProgress > 0 ? 'Continue Course' : 'Start Track'}</span>
                        <RiArrowRightLine size={16} aria-hidden="true" />
                    </NavLink>
                )}
            </div>
        </motion.article>
    );
}

CourseCard.propTypes = {
    isPreview: PropTypes.bool,
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
        modules: PropTypes.array,
    }).isRequired,
};
