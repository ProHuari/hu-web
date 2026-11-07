import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
    RiArrowRightLine,
    RiBookOpenLine,
    RiSparklingLine,
} from 'react-icons/ri';
import './style.css';

export default function HomeHeader({
    onViewParliamentarians,
    onExploreLearn,
    onOpenChat,
}) {
    const navigate = useNavigate();

    const handleViewLawmakers = onViewParliamentarians || (() => navigate('/lawmakers'));
    const handleExploreLearn = onExploreLearn || (() => navigate('/learn'));
    const handleOpenChat = onOpenChat || (() => navigate('/chat'));

    return (
        <header className="home-header" aria-label="Platform Hero Banner">
            <div className="home-header-content">
                <div className="home-header-badge">
                    <span className="home-header-badge-dot" />
                    <span>Real-Time Civic Oversight Platform</span>
                </div>

                <h1 className="text-h1-bold">
                    Political transparency at your
                    <br className="home-header-title-break" />
                    fingertips
                </h1>

                <p className="text-p-regular home-header-description">
                    Track public spending data on lawmakers in real-time, learn about the political system through interactive courses, and audit governance with Huari AI.
                </p>

                <div className="home-header-actions">
                    <button
                        type="button"
                        className="home-header-button home-header-button-light"
                        onClick={handleViewLawmakers}
                    >
                        <span>View Lawmakers</span>
                        <RiArrowRightLine aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="home-header-button home-header-button-light"
                        onClick={handleExploreLearn}
                    >
                        <span>Explore Courses</span>
                        <RiBookOpenLine aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="home-header-button home-header-button-accent"
                        onClick={handleOpenChat}
                    >
                        <span>Ask Civic AI</span>
                        <RiSparklingLine aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    );
}

HomeHeader.propTypes = {
    onViewParliamentarians: PropTypes.func,
    onExploreLearn: PropTypes.func,
    onOpenChat: PropTypes.func,
};
