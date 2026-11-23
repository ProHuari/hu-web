import React from 'react';
import PropTypes from 'prop-types';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import logoHuari from '../../assets/images/logo-huari.svg';
import './style.css';

export default function WebsiteInformation({ backgroundImage }) {
    return (
        <section
            className="hero"
            style={{
                backgroundImage: `
                    linear-gradient(
                        rgba(0, 0, 0, 0.58),
                        rgba(0, 0, 0, 0.58)
                    ),
                    url(${backgroundImage})
                `,
            }}
        >
            <header className="hero-header">
                <div className="brand">
                    <img src={logoHuari} alt="Huari Logo" decoding="async" />

                    <div className="brand-info">
                        <h2 className="text-h2-bold">Huari</h2>
                        <p className="text-p-regular">
                            Transparência &amp; Cidadania
                        </p>
                    </div>
                </div>
            </header>

            <main className="hero-content">
                <div className="hero-badge">
                    <RiShieldKeyholeLine aria-hidden="true" size={16} />
                    <p className="text-p-small-bold">
                        Controle social com dados abertos
                    </p>
                </div>

                <h1 className="text-h1-bold">
                    Acompanhe mandatos e contas públicas sem juridiquês.
                </h1>

                <p className="text-p-regular">
                    Consulte reembolsos da Cota Parlamentar, projetos de lei em tramitação e cursos práticos sobre como o orçamento público funciona.
                </p>
            </main>

            <footer
                className="hero-footer"
                aria-label="Estrutura do Congresso Nacional"
            >
                <div className="stat-item">
                    <h2 className="text-h2-bold">513</h2>
                    <p className="text-p-small-regular">
                        Deputados federais
                    </p>
                </div>

                <div className="stat-item stat-item--featured">
                    <h2 className="text-h2-bold">81</h2>
                    <p className="text-p-small-regular">
                        Senadores
                    </p>
                </div>

                <div className="stat-item">
                    <h2 className="text-h2-bold">27</h2>
                    <p className="text-p-small-regular">
                        Unidades federativas
                    </p>
                </div>
            </footer>
        </section>
    );
}

WebsiteInformation.propTypes = {
    backgroundImage: PropTypes.string.isRequired,
};
