
import './style.css';

import {
    RiHome4Fill,
    RiTeamFill,
    RiBookOpenLine,
    RiMessage2Line,
    RiSettings3Line,
    RiShutDownLine,
    RiArrowRightSLine,
} from 'react-icons/ri';

const menuItems = [
    { label: 'Home', icon: RiHome4Fill },
    { label: 'Lawmakers', icon: RiTeamFill },
    { label: 'Learn', icon: RiBookOpenLine },
    { label: 'Chat Huari', icon: RiMessage2Line },
];

export default function HeaderClosed({
    activeItem = 'Home',
    onNavigate,
    onSettings,
    onLogout,
    onExpand,
}) {
    return (
        <aside className="header-closed">
            <button
                type="button"
                className="header-closed-expand"
                onClick={onExpand}
                aria-label="Expandir menu"
                title="Expandir menu"
            >
                <RiArrowRightSLine />
            </button>

            <div className="header-closed-user">
                <span className="header-closed-avatar">U</span>
            </div>

            <div className="header-closed-divider" />

            <nav className="header-closed-navigation" aria-label="Menu principal">
                <span className="text-p-bold">Main</span>

                {menuItems.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        type="button"
                        className={`header-closed-item ${
                            activeItem === label ? 'is-active' : ''
                        }`}
                        onClick={() => onNavigate?.(label)}
                        aria-label={label}
                        title={label}
                    >
                        <Icon />
                    </button>
                ))}
            </nav>

            <div className="header-closed-bottom">
                <button
                    type="button"
                    className="header-closed-item"
                    onClick={onSettings}
                    aria-label="Configurações"
                    title="Configurações"
                >
                    <RiSettings3Line />
                </button>

                <button
                    type="button"
                    className="header-closed-item"
                    onClick={onLogout}
                    aria-label="Sair da conta"
                    title="Sair da conta"
                >
                    <RiShutDownLine />
                </button>
            </div>
        </aside>
    );
}
