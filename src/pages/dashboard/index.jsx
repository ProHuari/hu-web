import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../../components/motion/MotionPrimitives';
import HomeHeader from '../../components/home-header';
import HomeStats from '../../components/home-stats';
import ParliamentariansGrid from '../../components/parliamentarians-grid';
import EducationalBanner from '../../components/educational-banner';
import { RiArrowRightLine } from 'react-icons/ri';
import './style.css';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <PageTransition className="dashboard-page">
            <HomeHeader
                onViewParliamentarians={() => navigate('/lawmakers')}
                onExploreLearn={() => navigate('/learn')}
                onOpenChat={() => navigate('/chat')}
            />

            <section className="dashboard-section" aria-label="Platform Key Metrics">
                <HomeStats />
            </section>

            <section className="dashboard-section dashboard-featured-lawmakers" aria-label="Featured Lawmakers">
                <div className="dashboard-section-header">
                    <div>
                        <h2 className="dashboard-section-title">Featured Lawmakers</h2>
                        <p className="dashboard-section-subtitle">
                            Real-time congressional activity, verified attendance, and CEAP quota expenses.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="dashboard-view-all-btn"
                        onClick={() => navigate('/lawmakers')}
                    >
                        <span>View all lawmakers</span>
                        <RiArrowRightLine size={16} aria-hidden="true" />
                    </button>
                </div>

                <ParliamentariansGrid />
            </section>

            <section className="dashboard-section dashboard-education-section" aria-label="Civic Academy Banner">
                <EducationalBanner />
            </section>
        </PageTransition>
    );
}
