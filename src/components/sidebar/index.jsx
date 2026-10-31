import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './style.css';
import logoHuari from '../../assets/images/logoHuari.svg';

import {
    RiUser3Fill,
    RiHome4Fill,
    RiTeamFill,
    RiBookOpenLine,
    RiMessage2Line,
    RiSettings3Line,
    RiShutDownLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
} from 'react-icons/ri';

const menuItems = [
    { label: 'Home', path: '/dashboard', icon: RiHome4Fill },
    { label: 'Lawmakers', path: '/lawmakers', icon: RiTeamFill },
    { label: 'Learn', path: '/learn', icon: RiBookOpenLine },
    { label: 'Chat Huari', path: '/chat', icon: RiMessage2Line },
];

export default function SideBar({
    userName = 'Carlos Oliveira',
    userEmail = 'carlos.oliveira@huari.org',
}) {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('huari_token');
        sessionStorage.removeItem('huari_token');
        navigate('/');
    };

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? 'Recolher menu lateral' : 'Expandir menu lateral'}
                aria-expanded={isOpen}
            >
                {isOpen ? <RiArrowLeftSLine /> : <RiArrowRightSLine />}
            </button>

            <NavLink to="/dashboard" className="sidebar-brand-link">
                <div className="sidebar-brand">
                    <img src={logoHuari} alt="Logo Huari" />

                    {isOpen && (
                        <div className="sidebar-brand-text">
                            <h2 className="text-h3-bold">Huari</h2>
                            <p className="text-p-small-regular">
                                Transparência &amp; Cidadania
                            </p>
                        </div>
                    )}
                </div>
            </NavLink>

            <NavLink to="/profile" className="sidebar-user-link">
                <div className="sidebar-user">
                    <RiUser3Fill className="sidebar-user-icon" />

                    {isOpen && (
                        <div className="sidebar-user-info">
                            <strong className="text-p-bold">{userName}</strong>
                            <span className="text-p-small-regular">
                                {userEmail}
                            </span>
                        </div>
                    )}
                </div>
            </NavLink>

            <div className="sidebar-divider" />

            <nav className="sidebar-navigation" aria-label="Navegação principal">
                {isOpen && (
                    <h3 className="sidebar-section-title text-p-bold">
                        Main
                    </h3>
                )}

                {menuItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                        key={label}
                        to={path}
                        className={({ isActive }) =>
                            `sidebar-item ${isActive ? 'is-active' : ''}`
                        }
                        title={!isOpen ? label : undefined}
                    >
                        <Icon className="sidebar-item-icon" />
                        {isOpen && <span className="text-p-regular">{label}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `sidebar-item ${isActive ? 'is-active' : ''}`
                    }
                    title={!isOpen ? 'Configurações' : undefined}
                >
                    <RiSettings3Line className="sidebar-item-icon" />
                    {isOpen && <span className="text-p-regular">Config</span>}
                </NavLink>

                <button
                    type="button"
                    className="sidebar-item"
                    onClick={handleLogout}
                    title={!isOpen ? 'Sair da conta' : undefined}
                >
                    <RiShutDownLine className="sidebar-item-icon" />
                    {isOpen && (
                        <span className="text-p-regular">Logout account</span>
                    )}
                </button>
            </div>
        </aside>
    );
}

SideBar.propTypes = {
    userName: PropTypes.string,
    userEmail: PropTypes.string,
};
