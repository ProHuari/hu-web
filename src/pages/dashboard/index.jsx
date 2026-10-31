import React, { useState } from 'react';
import logoHuari from '../../assets/images/logoHuari.svg';
import {
    GithubIcon,
    LinkedinIcon,
    XIcon,
    InstagramIcon,
} from '../../components/icons';
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
    RiUser3Fill,
    RiTrendingUpLine,
    RiSettings3Line,
    RiShutDownLine,
    RiBookmarkLine,
    RiBookmarkFill,
    RiMapPinLine,
    RiGraduationCapFill,
    RiArrowRightLine,
    RiArrowRightSLine,
    RiLink,
    RiHammerLine,
    RiShieldCheckLine,
    RiCodeBoxLine,
    RiMailLine,
} from 'react-icons/ri';
import './style.css';

const initialParliamentarians = [
    {
        id: 1,
        name: 'Parlamentar',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'SP',
        attendance: '96%',
        projects: '42',
        expenses: 'R$ 31,8 mil',
    },
    {
        id: 2,
        name: 'Parlamentar',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'SP',
        attendance: '92%',
        projects: '38',
        expenses: 'R$ 27,4 mil',
    },
    {
        id: 3,
        name: 'Parlamentar',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'SP',
        attendance: '89%',
        projects: '31',
        expenses: 'R$ 29,1 mil',
    },
    {
        id: 4,
        name: 'Parlamentar',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'SP',
        attendance: '94%',
        projects: '27',
        expenses: 'R$ 33,2 mil',
    },
];

const footerNavigationLinks = [
    { label: 'Painel Inicial', href: '#home', targetPage: 'Home' },
    { label: 'Academia Cívica e Cursos', href: '#cursos', targetPage: 'Learn' },
    { label: 'Gastos e Cotas Parlamentares', href: '#parlamentares', targetPage: 'Lawmakers' },
    { label: 'Assistência Cívica Virtual', href: '#chat', targetPage: 'Chat Huari' },
];

const officialSources = [
    {
        label: 'Dados Abertos / Câmara',
        href: 'https://dadosabertos.camara.leg.br/',
    },
    {
        label: 'Portal da Transparência',
        href: 'https://www12.senado.leg.br/transparencia',
    },
    {
        label: 'TCU (Tribunal de Contas da União)',
        href: 'https://www.tcu.gov.br/',
    },
    {
        label: 'CGU (Controladoria-Geral da União)',
        href: 'https://www.gov.br/cgu/pt-br',
    },
];

const transparencyLinks = [
    {
        label: 'Termos e Metodologia',
        href: '#termos',
        Icon: RiHammerLine,
    },
    {
        label: 'Privacidade',
        href: '#privacidade',
        Icon: RiShieldCheckLine,
    },
    {
        label: 'API Pública',
        href: '#api',
        Icon: RiCodeBoxLine,
    },
    {
        label: 'Ouvidoria',
        href: '#ouvidoria',
        Icon: RiMailLine,
    },
];

