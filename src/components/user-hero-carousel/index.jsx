import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    RiArrowRightLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiBookOpenLine,
    RiSparklingLine,
    RiCheckDoubleLine,
    RiFilePdfLine,
    RiTimeLine,
} from 'react-icons/ri';
import './style.css';

const SLIDES = [
    {
        id: 'transparency',
        glowClass: '',
        kicker: 'Informações de Hoje • Fiscalização Cidadã',
        title: 'Transparência política na ponta dos seus dedos',
        description:
            'Acompanhe despesas com a Cota Parlamentar (CEAP) em tempo real, veja a frequência em plenário e consulte o histórico de votações nominais de deputados e senadores.',
        actions: [
            { label: 'Ver Legisladores', path: '/lawmakers', variant: 'primary', icon: RiArrowRightLine },
            { label: 'Explorar Cursos', path: '/learn', variant: 'secondary', icon: RiBookOpenLine },
            { label: 'Perguntar à IA', path: '/chat', variant: 'outline', icon: RiSparklingLine },
        ],
    },
    {
        id: 'courses',
        glowClass: 'user-hero-bg-glow--accent',
        kicker: 'Destaque da Academia • Nova Trilha Disponível',
        title: 'Domine a Auditoria do Orçamento Municipal & Federal',
        description:
            'Trilhas 100% gratuitas e práticas desenvolvidas por especialistas para capacitar qualquer cidadão a auditar compras públicas, emendas e licitações na sua cidade.',
        tags: [
            { label: '6 Aulas Práticas', icon: RiTimeLine },
            { label: 'Guias em PDF', icon: RiFilePdfLine },
            { label: 'Certificação Aberta', icon: RiCheckDoubleLine },
        ],
        actions: [
            { label: 'Acessar Trilha de Orçamento', path: '/learn', variant: 'primary', icon: RiArrowRightLine },
            { label: 'Ver Todas as Trilhas', path: '/learn', variant: 'secondary', icon: RiBookOpenLine },
        ],
    },
    {
        id: 'ai',
        glowClass: 'user-hero-bg-glow--ai',
        kicker: 'Dica de Uso • Huari Civic AI',
        title: 'Tire dúvidas e audite dados complexos com a Huari AI',
        description:
            'Converse em português simples e receba análises transparentes a partir de dados abertos oficiais da Câmara dos Deputados e do Senado.',
        promptSuggestion: 'Exemplo: "Qual parlamentar gastou mais com cota parlamentar no último mês?"',
        actions: [
            { label: 'Abrir Chat Huari', path: '/chat', variant: 'primary', icon: RiSparklingLine },
            { label: 'Como Funciona a Auditoria', path: '/learn', variant: 'outline', icon: RiArrowRightLine },
        ],
    },
];

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 120 : -120,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
        transition: {
            x: { type: 'spring', stiffness: 320, damping: 30 },
            opacity: { duration: 0.22 },
        },
    },
    exit: (direction) => ({
        x: direction > 0 ? -120 : 120,
        opacity: 0,
        transition: {
            x: { type: 'spring', stiffness: 320, damping: 30 },
            opacity: { duration: 0.18 },
        },
    }),
};

export default function UserHeroCarousel() {
    const navigate = useNavigate();
    const [[page, direction], setPage] = useState([0, 0]);
    const [isHovered, setIsHovered] = useState(false);

    const activeIndex = ((page % SLIDES.length) + SLIDES.length) % SLIDES.length;

    const paginate = useCallback(
        (newDirection) => {
            setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
        },
        []
    );

    const goToSlide = (targetIndex) => {
        const diff = targetIndex - activeIndex;
        if (diff !== 0) {
            setPage(([prevPage]) => [prevPage + diff, diff > 0 ? 1 : -1]);
        }
    };

    // Autoplay com pausa ao passar o mouse ou segurar
    useEffect(() => {
        if (isHovered) return undefined;
        const timer = setInterval(() => {
            paginate(1);
        }, 6500);

        return () => clearInterval(timer);
    }, [isHovered, paginate]);

    const activeSlide = SLIDES[activeIndex];

    return (
        <section
            className="user-hero-carousel"
            aria-label="Carrossel de Informações de Hoje"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`user-hero-bg-glow ${activeSlide.glowClass}`} aria-hidden="true" />

            {/* Setas Laterais de Navegação */}
            <button
                type="button"
                className="user-hero-arrow-btn user-hero-arrow-btn--prev"
                onClick={() => paginate(-1)}
                aria-label="Slide anterior"
            >
                <RiArrowLeftSLine size={24} />
            </button>

            <button
                type="button"
                className="user-hero-arrow-btn user-hero-arrow-btn--next"
                onClick={() => paginate(1)}
                aria-label="Próximo slide"
            >
                <RiArrowRightSLine size={24} />
            </button>

            {/* Conteúdo Animado com AnimatePresence e Swipe / Drag */}
            <div className="user-hero-slide-wrapper">
                <AnimatePresence custom={direction} mode="wait" initial={false}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.4}
                        onDragEnd={(_, { offset, velocity }) => {
                            const swipe = Math.abs(offset.x) * velocity.x;
                            if (swipe < -8000 || offset.x < -60) {
                                paginate(1);
                            } else if (swipe > 8000 || offset.x > 60) {
                                paginate(-1);
                            }
                        }}
                        className="user-hero-slide"
                    >
                        <div className="user-hero-content">
                            <span className="user-hero-kicker-badge">
                                <span className="user-hero-kicker-dot" aria-hidden="true" />
                                <span>{activeSlide.kicker}</span>
                            </span>

                            <h1 className="user-hero-title">{activeSlide.title}</h1>

                            <p className="user-hero-description">{activeSlide.description}</p>

                            {/* Tags destacadas (Slide 2) */}
                            {activeSlide.tags && (
                                <div className="user-hero-tags-row">
                                    {activeSlide.tags.map((tag) => {
                                        const Icon = tag.icon;
                                        return (
                                            <span key={tag.label} className="user-hero-tag-pill">
                                                <Icon size={14} aria-hidden="true" />
                                                <span>{tag.label}</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Prompt suggestion chip (Slide 3) */}
                            {activeSlide.promptSuggestion && (
                                <button
                                    type="button"
                                    className="user-hero-prompt-chip"
                                    onClick={() => navigate('/chat')}
                                    title="Abrir no Chat Huari"
                                >
                                    <RiSparklingLine size={15} style={{ color: 'var(--color-primary)' }} />
                                    <span>{activeSlide.promptSuggestion}</span>
                                </button>
                            )}

                            {/* Ações / Botões */}
                            <div className="user-hero-actions">
                                {activeSlide.actions.map((act) => {
                                    const Icon = act.icon;
                                    return (
                                        <button
                                            key={act.label}
                                            type="button"
                                            className={`user-hero-btn user-hero-btn--${act.variant}`}
                                            onClick={() => navigate(act.path)}
                                        >
                                            <span>{act.label}</span>
                                            {Icon && <Icon size={17} aria-hidden="true" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Paginação em Bolinhas Clicáveis */}
            <div className="user-hero-pagination" role="tablist" aria-label="Indicadores de Slides">
                {SLIDES.map((slide, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                        <button
                            key={slide.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-label={`Ir para slide ${idx + 1}: ${slide.title}`}
                            className="user-hero-dot-btn"
                            onClick={() => goToSlide(idx)}
                        >
                            <span
                                className={`user-hero-dot ${isActive ? 'user-hero-dot--active' : ''}`}
                            />
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
