
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
} from 'react-icons/ri';

const menuItems = [
    { label: 'Home', icon: RiHome4Fill },
    { label: 'Lawmakers', icon: RiTeamFill },
    { label: 'Learn', icon: RiBookOpenLine },
    { label: 'Chat Huari', icon: RiMessage2Line },
];

export default function HeaderOpen({
    activeItem = 'Home',
    onNavigate,
    onLogout,
    onSettings,
}) {
    return (
        <aside className="header-open">
            <div className="header-open-brand">
                <img src={logoHuari} alt="Huari" />

                <div className="header-open-brand-text">
                    <h2 className="text-h2-bold">Huari</h2>
                    <p className="text-p-small-regular">
                        Transparência &amp; Cidadania
                    </p>
                </div>
            </div>

            <div className="header-open-user">
                <RiUser3Fill className="header-open-user-icon" />

                <div className="header-open-user-info">
                    <strong className="text-p-bold">
                        UsuarioHuari
                    </strong>
                    <span className="text-p-small-regular">
                        UsuarioHuari@gmail.com
                    </span>
                </div>
            </div>

            <div className="header-open-divider" />

            <nav className="header-open-navigation">
                <h3 className="text-p-bold">Main</h3>

                {menuItems.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        type="button"
                        className={`header-open-item ${
                            activeItem === label ? 'is-active' : ''
                        }`}
                        onClick={() => onNavigate?.(label)}
                    >
                        <Icon className="header-open-item-icon" />
                        <span className="text-p-regular">{label}</span>
                    </button>
                ))}
            </nav>

            <div className="header-open-bottom">
                <button
                    type="button"
                    className="header-open-item"
                    onClick={onSettings}
                >
                    <RiSettings3Line className="header-open-item-icon" />
                    <span className="text-p-regular">Config</span>
                </button>

                <button
                    type="button"
                    className="header-open-item"
                    onClick={onLogout}
                >
                    <RiShutDownLine className="header-open-item-icon" />
                    <span className="text-p-regular">
                        Logout account
                    </span>
                </button>
            </div>
        </aside>
    );
}
