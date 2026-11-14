import React from 'react';
import PropTypes from 'prop-types';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import logoHuari from '../../assets/images/logoHuari.svg';
import './style.css';

export default function WebsiteInformation({ backgroundImage }) {
    return (
        <section
            className="hero"
            style={{
                backgroundImage: `
                    linear-gradient(
                        rgba(0, 0, 0, 0.55),
                        rgba(0, 0, 0, 0.55)
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
                            Civic Intelligence
                        </p>
                    </div>
                </div>

                <div className="trust-indicators">
                    <div className="trust-indicator">
                        <span
                            className="status-indicator"
                            aria-hidden="true"
                        />
                        <p className="text-p-small-regular">
                            Official Open Data
                        </p>
                    </div>

                    <div className="trust-indicator">
                        <span
                            className="status-indicator"
                            aria-hidden="true"
                        />
                        <p className="text-p-small-regular">
                            Real-Time Auditing
                        </p>
                    </div>
                </div>
            </header>

            <main className="hero-content">
                <div className="hero-badge">
                    <RiShieldKeyholeLine
                        aria-hidden="true"
                        size={16}
                    />

                    <p className="text-p-small-bold">
                        Open-Source Democracy
                    </p>
                </div>

                <h1 className="text-h1-bold">
                    Political transparency, oversight, and active citizenship.
                </h1>

                <p className="text-p-regular">
                    Track public spending in real time, audit parliamentary contracts,
                    and understand government decisions with open, accessible data.
                </p>
            </main>

            <footer
                className="hero-footer"
                aria-label="Platform Key Metrics"
            >
                <div className="stat-item">
                    <h2 className="text-h2-bold">R$ 4.2B</h2>
                    <p className="text-p-small-regular">
                        Monitored spending
                    </p>
                </div>

                <div className="stat-item stat-item--featured">
                    <h2 className="text-h2-bold">594</h2>
                    <p className="text-p-small-regular">
                        Monitored lawmakers
                    </p>
                </div>

                <div className="stat-item">
                    <h2 className="text-h2-bold">27</h2>
                    <p className="text-p-small-regular">
                        States covered
                    </p>
                </div>
            </footer>
        </section>
    );
}

WebsiteInformation.propTypes = {
    backgroundImage: PropTypes.string,
};
