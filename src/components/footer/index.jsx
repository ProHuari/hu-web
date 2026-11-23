import React from 'react';
import { NavLink } from 'react-router-dom';
import logoHuari from '../../assets/images/logo-huari.svg';
import {
    GithubIcon,
    LinkedinIcon,
    XIcon,
    InstagramIcon,
} from '../icons';
import {
    RiArrowRightSLine,
    RiLink,
    RiHammerLine,
    RiShieldCheckLine,
    RiCodeBoxLine,
    RiMailLine,
} from 'react-icons/ri';
import './style.css';

const NAVIGATION_LINKS = [
    { label: 'Início', path: '/dashboard' },
    { label: 'Parlamentares e Gastos', path: '/lawmakers' },
    { label: 'Trilhas de Ensino', path: '/learn' },
    { label: 'Assistente Huari IA', path: '/chat' },
];

const OFFICIAL_SOURCES = [
    {
        label: 'Dados Abertos — Câmara dos Deputados',
        href: 'https://dadosabertos.camara.leg.br/',
    },
    {
        label: 'Portal da Transparência — Senado Federal',
        href: 'https://www12.senado.leg.br/transparencia',
    },
    {
        label: 'Tribunal de Contas da União (TCU)',
        href: 'https://www.tcu.gov.br/',
    },
    {
        label: 'Controladoria-Geral da União (CGU)',
        href: 'https://www.gov.br/cgu/pt-br',
    },
];

const TRANSPARENCY_LINKS = [
    {
        label: 'Metodologia e Fontes',
        href: '#metodologia',
        Icon: RiHammerLine,
    },
    {
        label: 'Privacidade e LGPD',
        href: '#privacidade',
        Icon: RiShieldCheckLine,
    },
    {
        label: 'Documentação da API',
        href: '#api',
        Icon: RiCodeBoxLine,
    },
    {
        label: 'Fale com a equipe',
        href: 'mailto:contato@huari.org',
        Icon: RiMailLine,
    },
];

export default function Footer() {
    return (
        <footer className="footer" aria-label="Rodapé da plataforma">
            <div className="footer-content">
                <section className="footer-brand">
                    <NavLink to="/dashboard" className="footer-logo">
                        <img
                            src={logoHuari}
                            alt="Huari Logo"
                            loading="lazy"
                            decoding="async"
                        />
                        <h2 className="footer-logo-title">Huari</h2>
                    </NavLink>

                    <p className="footer-description">
                        Dados públicos da Câmara dos Deputados, Senado Federal e orçamento em linguagem direta para acompanhamento cidadão.
                    </p>

                    <nav
                        className="footer-social"
                        aria-label="Redes sociais"
                    >
                        <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
                            <GithubIcon size={22} />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <InstagramIcon size={22} />
                        </a>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <LinkedinIcon size={22} />
                        </a>
                        <a href="mailto:contato@huari.org" aria-label="E-mail">
                            <RiMailLine size={22} />
                        </a>
                        <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">
                            <XIcon size={22} />
                        </a>
                    </nav>
                </section>

                <section className="footer-column">
                    <h3 className="footer-column-heading">Navegação</h3>

                    <nav className="footer-nav-list" aria-label="Links do rodapé">
                        {NAVIGATION_LINKS.map(({ label, path }) => (
                            <div key={label} className="footer-nav-item">
                                <NavLink to={path} className="footer-nav-link">
                                    <RiArrowRightSLine className="footer-navigation-icon" size={18} />
                                    <span>{label}</span>
                                </NavLink>
                            </div>
                        ))}
                    </nav>
                </section>

                <section className="footer-column">
                    <h3 className="footer-column-heading">Fontes Oficiais</h3>

                    <nav className="footer-nav-list" aria-label="Fontes oficiais de dados abertos">
                        {OFFICIAL_SOURCES.map(({ label, href }) => (
                            <div key={label} className="footer-nav-item">
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="footer-nav-link"
                                >
                                    <RiLink className="footer-link-icon" size={17} />
                                    <span>{label}</span>
                                </a>
                            </div>
                        ))}
                    </nav>
                </section>

                <section className="footer-column">
                    <h3 className="footer-column-heading">Transparência</h3>

                    <nav className="footer-nav-list" aria-label="Documentação e contato">
                        {TRANSPARENCY_LINKS.map(({ label, href, Icon }) => (
                            <div key={label} className="footer-nav-item">
                                <a href={href} className="footer-nav-link">
                                    <Icon className="footer-transparency-icon" size={17} />
                                    <span>{label}</span>
                                </a>
                            </div>
                        ))}
                    </nav>
                </section>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Huari — Transparência Legislativa e Educação Cívica.</p>
            </div>
        </footer>
    );
}
