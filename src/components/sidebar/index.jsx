import { useState } from 'react';
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
    { label: 'Home', icon: RiHome4Fill },
    { label: 'Lawmakers', icon: RiTeamFill },
    { label: 'Learn', icon: RiBookOpenLine },
    { label: 'Chat Huari', icon: RiMessage2Line },
];

export default function SideBar({
    activeItem = 'Home',
    userName = 'UsuarioHuari',
    userEmail = 'UsuarioHuari@gmail.com',
    onNavigate,
    onLogout,
    onSettings,
}) {
    const [isOpen, setIsOpen] = useState(true);

    const handleNavigate = (label) => {
        onNavigate?.(label);
    };

    return (
        <aside
            className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
        >
            <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setIsOpen((previousState) => !previousState)}
                aria-label={isOpen ? 'Recolher menu lateral' : 'Expandir menu lateral'}
                aria-expanded={isOpen}
            >
                {isOpen ? <RiArrowLeftSLine /> : <RiArrowRightSLine />}
            </button>

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

            <div className="sidebar-divider" />

            <nav className="sidebar-navigation" aria-label="Navegação principal">
                {isOpen && (
                    <h3 className="sidebar-section-title text-p-bold">
                        Main
                    </h3>
                )}

                {menuItems.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        type="button"
                        className={`sidebar-item ${
                            activeItem === label ? 'is-active' : ''
                        }`}
                        onClick={() => handleNavigate(label)}
                        aria-current={activeItem === label ? 'page' : undefined}
                        title={!isOpen ? label : undefined}
                    >
                        <Icon className="sidebar-item-icon" />

                        {isOpen && (
                            <span className="text-p-regular">{label}</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button
                    type="button"
                    className="sidebar-item"
                    onClick={onSettings}
                    title={!isOpen ? 'Configurações' : undefined}
                >
                    <RiSettings3Line className="sidebar-item-icon" />

                    {isOpen && (
                        <span className="text-p-regular">Config</span>
                    )}
                </button>

                <button
                    type="button"
                    className="sidebar-item"
                    onClick={onLogout}
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