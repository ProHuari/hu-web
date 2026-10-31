import React, { useState } from "react";
import {
    RiUser3Fill,
    RiWallet3Line,
    RiBarChartBoxLine,
    RiMessage3Line,
    RiArrowLeftLine,
    RiMapPinLine,
    RiAddLine,
    RiCheckLine,
} from "react-icons/ri";

import SideBar from "../../components/sidebar";
import Footer from "../../components/footer";

import "./style.css";

const expensesByYear = {
    "Cota 2026": [
        {
            title: "Divulgação da Atividade",
            amount: "R$ 142.000 (37%)",
            percentage: 37,
            tone: "tone-dark",
        },
        {
            title: "Passagens e Hospedagem",
            amount: "R$ 98.400 (25%)",
            percentage: 25,
            tone: "tone-medium",
        },
        {
            title: "Locação de Veículos e Combustível",
            amount: "R$ 76.500 (20%)",
            percentage: 20,
            tone: "tone-light",
        },
    ],
    "Cota 2025": [
        {
            title: "Divulgação da Atividade",
            amount: "R$ 135.200 (35%)",
            percentage: 35,
            tone: "tone-dark",
        },
        {
            title: "Passagens e Hospedagem",
            amount: "R$ 94.100 (24%)",
            percentage: 24,
            tone: "tone-medium",
        },
        {
            title: "Locação de Veículos e Combustível",
            amount: "R$ 71.000 (18%)",
            percentage: 18,
            tone: "tone-light",
        },
    ],
};

const votes = [
    {
        title: "Reforma Tributária sobre o Consumo",
        description:
            "Aprovou a unificação de impostos e desoneração da cesta básica nacional",
        position: "Votou a favor",
        status: "vote-positive",
    },
    {
        title: "Reajuste de Verba de Gabinete",
        description:
            "Rejeitou aumento automático nos auxílios e verbas de custeio dos gabinetes",
        position: "Votou contra",
        status: "vote-negative",
    },
];

