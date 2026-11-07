import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
    RiGraduationCapFill,
    RiArrowRightLine,
} from 'react-icons/ri';
import './style.css';

export default function EducationalBanner({ onAccessLessons }) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onAccessLessons) {
            onAccessLessons();
        } else {
            navigate('/learn');
        }
    };

    return (
        <section className="educational-banner" aria-label="Civic Education Banner">
            <div className="educational-banner-icon">
                <RiGraduationCapFill aria-hidden="true" size={32} />
            </div>

            <h2 className="educational-banner-title">
                Want to better understand how politics works?
            </h2>

            <p className="educational-banner-desc">
                Access our educational portal with learning tracks, infographics,
                and practical guides on the Brazilian political and budgetary system.
            </p>

            <button
                type="button"
                className="educational-banner-button"
                onClick={handleClick}
            >
                <span>Explore Courses</span>
                <RiArrowRightLine aria-hidden="true" size={18} />
            </button>
        </section>
    );
}

EducationalBanner.propTypes = {
    onAccessLessons: PropTypes.func,
};
