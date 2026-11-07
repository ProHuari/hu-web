import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import logoHuari from '../../assets/images/logoHuari.svg';
import { useApp } from '../../context/AppContext';
import {
    RiHome4Line,
    RiGovernmentLine,
    RiBookOpenLine,
    RiChatSmile3Line,
    RiSettings3Line,
    RiShutDownLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiCloseLine,
    RiUser3Line,
} from 'react-icons/ri';
import './style.css';

const MENU_ITEMS = [
    { label: 'Dashboard', path: '/dashboard', icon: RiHome4Line },
    { label: 'Lawmakers', path: '/lawmakers', icon: RiGovernmentLine },
    { label: 'Learn', path: '/learn', icon: RiBookOpenLine },
    { label: 'Chat Huari', path: '/chat', icon: RiChatSmile3Line, badge: 'AI' },
];

export default function SideBar({ isMobileOpen = false, onCloseMobile }) {
    const [isOpen, setIsOpen] = useState(true);
    const { user } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('huari_token');
        sessionStorage.removeItem('huari_token');
        if (onCloseMobile) onCloseMobile();
        navigate('/');
    };

    const handleItemClick = () => {
        if (onCloseMobile) {
            onCloseMobile();
        }
    };

    return (
        <>
            {/* Backdrop overlay for mobile drawer */}
            {isMobileOpen && (
                <div
                    className="sidebar-mobile-backdrop"
                    onClick={onCloseMobile}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'} ${
                    isMobileOpen ? 'sidebar-mobile-visible' : ''
                }`}
                aria-label="Main Navigation"
            >
                {/* Header Controls: Toggle Collapse (desktop) & Close Drawer (mobile) */}
                <div className="sidebar-header-controls">
                    {/* Mobile close button */}
                    <button
                        type="button"
                        className="sidebar-mobile-close-btn"
                        onClick={onCloseMobile}
                        aria-label="Close navigation menu"
                    >
                        <RiCloseLine size={24} />
                    </button>

                    {/* Desktop collapse toggle */}
                    <button
                        type="button"
                        className="sidebar-toggle"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <RiArrowLeftSLine size={20} /> : <RiArrowRightSLine size={20} />}
                    </button>
                </div>

                {/* Brand / Logo */}
                <NavLink
                    to="/dashboard"
                    className="sidebar-brand-link"
                    onClick={handleItemClick}
                    title="Huari — Civic Intelligence"
                >
                    <div className="sidebar-brand">
                        <img src={logoHuari} alt="Huari Logo" className="sidebar-brand-img" />
                        {isOpen && (
                            <div className="sidebar-brand-text">
                                <h2 className="sidebar-brand-title">HUARI</h2>
                                <p className="sidebar-brand-subtitle">
                                    Transparency &amp; Citizenship
                                </p>
                            </div>
                        )}
                    </div>
                </NavLink>

                {/* User Profile Card */}
                <NavLink
                    to="/profile"
                    className="sidebar-user-link"
                    onClick={handleItemClick}
                    title={!isOpen ? user.name : undefined}
                >
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <RiUser3Line size={20} />
                            )}
                        </div>

                        {isOpen && (
                            <div className="sidebar-user-info">
                                <strong className="sidebar-user-name" title={user.name}>
                                    {user.name}
                                </strong>
                                <span className="sidebar-user-email" title={user.email}>
                                    {user.email}
                                </span>
                            </div>
                        )}
                    </div>
                </NavLink>

                <div className="sidebar-divider" />

                {/* Navigation Links */}
                <nav className="sidebar-navigation" aria-label="Primary Navigation">
                    {isOpen && (
                        <span className="sidebar-section-title">
                            Main Menu
                        </span>
                    )}

                    {MENU_ITEMS.map(({ label, path, icon: Icon, badge }) => (
                        <NavLink
                            key={label}
                            to={path}
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? 'is-active' : ''}`
                            }
                            onClick={handleItemClick}
                            title={!isOpen ? label : undefined}
                        >
                            <Icon className="sidebar-item-icon" size={20} />
                            {isOpen && <span className="sidebar-item-label">{label}</span>}
                            {isOpen && badge && (
                                <span className="sidebar-badge">{badge}</span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Actions: Settings & Logout */}
                <div className="sidebar-bottom">
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `sidebar-item ${isActive ? 'is-active' : ''}`
                        }
                        onClick={handleItemClick}
                        title={!isOpen ? 'Settings' : undefined}
                    >
                        <RiSettings3Line className="sidebar-item-icon" size={20} />
                        {isOpen && <span className="sidebar-item-label">Settings</span>}
                    </NavLink>

                    <button
                        type="button"
                        className="sidebar-item sidebar-logout-btn"
                        onClick={handleLogout}
                        title={!isOpen ? 'Log Out' : undefined}
                    >
                        <RiShutDownLine className="sidebar-item-icon" size={20} />
                        {isOpen && <span className="sidebar-item-label">Log Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}

SideBar.propTypes = {
    isMobileOpen: PropTypes.bool,
    onCloseMobile: PropTypes.func,
};
