
import './style.css';

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

const navigationLinks = [
    { label: 'Painel Inicial', href: '#home' },
    { label: 'Academia Cívica e Cursos', href: '#cursos' },
    { label: 'Gastos e Cotas Parlamentares', href: '#parlamentares' },
    { label: 'Assistência Cívica Virtual', href: '#chat' },
];

const officialSources = [
    {
        label: 'Dados Abertos - Câmara dos Deputados',
        href: 'https://dadosabertos.camara.leg.br/',
    },
    {
        label: 'Portal da Transparência - Senado Federal',
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

const transparencyLinks = [
    {
        label: 'Termos e Metodologia',
        href: '#termos',
        Icon: RiHammerLine,
    },
    {
        label: 'Privacidade e Proteção de Dados',
        href: '#privacidade',
        Icon: RiShieldCheckLine,
    },
    {
        label: 'API Pública e Código Aberto',
        href: '#api',
        Icon: RiCodeBoxLine,
    },
    {
        label: 'Ouvidoria e Denúncias',
        href: '#ouvidoria',
        Icon: RiMailLine,
    },
];

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <section className="footer-brand">
                    <div className="footer-logo">
                        <img src={logoHuari} alt="Logo Huari" />
                        <h2 className="text-h3-bold">Huari</h2>
                    </div>

                    <p className="footer-description text-p-regular">
                        Plataforma cívica independente dedicada a
                        transformar dados abertos da administração
                        pública em inteligência acessível para toda
                        a sociedade civil.
                    </p>

                    <nav
                        className="footer-social"
                        aria-label="Redes sociais"
                    >
                        <a href="https://github.com/" aria-label="GitHub">
                            <GithubIcon size={24} />
                        </a>
                        <a href="https://www.instagram.com/" aria-label="Instagram">
                            <InstagramIcon size={24} />
                        </a>
                        <a href="https://www.linkedin.com/" aria-label="LinkedIn">
                            <LinkedinIcon size={24} />
                        </a>
                        <a href="mailto:contato@huari.com.br" aria-label="E-mail">
                            <RiMailLine />
                        </a>
                        <a href="https://x.com/" aria-label="X">
                            <XIcon size={24} />
                        </a>
                    </nav>
                </section>

                <section className="footer-column">
                    <h3 className="text-p-bold">Navegação</h3>

                    <ul>
                        {navigationLinks.map(({ label, href }) => (
                            <li key={label}>
                                <a href={href}>
                                    <RiArrowRightSLine className="footer-navigation-icon" />
                                    <span>{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="footer-column">
                    <h3 className="text-p-bold">Fontes Oficiais</h3>

                    <ul>
                        {officialSources.map(({ label, href }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <RiLink className="footer-link-icon" />
                                    <span>{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="footer-column">
                    <h3 className="text-p-bold">Transparência e Ética</h3>

                    <ul>
                        {transparencyLinks.map(({ label, href, Icon }) => (
                            <li key={label}>
                                <a href={href}>
                                    <Icon className="footer-transparency-icon" />
                                    <span>{label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            <div className="footer-bottom">
                <p>© 2026 AI Platform. All rights reserved.</p>
            </div>
        </footer>
    );
}
