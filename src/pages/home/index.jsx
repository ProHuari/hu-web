import { useState } from 'react';
import SideBar from '../../components/sidebar';
import './style.css';

export default function Home() {
    const [activeItem, setActiveItem] = useState('Home');

    const handleNavigate = (label) => {
        setActiveItem(label);

        // Depois você pode implementar a navegação
        // para cada página aqui.
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
                <h1 className="text-h1-bold">Home</h1>
            </main>
        </div>
    );
}