export default function ParliamentarianAnalysis({
    parliamentarian,
    onNavigateToParliamentarians,
    onNavigateToHome,
    onNavigateToLearn,
    onNavigateToLogin,
}) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [selectedQuotaYear, setSelectedQuotaYear] = useState("Cota 2026");

    const name = parliamentarian?.name || "Parlamentar";
    const position = parliamentarian?.position || "Deputado Federal";
    const party = parliamentarian?.party || "PL";
    const state = parliamentarian?.state || "SP";

    const currentExpenses =
        expensesByYear[selectedQuotaYear] || expensesByYear["Cota 2026"];

    const handleSidebarNavigate = (label) => {
        if (label === "Home") {
            if (onNavigateToHome) {
                onNavigateToHome();
            } else {
                onNavigateToParliamentarians?.();
            }
        } else if (label === "Lawmakers") {
            onNavigateToParliamentarians?.();
        } else if (label === "Learn") {
            onNavigateToLearn?.();
        } else if (label === "Chat Huari") {
            alert("O Chat Huari com IA estará disponível em breve!");
        }
    };

    return (
        <div className="analysis-layout">
            {/* Sidebar Fixa à Esquerda */}
            <div className="analysis-sidebar-wrapper">
                <SideBar
                    activeItem="Lawmakers"
                    onNavigate={handleSidebarNavigate}
                    onLogout={onNavigateToLogin}
                    onSettings={() => console.log("Configurações")}
                />
            </div>

            {/* Área Principal à Direita */}
            <main className="analysis-content">
                <div className="analysis-container">
                    {/* Topo de Navegação */}
                    <button
                        type="button"
                        className="analysis-back-link"
                        onClick={onNavigateToParliamentarians}
                    >
                        <RiArrowLeftLine size={18} aria-hidden="true" />
                        <span>Voltar para Parlamentares</span>
                    </button>

                    {/* Card de Cabeçalho do Perfil */}
                    <section
                        className="analysis-profile-card"
                        aria-label="Perfil do Parlamentar"
                    >
                        <div className="analysis-avatar-large" aria-hidden="true">
                            <RiUser3Fill size={48} />
                        </div>

                        <div className="analysis-profile-info">
                            <div className="analysis-name-row">
                                <h1 className="analysis-profile-name">{name}</h1>

                                <div className="analysis-badges">
                                    <span className="analysis-badge-party">
                                        {party}
                                    </span>
                                    <span className="analysis-badge-state">
                                        <RiMapPinLine size={13} />
                                        {state}
                                    </span>
                                </div>
                            </div>

                            <p className="analysis-profile-role">{position}</p>

                            <div className="analysis-status-row">
                                <span
                                    className="status-dot-green"
                                    aria-hidden="true"
                                />
                                <span className="status-label">Em exercício</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={`btn-follow-toggle ${isFollowing ? "is-following" : ""
                                }`}
                            onClick={() => setIsFollowing((prev) => !prev)}
                            aria-pressed={isFollowing}
                        >
                            {isFollowing ? (
                                <>
                                    <RiCheckLine size={18} />
                                    <span>Seguindo</span>
                                </>
                            ) : (
                                <>
                                    <RiAddLine size={18} />
                                    <span>Seguir</span>
                                </>
                            )}
                        </button>
                    </section>

                    {/* Grid de Métricas (3 colunas) */}
                    <section
                        className="analysis-metrics-grid"
                        aria-label="Métricas Principais do Parlamentar"
                    >
                        <article className="analysis-metric-card">
                            <span className="metric-card-header">
                                PRESENÇA EM PLENÁRIO
                            </span>
                            <strong className="metric-card-value highlight-orange">
                                89%
                            </strong>
                            <p className="metric-card-subtext">
                                58 de 65 sessões
                            </p>
                        </article>

                        <article className="analysis-metric-card">
                            <span className="metric-card-header">
                                GASTOS NO ANO
                            </span>
                            <strong className="metric-card-value">
                                R$ 384 mil
                            </strong>
                            <p className="metric-card-subtext">
                                Dentro da média estadual
                            </p>
                        </article>

                        <article className="analysis-metric-card">
                            <span className="metric-card-header">
                                PROJETOS DE LEI
                            </span>
                            <strong className="metric-card-value">24</strong>
                            <p className="metric-card-subtext">
                                Propostas apresentadas
                            </p>
                        </article>
                    </section>

                    {/* Seção Principais Gastos de Gabinete */}
                    <section
                        className="analysis-section-card"
                        aria-label="Principais Gastos de Gabinete"
                    >
                        <header className="analysis-section-header">
                            <div className="analysis-section-title-group">
                                <div className="section-icon-box">
                                    <RiWallet3Line size={22} aria-hidden="true" />
                                </div>
                                <h2>Principais Gastos de Gabinete</h2>
                            </div>

                            <select
                                className="analysis-quota-select"
                                value={selectedQuotaYear}
                                onChange={(e) =>
                                    setSelectedQuotaYear(e.target.value)
                                }
                                aria-label="Selecionar ano da cota parlamentar"
                            >
                                <option value="Cota 2026">Cota 2026</option>
                                <option value="Cota 2025">Cota 2025</option>
                            </select>
                        </header>

                        <div className="analysis-expenses-list">
                            {currentExpenses.map((expense) => (
                                <div
                                    className="analysis-expense-item"
                                    key={expense.title}
                                >
                                    <div className="analysis-expense-top">
                                        <span className="expense-item-title">
                                            {expense.title}
                                        </span>
                                        <strong className="expense-item-amount">
                                            {expense.amount}
                                        </strong>
                                    </div>

                                    <div
                                        className="analysis-progress-bar-bg"
                                        role="progressbar"
                                        aria-label={expense.title}
                                        aria-valuenow={expense.percentage}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        <div
                                            className={`analysis-progress-bar-fill ${expense.tone}`}
                                            style={{
                                                width: `${expense.percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Seção Últimas Votações de Destaque */}
                    <section
                        className="analysis-section-card"
                        aria-label="Últimas Votações de Destaque"
                    >
                        <header className="analysis-section-header">
                            <div className="analysis-section-title-group">
                                <div className="section-icon-box">
                                    <RiBarChartBoxLine
                                        size={22}
                                        aria-hidden="true"
                                    />
                                </div>
                                <h2>Últimas Votações de Destaque</h2>
                            </div>

                            <span className="analysis-civic-tag">
                                Resumo Cívico
                            </span>
                        </header>

                        <div className="analysis-votes-list">
                            {votes.map((vote) => (
                                <article
                                    className="analysis-vote-item"
                                    key={vote.title}
                                >
                                    <div className="analysis-vote-top">
                                        <h3 className="vote-item-title">
                                            {vote.title}
                                        </h3>
                                        <span
                                            className={`vote-item-badge ${vote.status}`}
                                        >
                                            {vote.position}
                                        </span>
                                    </div>
                                    <p className="vote-item-desc">
                                        {vote.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    {/* Banner de IA Cívica */}
                    <section
                        className="analysis-ai-civic-banner"
                        aria-label="Assistente de IA Cívica"
                    >
                        <div className="ai-banner-icon-wrapper">
                            <RiMessage3Line size={32} aria-hidden="true" />
                        </div>

                        <div className="ai-banner-content">
                            <h2>Ficou com alguma dúvida sobre o Parlamentar?</h2>
                            <p>
                                Nossa IA Cívica analisa o histórico legislativo,
                                despesas e votações para responder suas dúvidas em
                                linguagem simples e imparcial.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn-ask-ai"
                            onClick={() =>
                                alert(
                                    "O Chat Huari com IA estará disponível em breve!"
                                )
                            }
                        >
                            Tirar dúvidas com a IA
                        </button>
                    </section>
                </div>

                {/* Footer Institucional na Base */}
                <Footer />
            </main>
        </div>
    );
}
