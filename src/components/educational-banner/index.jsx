import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { RiArrowRightLine } from 'react-icons/ri';
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
        <section className="educational-banner" aria-label="Trilhas de formação cívica">
            <div className="educational-banner-copy">
                <span className="educational-banner-kicker">Academia Cívica</span>
                <h2 className="educational-banner-title">
                    Entenda o orçamento público e o rito das leis no Brasil
                </h2>
                <p className="educational-banner-desc">
                    Aulas diretas sobre LDO, LOA, tramitação no Congresso e leitura crítica de notas da Cota Parlamentar.
                </p>
            </div>

            <button
                type="button"
                className="educational-banner-button"
                onClick={handleClick}
            >
                <span>Ver trilhas disponíveis</span>
                <RiArrowRightLine aria-hidden="true" size={18} />
            </button>
        </section>
    );
}

EducationalBanner.propTypes = {
    onAccessLessons: PropTypes.func,
};
