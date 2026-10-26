import { useState } from 'react';
import SideBar from '../../components/sidebar';
import HomeHeader from '../../components/home-header';
import HomeStats from '../../components/home-stats';
import './style.css';

export default function Home() {
    const [activeItem, setActiveItem] = useState('Home');

    const handleNavigate = (label) => {
        setActiveItem(label);
    };

    return (
        <div className="home-layout">
            <SideBar
                activeItem={activeItem}
                onNavigate={handleNavigate}
                onSettings={() => console.log('Configurações')}
                onLogout={() => console.log('Logout')}
            />

            <main className="home-content">
                <HomeHeader
                    onViewParliamentarians={() => handleNavigate('Lawmakers')}
                    onExploreLearn={() => handleNavigate('Learn')}
                    onOpenChat={() => handleNavigate('Chat Huari')}
                />

                <div className="home-stats-container">
                    <HomeStats />
                </div>
            </main>
        </div>
    );
}