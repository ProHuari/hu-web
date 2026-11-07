import React, { useState } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import SideBar from '../../components/sidebar';
import Footer from '../../components/footer';
import logoHuari from '../../assets/images/logoHuari.svg';
import { useApp } from '../../context/AppContext';
import { RiMenuLine, RiUser3Line } from 'react-icons/ri';
import './style.css';

export default function MainLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const { user } = useApp();

    const isChatRoute = location.pathname.startsWith('/chat');

    return (
        <div className="main-layout-root">
            {/* Mobile Topbar for screens < 768px */}
            <header className="main-mobile-topbar" aria-label="Mobile Header">
                <button
                    type="button"
                    className="mobile-hamburger-btn"
                    onClick={() => setIsMobileOpen(true)}
                    aria-label="Open navigation menu"
                >
                    <RiMenuLine size={24} />
                </button>

                <NavLink to="/dashboard" className="mobile-brand-link">
                    <img src={logoHuari} alt="Huari Logo" className="mobile-logo-img" />
                    <span className="mobile-brand-title">HUARI</span>
                </NavLink>

                <NavLink to="/profile" className="mobile-user-avatar-btn" aria-label="User Profile">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                    ) : (
                        <RiUser3Line size={18} />
                    )}
                </NavLink>
            </header>

            {/* Persistent Sidebar */}
            <SideBar
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
            />

            {/* Main Content Column */}
            <div className={`main-layout-content-col ${isChatRoute ? 'is-chat-layout' : ''}`}>
                <main className="main-layout-page-content">
                    <Outlet />
                </main>

                {!isChatRoute && <Footer />}
            </div>
        </div>
    );
}

