import React, { useState } from 'react';
import {
    RiHome4Line,
    RiGovernmentLine,
    RiBookOpenLine,
    RiChatSmile3Line,
    RiGroupLine,
    RiMoneyDollarCircleLine,
    RiCalendarCheckLine,
    RiFileTextLine,
    RiArrowRightUpLine,
    RiUser3Line,
    RiLogoutBoxRLine,
    RiTrendingUpLine,
    RiShieldCheckLine
} from 'react-icons/ri';
import './style.css';

export default function Dashboard({
    user = {
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@huari.org',
        avatar: null
    },
    onNavigate
}) {
    const [activeMenu, setActiveMenu] = useState('Home');

    const navigationItems = [
        { label: 'Home', icon: RiHome4Line },
        { label: 'Lawmakers', icon: RiGovernmentLine },
        { label: 'Learn', icon: RiBookOpenLine },
        { label: 'Chat Huari', icon: RiChatSmile3Line, badge: 'IA' },
    ];

    const statisticsCards = [
        {
            id: 'monitored-lawmakers',
            title: 'Parlamentares Monitorados',
            value: '594',
            footer: '513 Deputados • 81 Senadores',
            icon: RiGroupLine,
            trend: '+100% ativos',
            highlightColor: 'orange'
        },
        {
            id: 'total-expenses',
            title: 'Gastos Totais',
            value: 'R$ 29,2M',
            footer: 'Média de R$ 49,1 mil por parlamentar',
            icon: RiMoneyDollarCircleLine,
            trend: '-2.4% vs mês anterior',
            highlightColor: 'red'
        },
        {
            id: 'average-attendance',
            title: 'Presença Média',
            value: '88,4%',
            footer: 'Sessões deliberativas no plenário',
            icon: RiCalendarCheckLine,
            trend: '+1.8% de assiduidade',
            highlightColor: 'green'
        },
        {
            id: 'bills-proposed',
            title: 'Projetos de Lei',
            value: '1.240',
            footer: 'Proposições protocoladas este ano',
            icon: RiFileTextLine,
            trend: '84 aprovados em comissões',
            highlightColor: 'blue'
        }
    ];

    const handleMenuClick = (itemLabel) => {
        setActiveMenu(itemLabel);
        if (onNavigate) {
            onNavigate(itemLabel);
        }
    };

    return (
        <div className="huari-dashboard-container">
            {/* Sidebar Fixa à Esquerda */}
            <aside className="huari-sidebar" aria-label="Navegação Principal">
                <div className="sidebar-top">
                    {/* Logótipo Huari */}
                    <div className="huari-logo-container">
                        <div className="logo-badge">
                            <RiShieldCheckLine size={24} />
                        </div>
                        <div className="logo-text">
                            <span className="logo-brand">HUARI</span>
                            <span className="logo-tag">Transparência Pública</span>
                        </div>
                    </div>

                    {/* Perfil do Utilizador */}
                    <div className="sidebar-user-card">
                        <div className="user-avatar">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} />
                            ) : (
                                <RiUser3Line size={20} />
                            )}
                        </div>
                        <div className="user-details">
                            <p className="user-name" title={user.name}>{user.name}</p>
                            <p className="user-email" title={user.email}>{user.email}</p>
                        </div>
                    </div>

                    {/* Menu de Navegação */}
                    <nav className="sidebar-nav">
                        <span className="nav-section-title">Menu Principal</span>
                        <ul className="nav-list">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeMenu === item.label;

                                return (
                                    <li key={item.label}>
                                        <button
                                            type="button"
                                            className={`nav-button ${isActive ? 'active' : ''}`}
                                            onClick={() => handleMenuClick(item.label)}
                                        >
                                            <Icon className="nav-icon" size={20} />
                                            <span className="nav-label">{item.label}</span>
                                            {item.badge && (
                                                <span className="nav-badge">{item.badge}</span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>

                <div className="sidebar-bottom">
                    <button type="button" className="sidebar-logout-button">
                        <RiLogoutBoxRLine size={18} />
                        <span>Terminar Sessão</span>
                    </button>
                </div>
            </aside>

            {/* Conteúdo Principal à Direita */}
            <main className="huari-main-content">
                {/* Cabeçalho Laranja Escuro */}
                <header className="dashboard-header">
                    <div className="header-text-block">
                        <span className="header-chip">Painel Estratégico</span>
                        <h1 className="header-title">Transparência Política Huari</h1>
                        <p className="header-subtitle">
                            Monitore a atividade parlamentar, gastos públicos e iniciativas legislativas 
                            com dados abertos e inteligência analítica em tempo real.
                        </p>
                    </div>

                    {/* Botões de Ação */}
                    <div className="header-actions">
                        <button
                            type="button"
                            className="btn-action btn-action-primary"
                            onClick={() => handleMenuClick('Lawmakers')}
                        >
                            <span>View Parliamentarians</span>
                            <RiArrowRightUpLine size={18} />
                        </button>

                        <button
                            type="button"
                            className="btn-action btn-action-secondary"
                            onClick={() => handleMenuClick('Learn')}
                        >
                            <span>Exploit Learn</span>
                            <RiBookOpenLine size={18} />
                        </button>

                        <button
                            type="button"
                            className="btn-action btn-action-accent"
                            onClick={() => handleMenuClick('Chat Huari')}
                        >
                            <RiChatSmile3Line size={18} />
                            <span>Speak with Huari</span>
                        </button>
                    </div>
                </header>

                {/* Seção das Estatísticas */}
                <section className="stats-section" aria-label="Estatísticas Principais">
                    <div className="stats-section-header">
                        <h2>Indicadores Gerais do Congresso</h2>
                        <span className="stats-update-time">Dados atualizados hoje</span>
                    </div>

                    <div className="stats-grid">
                        {statisticsCards.map((card) => {
                            const CardIcon = card.icon;

                            return (
                                <article key={card.id} className="stat-card">
                                    <div className="stat-card-top">
                                        <span className="stat-card-title">{card.title}</span>
                                        <div className={`stat-icon-wrapper ${card.highlightColor}`}>
                                            <CardIcon size={22} />
                                        </div>
                                    </div>

                                    <div className="stat-card-body">
                                        <div className="stat-card-value">{card.value}</div>
                                        <div className="stat-card-trend">
                                            <RiTrendingUpLine size={14} />
                                            <span>{card.trend}</span>
                                        </div>
                                    </div>

                                    <footer className="stat-card-footer">
                                        <p>{card.footer}</p>
                                    </footer>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}

