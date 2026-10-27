
import { useState } from 'react';

import SideBar from '../../components/sidebar';
import HomeHeader from '../../components/home-header';
import HomeStats from '../../components/home-stats';
import ParliamentariansGrid from '../../components/parliamentarians-grid';
import EducationalBanner from '../../components/educational-banner';
import Footer from '../../components/footer';

import './style.css';

export default function Home({ onNavigateToLogin }) {
    const [activeItem, setActiveItem] = useState('Home');

    const handleNavigate = (label) => {
        setActiveItem(label);

        if (label === 'Home') {
            setActiveItem('Home');
        }
    };

    const handleLogout = () => {
        onNavigateToLogin?.();
    };

    const handleAccessLessons = () => {
        handleNavigate('Learn');
        console.log('Navegação para a página de ensino');
    };

    return (
        <div className="home-layout">
            <SideBar
                activeItem={activeItem}
                onNavigate={handleNavigate}
                onSettings={() => console.log('Configurações')}
                onLogout={handleLogout}
            />

            <main className="home-content">
                <HomeHeader
                    onViewParliamentarians={() =>
                        handleNavigate('Lawmakers')
                    }
                    onExploreLearn={handleAccessLessons}
                    onOpenChat={() =>
                        handleNavigate('Chat Huari')
                    }
                />

                <div className="home-stats-container">
                    <HomeStats />
                </div>

                <section className="home-parliamentarians">
                    <ParliamentariansGrid />
                </section>

                <div className="home-educational-container">
                    <EducationalBanner
                        onAccessLessons={handleAccessLessons}
                    />
                </div>

                <Footer />
            
            </main>
        </div>
    );
}
