import React from 'react';
import { NavLink } from 'react-router-dom';
import logoHuari from '../../assets/images/logoHuari.svg';
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
    { label: 'Strategic Dashboard', path: '/dashboard' },
    { label: 'Civic Academy & Courses', path: '/learn' },
    { label: 'Lawmakers & Spending', path: '/lawmakers' },
    { label: 'Virtual Civic AI Assistant', path: '/chat' },
];

const OFFICIAL_SOURCES = [
    {
        label: 'Open Data — Chamber of Deputies',
        href: 'https://dadosabertos.camara.leg.br/',
    },
    {
        label: 'Transparency Portal — Federal Senate',
        href: 'https://www12.senado.leg.br/transparencia',
    },
    {
        label: 'Federal Court of Accounts (TCU)',
        href: 'https://www.tcu.gov.br/',
    },
    {
        label: 'Office of the Comptroller General (CGU)',
        href: 'https://www.gov.br/cgu/pt-br',
    },
];

const TRANSPARENCY_LINKS = [
    {
        label: 'Terms & Methodology',
        href: '#terms',
        Icon: RiHammerLine,
    },
    {
        label: 'Privacy & Data Protection',
        href: '#privacy',
        Icon: RiShieldCheckLine,
    },
    {
        label: 'Public API & Open Source',
        href: '#api',
        Icon: RiCodeBoxLine,
    },
    {
        label: 'Ombudsman & Whistleblowing',
        href: '#ombudsman',
        Icon: RiMailLine,
    },
];

export default function Footer() {
    return (
        <footer className="footer" aria-label="Site Footer">
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
                        Independent civic platform dedicated to transforming public
                        administration open data into accessible intelligence for civil society.
                    </p>

                    <nav
                        className="footer-social"
                        aria-label="Social media links"
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
                        <a href="mailto:contact@huari.org" aria-label="Email">
                            <RiMailLine size={22} />
                        </a>
                        <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">
                            <XIcon size={22} />
                        </a>
                    </nav>
                </section>

                <section className="footer-column">
                    <h3 className="footer-column-heading">Navigation</h3>

                    <ul className="footer-nav-list">
                        {NAVIGATION_LINKS.map(({ label, path }) => (
                            <li key={label}>
                                <NavLink to={path} className="footer-nav-link">
                                    <RiArrowRightSLine className="footer-navigation-icon" size={18} />
                                    <span>{label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="footer-column">
                    <h3 className="footer-column-heading">Official Sources</h3>

                    <ul className="footer-nav-list">
                        {OFFICIAL_SOURCES.map(({ label, href }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="footer-nav-link"
                                >
                                    <RiLink className="footer-link-icon" size={17} />
                                    <span>{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="footer-column">
                    <h3 className="footer-column-heading">Transparency &amp; Ethics</h3>

                    <ul className="footer-nav-list">
                        {TRANSPARENCY_LINKS.map(({ label, href, Icon }) => (
                            <li key={label}>
                                <a href={href} className="footer-nav-link">
                                    <Icon className="footer-transparency-icon" size={17} />
                                    <span>{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Huari — Civic Intelligence &amp; Political Transparency. All rights reserved.</p>
            </div>
        </footer>
    );
}
