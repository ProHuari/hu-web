
import { useState } from 'react';
import './style.css';

import {
    RiUser3Fill,
    RiBookmarkLine,
    RiBookmarkFill,
    RiMapPinLine,
} from 'react-icons/ri';

export default function ParliamentarianCard({
    name,
    position,
    party,
    state,
    attendance,
    projects,
    expenses,
    onView,
}) {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleToggleFavorite = () => {
        setIsFavorite((previousValue) => !previousValue);
    };

    return (
        <article className="parliamentarian-card">
            <div className="parliamentarian-card-top">
                <RiUser3Fill
                    className="parliamentarian-avatar"
                    aria-hidden="true"
                />

                <button
                    type="button"
                    className={`parliamentarian-bookmark ${
                        isFavorite ? 'is-favorite' : ''
                    }`}
                    aria-label={
                        isFavorite
                            ? `Remover ${name} dos favoritos`
                            : `Adicionar ${name} aos favoritos`
                    }
                    aria-pressed={isFavorite}
                    onClick={handleToggleFavorite}
                >
                    {isFavorite ? (
                        <RiBookmarkFill aria-hidden="true" />
                    ) : (
                        <RiBookmarkLine aria-hidden="true" />
                    )}
                </button>
            </div>

            <div className="parliamentarian-info">
                <h2 className="text-h3-bold">{name}</h2>
                <p className="parliamentarian-position">{position}</p>
            </div>

            <div className="parliamentarian-tags">
                <span className="parliamentarian-party">{party}</span>

                <span className="parliamentarian-state">
                    <RiMapPinLine aria-hidden="true" />
                    {state}
                </span>
            </div>

            <div className="parliamentarian-stats">
                <div className="parliamentarian-stat">
                    <span>Presença</span>
                    <span>{attendance}</span>
                </div>

                <div className="parliamentarian-stat">
                    <span>Projetos</span>
                    <span>{projects}</span>
                </div>

                <div className="parliamentarian-stat">
                    <span>Gastos</span>
                    <span>{expenses}</span>
                </div>
            </div>

            <button
                type="button"
                className="parliamentarian-view-button"
                onClick={onView}
            >
                Ver Deputado
            </button>
        </article>
    );
}
