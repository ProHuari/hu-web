import React from 'react';
import PropTypes from 'prop-types';
import {
    RiAlertLine,
    RiRefreshLine,
    RiHome4Line,
    RiArrowDownSLine,
    RiArrowUpSLine,
} from 'react-icons/ri';
import './style.css';

/**
 * HuariErrorBoundary - Global Application Error Boundary
 * Catches unhandled JavaScript runtime exceptions in child component tree,
 * preventing full white screens and providing a branded, accessible recovery flow.
 */
export class HuariErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error('HuariErrorBoundary caught an unhandled runtime error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
        });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    handleGoHome = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
        });
        window.location.href = '/dashboard';
    };

    toggleDetails = () => {
        this.setState((prev) => ({ showDetails: !prev.showDetails }));
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return typeof this.props.fallback === 'function'
                    ? this.props.fallback({
                          error: this.state.error,
                          resetErrorBoundary: this.handleReset,
                      })
                    : this.props.fallback;
            }

            const isDev = Boolean(import.meta.env.DEV);

            return (
                <div className="huari-error-boundary-container" role="alert" aria-live="assertive">
                    <div className="huari-error-boundary-card">
                        <div className="huari-error-icon-wrapper" aria-hidden="true">
                            <RiAlertLine size={36} />
                        </div>

                        <span className="huari-error-kicker">
                            Sistema Cívico • Recuperação de Sessão
                        </span>

                        <h1 className="huari-error-title">Algo inesperado aconteceu</h1>

                        <p className="huari-error-description">
                            Não foi possível renderizar esta visualização da plataforma. O incidente foi registrado para diagnóstico e você pode tentar recarregar com segurança.
                        </p>

                        <div className="huari-error-actions">
                            <button
                                type="button"
                                className="huari-error-btn huari-error-btn--primary"
                                onClick={this.handleReset}
                            >
                                <RiRefreshLine size={18} aria-hidden="true" />
                                <span>Tentar novamente</span>
                            </button>

                            <button
                                type="button"
                                className="huari-error-btn huari-error-btn--secondary"
                                onClick={this.handleGoHome}
                            >
                                <RiHome4Line size={18} aria-hidden="true" />
                                <span>Retornar ao Dashboard</span>
                            </button>
                        </div>

                        {/* Detalhes Técnicos para Ambiente de Desenvolvimento */}
                        {isDev && (
                            <div className="huari-error-dev-details">
                                <button
                                    type="button"
                                    className="huari-error-details-summary"
                                    onClick={this.toggleDetails}
                                    aria-expanded={this.state.showDetails}
                                >
                                    <span>Diagnóstico Técnico (Modo DEV)</span>
                                    {this.state.showDetails ? (
                                        <RiArrowUpSLine size={18} aria-hidden="true" />
                                    ) : (
                                        <RiArrowDownSLine size={18} aria-hidden="true" />
                                    )}
                                </button>

                                {this.state.showDetails && (
                                    <div className="huari-error-trace-box">
                                        <div className="huari-error-trace-name">
                                            {this.state.error?.name || 'Error'}: {this.state.error?.message}
                                        </div>
                                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                            {this.state.error?.stack || 'No stack trace available.'}
                                        </pre>
                                        {this.state.errorInfo?.componentStack && (
                                            <div style={{ marginTop: '0.85rem', color: '#94a3b8' }}>
                                                <strong>Component Stack:</strong>
                                                <pre style={{ margin: '0.35rem 0 0', whiteSpace: 'pre-wrap' }}>
                                                    {this.state.errorInfo.componentStack}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

HuariErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    onReset: PropTypes.func,
};

export default HuariErrorBoundary;
