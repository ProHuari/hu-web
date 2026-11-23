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
    chamber,
    billsCount,
    projects,
    expenses,
    avatar,
    onView,
}) {
    const navigate = useNavigate();
    const { isBookmarked, toggleBookmark } = useApp() || {};

    const cardId = lawmaker?.id ?? id;
    const cardName = lawmaker?.name ?? name ?? 'Parlamentar';
    const cardPosition = lawmaker?.position ?? lawmaker?.role ?? position ?? role ?? 'Deputado Federal';
    const cardParty = lawmaker?.party ?? party ?? '—';
    const cardState = lawmaker?.state ?? state ?? '—';
    const resolvedChamber = lawmaker?.chamber ?? chamber;
    const chamberShort = resolvedChamber === 'FEDERAL_SENATE' ? 'Senado' : 'Câmara';
    const cardBills = lawmaker?.billsCount ?? lawmaker?.projects ?? billsCount ?? projects ?? '0';
    const cardExpenses = lawmaker?.expenses ?? expenses ?? 'Sem registros';
    const rawAvatar =
        lawmaker?.avatar ??
        lawmaker?.photoUrl ??
        lawmaker?.urlFoto ??
        avatar ??
        null;
    const cardAvatar =
        typeof rawAvatar === 'string' && rawAvatar.trim() !== ''
            ? rawAvatar.trim()
            : '/images/default-avatar.png';

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
                            ? `Remover ${cardName} dos parlamentares salvos`
                            : `Salvar ${cardName} para acompanhar`
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
                    <span className="stat-label">Casa</span>
                    <strong className="stat-value">{chamberShort}</strong>
                </div>

                <div className="parliamentarian-stat">
                    <span className="stat-label">Projetos</span>
                    <strong className="stat-value tabular-nums">{cardBills}</strong>
                </div>

                <div className="parliamentarian-stat">
                    <span className="stat-label">Despesas CEAP</span>
                    <strong className="stat-value tabular-nums">{cardExpenses}</strong>
                </div>
            </div>

            <button
                type="button"
                className="parliamentarian-view-button"
                onClick={handleView}
            >
                Ver mandato
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
        chamber: PropTypes.string,
        billsCount: PropTypes.number,
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
    chamber: PropTypes.string,
    billsCount: PropTypes.number,
    projects: PropTypes.string,
    expenses: PropTypes.string,
    avatar: PropTypes.string,
    onView: PropTypes.func,
};
