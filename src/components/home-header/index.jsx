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
        <header className="home-header" aria-label="Apresentação da plataforma">
            <div className="home-header-content">
                <h1 className="text-h1-bold">
                    Transparência política
                    <br className="home-header-title-break" />
                    ao alcance de todos
                </h1>

                <p className="text-p-regular home-header-description">
                    Acompanhe despesas da Cota Parlamentar, consulte projetos de lei em tramitação e entenda decisões públicas em linguagem acessível.
                </p>

                <div className="home-header-actions">
                    <button
                        type="button"
                        className="home-header-button home-header-button-light"
                        onClick={handleViewLawmakers}
                    >
                        <span>Ver parlamentares</span>
                        <RiArrowRightLine aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="home-header-button home-header-button-light"
                        onClick={handleExploreLearn}
                    >
                        <span>Trilhas de ensino</span>
                        <RiBookOpenLine aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="home-header-button home-header-button-accent"
                        onClick={handleOpenChat}
                    >
                        <span>Perguntar à Huari IA</span>
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
