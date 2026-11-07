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
    lawmaker,
    id,
    name,
    position,
    role,
    party,
    state,
    attendance,
    projects,
    expenses,
    avatar,
    onView,
}) {
    const navigate = useNavigate();
    const { isBookmarked, toggleBookmark } = useApp() || {};

    // Support either whole lawmaker object prop or destructured individual props
    const cardId = lawmaker?.id ?? id;
    const cardName = lawmaker?.name ?? name ?? 'Lawmaker';
    const cardPosition = lawmaker?.position ?? lawmaker?.role ?? position ?? role ?? 'Federal Deputy';
    const cardParty = lawmaker?.party ?? party ?? 'PL';
    const cardState = lawmaker?.state ?? state ?? 'DF';
    const cardAttendance = lawmaker?.attendance ?? attendance ?? '0%';
    const cardProjects = lawmaker?.projects ?? projects ?? '0';
    const cardExpenses = lawmaker?.expenses ?? expenses ?? 'R$ 0';
    const cardAvatar = lawmaker?.avatar ?? avatar ?? null;

    const bookmarked = cardId ? isBookmarked?.(cardId) : false;

    const handleToggleBookmark = (e) => {
        e.stopPropagation();
        if (cardId && toggleBookmark) {
            toggleBookmark(cardId);
        }
    };

    const handleView = () => {
        if (onView) {
            onView();
        } else if (cardId) {
            navigate(`/lawmakers/${cardId}`);
        }
    };

    return (
        <article className="parliamentarian-card">
            <div className="parliamentarian-card-top">
                <Avatar
                    src={cardAvatar}
                    name={cardName}
                    size="lg"
                    className="parliamentarian-avatar"
                />

                <button
                    type="button"
                    className={`parliamentarian-bookmark ${bookmarked ? 'is-favorite' : ''}`}
                    aria-label={
                        bookmarked
                            ? `Remove ${cardName} from saved lawmakers`
                            : `Save ${cardName} to bookmarks`
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
                <h2 className="parliamentarian-name">{cardName}</h2>
                <p className="parliamentarian-position">{cardPosition}</p>
            </div>

            <div className="parliamentarian-tags">
                <Badge variant="primary" size="md">
                    {cardParty}
                </Badge>

                <Badge variant="secondary" size="md" icon={RiMapPinLine}>
                    {cardState}
                </Badge>
            </div>

            <div className="parliamentarian-stats">
                <div className="parliamentarian-stat">
                    <span className="stat-label">Attendance</span>
                    <strong className="stat-value">{cardAttendance}</strong>
                </div>

                <div className="parliamentarian-stat">
                    <span className="stat-label">Bills</span>
                    <strong className="stat-value">{cardProjects}</strong>
                </div>

                <div className="parliamentarian-stat">
                    <span className="stat-label">Spending</span>
                    <strong className="stat-value">{cardExpenses}</strong>
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
    lawmaker: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        position: PropTypes.string,
        role: PropTypes.string,
        party: PropTypes.string,
        state: PropTypes.string,
        attendance: PropTypes.string,
        projects: PropTypes.string,
        expenses: PropTypes.string,
        avatar: PropTypes.string,
    }),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    position: PropTypes.string,
    role: PropTypes.string,
    party: PropTypes.string,
    state: PropTypes.string,
    attendance: PropTypes.string,
    projects: PropTypes.string,
    expenses: PropTypes.string,
    avatar: PropTypes.string,
    onView: PropTypes.func,
};
