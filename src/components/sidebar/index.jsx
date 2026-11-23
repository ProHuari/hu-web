import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import logoHuari from '../../assets/images/logo-huari.svg';
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
    RiShieldStarLine,
    RiAddCircleLine,
} from 'react-icons/ri';
import './style.css';

const MENU_ITEMS = [
    { label: 'Início', path: '/dashboard', icon: RiHome4Line },
    { label: 'Parlamentares', path: '/lawmakers', icon: RiGovernmentLine },
    { label: 'Trilhas', path: '/learn', icon: RiBookOpenLine },
    { label: 'Huari IA', path: '/chat', icon: RiChatSmile3Line },
];

const ADMIN_ITEMS = [
    { label: 'Gerenciar trilhas', path: '/admin/courses', icon: RiShieldStarLine },
    { label: 'Nova trilha', path: '/admin/courses/new', icon: RiAddCircleLine },
];

export default function SideBar({ isMobileOpen = false, onCloseMobile }) {
    const [isOpen, setIsOpen] = useState(true);
    const { user = {}, isAdmin = false, logout } = useApp() || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        logout?.();
        if (onCloseMobile) onCloseMobile();
        navigate('/login');
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
                className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobileOpen ? 'sidebar-mobile-visible' : ''
                    }`}
                aria-label="Navegação principal"
            >
                <div className="sidebar-header-controls">
                    <button
                        type="button"
                        className="sidebar-mobile-close-btn"
                        onClick={onCloseMobile}
                        aria-label="Fechar menu de navegação"
                    >
                        <RiCloseLine size={24} />
                    </button>

                    <button
                        type="button"
                        className="sidebar-toggle"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-label={isOpen ? 'Recolher menu lateral' : 'Expandir menu lateral'}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <RiArrowLeftSLine size={20} /> : <RiArrowRightSLine size={20} />}
                    </button>
                </div>

                <NavLink
                    to="/dashboard"
                    className="sidebar-brand-link"
                    onClick={handleItemClick}
                    title="Huari — Transparência Cívica"
                >
                    <div className="sidebar-brand">
                        <img src={logoHuari} alt="Huari Logo" className="sidebar-brand-img" />
                        {isOpen && (
                            <div className="sidebar-brand-text">
                                <h2 className="sidebar-brand-title">HUARI</h2>
                                <p className="sidebar-brand-subtitle">
                                    Dados Públicos &amp; Cidadania
                                </p>
                            </div>
                        )}
                    </div>
                </NavLink>

                <NavLink
                    to="/profile"
                    className="sidebar-user-link"
                    onClick={handleItemClick}
                    title={!isOpen ? user?.name : undefined}
                >
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = '/images/default-avatar.png';
                                    }}
                                />
                            ) : (
                                <RiUser3Line size={20} />
                            )}
                        </div>

                        {isOpen && (
                            <div className="sidebar-user-info">
                                <div className="sidebar-user-name-row">
                                    <strong className="sidebar-user-name" title={user?.name}>
                                        {user?.name || 'Visitante'}
                                    </strong>
                                    {isAdmin && (
                                        <span className="sidebar-role-badge">Admin</span>
                                    )}
                                </div>
                                <span className="sidebar-user-email" title={user?.email}>
                                    {user?.email || ''}
                                </span>
                            </div>
                        )}
                    </div>
                </NavLink>

                <div className="sidebar-divider" />

                <nav className="sidebar-navigation" aria-label="Menu principal">
                    {isOpen && (
                        <span className="sidebar-section-title">
                            Menu principal
                        </span>
                    )}

                    {MENU_ITEMS.map(({ label, path, icon: Icon }) => (
                        <NavLink
                            key={label}
                            to={path}
                            className={({ isActive }) =>
                                `sidebar-item ${isActive ? 'is-active' : ''}`
                            }
                            onClick={handleItemClick}
                            title={!isOpen ? label : undefined}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.span
                                            layoutId="sidebarActivePill"
                                            className="sidebar-active-indicator"
                                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                        />
                                    )}
                                    <Icon className="sidebar-item-icon" size={20} />
                                    {isOpen && <span className="sidebar-item-label">{label}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}

                    {isAdmin && (
                        <>
                            {isOpen && (
                                <span className="sidebar-section-title" style={{ marginTop: '12px' }}>
                                    Administração
                                </span>
                            )}
                            {ADMIN_ITEMS.map(({ label, path, icon: Icon }) => (
                                <NavLink
                                    key={label}
                                    to={path}
                                    end={path === '/admin/courses'}
                                    className={({ isActive }) =>
                                        `sidebar-item ${isActive ? 'is-active' : ''}`
                                    }
                                    onClick={handleItemClick}
                                    title={!isOpen ? label : undefined}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {isActive && (
                                                <motion.span
                                                    layoutId="sidebarActivePill"
                                                    className="sidebar-active-indicator"
                                                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                                />
                                            )}
                                            <Icon className="sidebar-item-icon" size={20} />
                                            {isOpen && <span className="sidebar-item-label">{label}</span>}
                                        </>
                                    )}
                                </NavLink>
                            ))}
                        </>
                    )}
                </nav>

                <div className="sidebar-bottom">
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            `sidebar-item ${isActive ? 'is-active' : ''}`
                        }
                        onClick={handleItemClick}
                        title={!isOpen ? 'Configurações' : undefined}
                    >
                        <RiSettings3Line className="sidebar-item-icon" size={20} />
                        {isOpen && <span className="sidebar-item-label">Configurações</span>}
                    </NavLink>

                    <button
                        type="button"
                        className="sidebar-item sidebar-logout-btn"
                        onClick={handleLogout}
                        title={!isOpen ? 'Sair' : undefined}
                    >
                        <RiShutDownLine className="sidebar-item-icon" size={20} />
                        {isOpen && <span className="sidebar-item-label">Sair</span>}
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
