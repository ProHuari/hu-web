import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../../components/motion/MotionPrimitives';
import { useApp } from '../../context/AppContext';
import AdminDashboardView from '../../components/admin/admin-dashboard-view';
import UserHeroCarousel from '../../components/user-hero-carousel';
import HomeStats from '../../components/home-stats';
import ParliamentariansGrid from '../../components/parliamentarians-grid';
import EducationalBanner from '../../components/educational-banner';
import { RiArrowRightLine } from 'react-icons/ri';
import './style.css';

export { AdminDashboardView, UserHeroCarousel };

export default function Dashboard() {
    const navigate = useNavigate();
    const { isAdmin = false } = useApp() || {};

    return (
        <PageTransition className="dashboard-page">
            {isAdmin ? (
                <AdminDashboardView />
            ) : (
                <div className="dashboard-citizen-layout">
                    <UserHeroCarousel />

                    <section className="dashboard-section" aria-label="Indicadores da plataforma">
                        <HomeStats />
                    </section>

                    <section
                        className="dashboard-section dashboard-featured-lawmakers"
                        aria-label="Parlamentares em destaque"
                    >
                        <div className="dashboard-section-header">
                            <div>
                                <h2 className="dashboard-section-title">Parlamentares em destaque</h2>
                                <p className="dashboard-section-subtitle">
                                    Consulte registros de projetos de lei e despesas da Cota Parlamentar diretamente da base pública.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="dashboard-view-all-btn"
                                onClick={() => navigate('/lawmakers')}
                            >
                                <span>Ver diretório completo</span>
                                <RiArrowRightLine size={16} aria-hidden="true" />
                            </button>
                        </div>

                        <ParliamentariansGrid />
                    </section>

                    <section
                        className="dashboard-section dashboard-education-section"
                        aria-label="Academia Cívica"
                    >
                        <EducationalBanner />
                    </section>
                </div>
            )}
        </PageTransition>
    );
}