export default function Dashboard({
    user = {
        name: 'Carlos Oliveira',
        email: 'carlos.oliveira@huari.org',
        avatar: null,
    },
    onNavigate,
    onViewParliamentarian,
    onLogout,
}) {
    const [activeMenu, setActiveMenu] = useState('Home');
    const [favorites, setFavorites] = useState({});

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
            highlightColor: 'orange',
        },
        {
            id: 'total-expenses',
            title: 'Gastos Totais',
            value: 'R$ 29,2M',
            footer: 'Média de R$ 49,1 mil por parlamentar',
            icon: RiMoneyDollarCircleLine,
            trend: '-2.4% vs mês anterior',
            highlightColor: 'red',
        },
        {
            id: 'average-attendance',
            title: 'Presença Média',
            value: '88,4%',
            footer: 'Sessões deliberativas no plenário',
            icon: RiCalendarCheckLine,
            trend: '+1.8% de assiduidade',
            highlightColor: 'green',
        },
        {
            id: 'bills-proposed',
            title: 'Projetos de Lei',
            value: '1.240',
            footer: 'Proposições protocoladas este ano',
            icon: RiFileTextLine,
            trend: '84 aprovados em comissões',
            highlightColor: 'blue',
        },
    ];

    const handleMenuClick = (itemLabel) => {
        setActiveMenu(itemLabel);
        if (onNavigate) {
            onNavigate(itemLabel);
        }
    };

    const toggleFavorite = (id) => {
        setFavorites((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="huari-dashboard-container">
            {/* Sidebar Fixa à Esquerda */}
            <aside className="huari-sidebar" aria-label="Navegação Principal">
                <div className="sidebar-top">
                    {/* Logótipo Huari */}
                    <div className="huari-logo-container">
                        <img
                            src={logoHuari}
                            alt="Logo Huari"
                            className="huari-logo-img"
                        />
                        <div className="logo-text">
                            <span className="logo-brand">HUARI</span>
                            <span className="logo-tag">Transparência &amp; Cidadania</span>
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
                            <p className="user-name" title={user.name}>
                                {user.name}
                            </p>
                            <p className="user-email" title={user.email}>
                                {user.email}
                            </p>
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

                {/* Ações inferiores da Sidebar: Config e Logout account */}
                <div className="sidebar-bottom">
                    <button
                        type="button"
                        className="sidebar-bottom-button"
                        onClick={() => handleMenuClick('Config')}
                    >
                        <RiSettings3Line size={20} />
                        <span>Config</span>
                    </button>

                    <button
                        type="button"
                        className="sidebar-bottom-button sidebar-logout-button"
                        onClick={() => {
                            if (onLogout) {
                                onLogout();
                            } else {
                                handleMenuClick('Logout');
                            }
                        }}
                    >
                        <RiShutDownLine size={20} />
                        <span>Logout account</span>
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

                {/* Grelha de Parlamentares 2x2 */}
                <section className="lawmakers-section" aria-label="Grelha de Parlamentares">
                    <div className="section-title-bar">
                        <h2>Parlamentares em Destaque</h2>
                        <button
                            type="button"
                            className="view-all-link"
                            onClick={() => handleMenuClick('Lawmakers')}
                        >
                            Ver todos os parlamentares
                            <RiArrowRightLine size={16} />
                        </button>
                    </div>

                    <div className="lawmakers-grid-2x2">
                        {initialParliamentarians.map((lawmaker) => {
                            const isFav = !!favorites[lawmaker.id];

                            return (
                                <article key={lawmaker.id} className="lawmaker-card">
                                    <div className="lawmaker-card-top">
                                        <div className="lawmaker-avatar-circle" aria-hidden="true">
                                            <RiUser3Fill size={28} />
                                        </div>

                                        <button
                                            type="button"
                                            className={`lawmaker-bookmark-btn ${isFav ? 'is-favorite' : ''}`}
                                            aria-label={
                                                isFav
                                                    ? `Remover ${lawmaker.name} dos favoritos`
                                                    : `Adicionar ${lawmaker.name} aos favoritos`
                                            }
                                            aria-pressed={isFav}
                                            onClick={() => toggleFavorite(lawmaker.id)}
                                        >
                                            {isFav ? (
                                                <RiBookmarkFill size={22} />
                                            ) : (
                                                <RiBookmarkLine size={22} />
                                            )}
                                        </button>
                                    </div>

                                    <div className="lawmaker-info">
                                        <h3 className="lawmaker-name">{lawmaker.name}</h3>
                                        <p className="lawmaker-role">{lawmaker.position}</p>
                                    </div>

                                    <div className="lawmaker-badges">
                                        <span className="badge-party">{lawmaker.party}</span>
                                        <span className="badge-state">
                                            <RiMapPinLine size={14} />
                                            {lawmaker.state}
                                        </span>
                                    </div>

                                    <div className="lawmaker-metrics-box">
                                        <div className="lawmaker-metric">
                                            <span className="metric-label">Presença</span>
                                            <strong className="metric-val">{lawmaker.attendance}</strong>
                                        </div>
                                        <div className="lawmaker-metric">
                                            <span className="metric-label">Projetos</span>
                                            <strong className="metric-val">{lawmaker.projects}</strong>
                                        </div>
                                        <div className="lawmaker-metric">
                                            <span className="metric-label">Gastos</span>
                                            <strong className="metric-val">{lawmaker.expenses}</strong>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="lawmaker-view-btn"
                                        onClick={() => {
                                            if (onViewParliamentarian) {
                                                onViewParliamentarian(lawmaker);
                                            } else {
                                                handleMenuClick('Lawmakers');
                                            }
                                        }}
                                    >
                                        Ver Deputado
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Banner Educativo */}
                <section className="educational-banner-wrapper" aria-label="Portal Educativo">
                    <div className="huari-educational-banner">
                        <div className="edu-banner-icon">
                            <RiGraduationCapFill size={34} />
                        </div>

                        <h2 className="edu-banner-title">
                            Quer entender melhor como política funciona?
                        </h2>

                        <p className="edu-banner-text">
                            Acesse nosso portal educativo com conteúdos didáticos, infográficos e
                            trilhas estruturadas sobre o funcionamento do sistema político brasileiro.
                        </p>

                        <button
                            type="button"
                            className="edu-banner-btn"
                            onClick={() => handleMenuClick('Learn')}
                        >
                            <span>Acessa Aulas</span>
                            <RiArrowRightLine size={20} />
                        </button>
                    </div>
                </section>

                {/* Rodapé Completo (Footer) */}
                <footer className="huari-footer">
                    <div className="huari-footer-grid">
                        {/* Coluna 1: Sobre */}
                        <div className="footer-col footer-col-about">
                            <div className="footer-brand-header">
                                <img src={logoHuari} alt="Logo Huari" className="footer-logo-img" />
                                <span className="footer-brand-name">Huari</span>
                            </div>

                            <p className="footer-about-text">
                                Plataforma cívica independente dedicada a transformar dados abertos
                                da administração pública em inteligência acessível para toda a
                                sociedade civil.
                            </p>

                            <div className="footer-social-list" aria-label="Redes Sociais">
                                <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
                                    <GithubIcon size={22} />
                                </a>
                                <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                                    <InstagramIcon size={22} />
                                </a>
                                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                    <LinkedinIcon size={22} />
                                </a>
                                <a href="mailto:contato@huari.com.br" aria-label="E-mail">
                                    <RiMailLine size={22} />
                                </a>
                                <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">
                                    <XIcon size={22} />
                                </a>
                            </div>
                        </div>

                        {/* Coluna 2: Navegação */}
                        <div className="footer-col">
                            <h3 className="footer-col-title">Navegação</h3>
                            <ul className="footer-link-list">
                                {footerNavigationLinks.map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleMenuClick(item.targetPage);
                                            }}
                                        >
                                            <RiArrowRightSLine className="footer-icon-arrow" size={18} />
                                            <span>{item.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Coluna 3: Fontes Oficiais */}
                        <div className="footer-col">
                            <h3 className="footer-col-title">Fontes Oficiais</h3>
                            <ul className="footer-link-list">
                                {officialSources.map((source) => (
                                    <li key={source.label}>
                                        <a href={source.href} target="_blank" rel="noreferrer">
                                            <RiLink className="footer-icon-link" size={17} />
                                            <span>{source.label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Coluna 4: Transparência e Ética */}
                        <div className="footer-col">
                            <h3 className="footer-col-title">Transparência e Ética</h3>
                            <ul className="footer-link-list">
                                {transparencyLinks.map(({ label, href, Icon }) => (
                                    <li key={label}>
                                        <a href={href}>
                                            <Icon className="footer-icon-ethics" size={17} />
                                            <span>{label}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="huari-footer-copyright">
                        <p>© 2026 Huari — Plataforma de Transparência Política. Todos os direitos reservados.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
