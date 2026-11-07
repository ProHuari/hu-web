import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
    RiBookmarkLine,
    RiBookmarkFill,
    RiMapPinLine,
} from 'react-icons/ri';
import Avatar from '../avatar';
import Badge from '../badge';
import { useApp } from '../../context/AppContext';
import './style.css';

export default function ParliamentarianCard({
    id,
    name,
    position = 'Federal Deputy',
    party = 'PL',
    state = 'SP',
    attendance = '0%',
    projects = '0',
    expenses = 'R$ 0',
    avatar = null,
    onView,
}) {
    const navigate = useNavigate();
    const { isBookmarked, toggleBookmark } = useApp();

    const bookmarked = id ? isBookmarked(id) : false;

    const handleToggleBookmark = (e) => {
        e.stopPropagation();
        if (id) {
            toggleBookmark(id);
        }
    };

    const handleView = () => {
        if (onView) {
            onView();
        } else if (id) {
            navigate(`/lawmakers/${id}`);
        }
    };

    return (
        <article className="parliamentarian-card">
            <div className="parliamentarian-card-top">
                <Avatar
                    src={avatar}
                    name={name}
                    size="lg"
                    className="parliamentarian-avatar"
                />

                <button
                    type="button"
                    className={`parliamentarian-bookmark ${bookmarked ? 'is-favorite' : ''}`}
                    aria-label={
                        bookmarked
                            ? `Remove ${name} from saved lawmakers`
                            : `Save ${name} to bookmarks`
                    }
                    aria-pressed={bookmarked}
                    onClick={handleToggleBookmark}
                >
                    {bookmarked ? (
                        <RiBookmarkFill aria-hidden="true" size={22} />
                    ) : (
                        <RiBookmarkLine aria-hidden="true" size={22} />
                    )}
                </button>
            </div>

            <div className="parliamentarian-info">
                <h2 className="parliamentarian-name">{name}</h2>
                <p className="parliamentarian-position">{position}</p>
            </div>

            <div className="parliamentarian-tags">
                <Badge variant="primary" size="md">
                    {party}
                </Badge>

                <Badge variant="secondary" size="md" icon={RiMapPinLine}>
                    {state}
                </Badge>
            </div>

            <div className="parliamentarian-stats">
                <div className="parliamentarian-stat">
                    <span className="stat-label">Attendance</span>
                    <strong className="stat-value">{attendance}</strong>
                </div>

                <div className="parliamentarian-stat">
                    <span className="stat-label">Bills</span>
                    <strong className="stat-value">{projects}</strong>
                </div>

                <div className="parliamentarian-stat">
                    <span className="stat-label">Spending</span>
                    <strong className="stat-value">{expenses}</strong>
                </div>
            </div>

            <button
                type="button"
                className="parliamentarian-view-button"
                onClick={handleView}
            >
                View Profile
            </button>
        </article>
    );
}

ParliamentarianCard.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    position: PropTypes.string,
    party: PropTypes.string,
    state: PropTypes.string,
    attendance: PropTypes.string,
    projects: PropTypes.string,
    expenses: PropTypes.string,
    avatar: PropTypes.string,
    onView: PropTypes.func,
};
