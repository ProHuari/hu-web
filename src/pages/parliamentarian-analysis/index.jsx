import { useState } from "react";
import { 
    RiUserLine,
    RiNotification3Line,
    RiWallet3Line,
    RiBarChartBoxLine,
    RiMessage3Line,
    RiArrowLeftLine,
} from "react-icons/ri";

import SideBar from "../../components/sidebar";
import Button from "../../components/button";
import Footer from "../../components/footer";

import "./style.css";

const expenses = [
    {
        title: "Divulgação da Atividade",
        amount: "R$ 142.000 (37%)",
        percentage: 69,
    },
    {
        title: "Passagens e Hospedagem",
        amount: "R$ 98.400 (25%)",
        percentage: 48,
    },
    {
        title: "Locação de Veículos e Combustível",
        amount: "R$ 76.500 (20%)",
        percentage: 37,
    },
];

const votes = [
    {
        title: "Reforma Tributária sobre o Consumo",
        description:
            "Aprovou a unificação de impostos e desoneração da cesta básica nacional.",
        position: "Votou a favor",
        status: "vote-positive",
    },
    {
        title: "Reajuste de Verba de Gabinete",
        description:
            "Rejeitou aumento automático nos auxílios e verbas de custeio dos gabinetes.",
        position: "Votou contra",
        status: "vote-negative",
    },
];

export default function ParliamentarianAnalysis({
    parliamentarian,
    onNavigateToParliamentarians,
}) {
    const [isFollowing, setIsFollowing] = useState(false);

    const name = parliamentarian?.name || "Parlamentar";
    const position = parliamentarian?.position || "Deputado Federal";
    const party = parliamentarian?.party || "PL";
    const state = parliamentarian?.state || "SP";
    const attendance = parliamentarian?.attendance || "89%";
    const projects = parliamentarian?.projects || "24";

    const handleNavigate = (label) => {
        if (label === "Lawmakers") {
            onNavigateToParliamentarians?.();
        }
    };

    return (
        <div className="analysis-layout">
            <SideBar
                activeItem="Lawmakers"
                onNavigate={handleNavigate}
            />

            <main className="analysis-content">
                <button
                    type="button"
                    className="analysis-back text-p-small-regular"
                    onClick={onNavigateToParliamentarians}
                >
                    <RiArrowLeftLine aria-hidden="true" />
                    Voltar para parlamentares
                </button>

                <section className="analysis-profile">
                    <div className="analysis-avatar">
                        <RiUserLine aria-hidden="true" />
                    </div>

                    <div className="analysis-profile-info">
                        <div className="analysis-name-line">
                            <h1 className="text-h2-bold">{name}</h1>

                            <div className="analysis-tags">
                                <span className="analysis-party">{party}</span>
                                <span className="analysis-state">{`◎ ${state}`}</span>
                            </div>
                        </div>

                        <p className="text-p-regular">{position}</p>
                        <p className="analysis-status text-p-small-regular">
                            Em exercício
                        </p>
                    </div>

                    <Button
                        title={isFollowing ? "Seguindo" : "Seguir"}
                        icon={<RiNotification3Line />}
                        iconPosition="left"
                        identifier="btn-follow-parliamentarian"
                        onClick={() => setIsFollowing(!isFollowing)}
                    />
                </section>

                <section className="analysis-stats" aria-label="Indicadores do parlamentar">
                    <article className="analysis-stat-card">
                        <h2 className="text-h3-regular">Presença em plenário</h2>
                        <strong className="analysis-stat-value attendance-value">
                            {attendance}
                        </strong>
                        <p className="text-p-regular">58 de 65 sessões</p>
                    </article>

                    <article className="analysis-stat-card">
                        <h2 className="text-h3-regular">Gastos no ano</h2>
                        <strong className="analysis-stat-value">R$ 384 mil</strong>
                        <p className="text-p-regular">Dentro da média estadual</p>
                    </article>

                    <article className="analysis-stat-card">
                        <h2 className="text-h3-regular">Projetos de lei</h2>
                        <strong className="analysis-stat-value">{projects}</strong>
                        <p className="text-p-regular">Propostas apresentadas</p>
                    </article>
                </section>

                <section className="analysis-panel">
                    <header className="analysis-panel-header">
                        <div className="analysis-panel-title">
                            <RiWallet3Line aria-hidden="true" />
                            <h2 className="text-p-bold">Principais Gastos de Gabinete</h2>
                        </div>
                        <span className="text-p-small-regular">Cota 2024</span>
                    </header>

                    <div className="analysis-expenses">
                        {expenses.map((expense) => (
                            <div className="analysis-expense" key={expense.title}>
                                <div className="analysis-expense-info">
                                    <span className="text-p-small-bold">
                                        {expense.title}
                                    </span>
                                    <strong className="text-p-small-bold">
                                        {expense.amount}
                                    </strong>
                                </div>

                                <div
                                    className="analysis-progress-track"
                                    role="progressbar"
                                    aria-label={expense.title}
                                    aria-valuenow={expense.percentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >
                                    <div
                                        className="analysis-progress-value"
                                        style={{ width: `${expense.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="analysis-panel analysis-votes">
                    <header className="analysis-panel-header">
                        <div className="analysis-panel-title">
                            <RiBarChartBoxLine aria-hidden="true" />
                            <h2 className="text-p-regular">
                                Últimas Votações de Destaque
                            </h2>
                        </div>
                        <span className="text-p-small-regular">Resumo Cívico</span>
                    </header>

                    <div className="analysis-vote-list">
                        {votes.map((vote) => (
                            <article className="analysis-vote-card" key={vote.title}>
                                <div className="analysis-vote-heading">
                                    <h3 className="text-p-regular">{vote.title}</h3>
                                    <span className={`analysis-vote-status ${vote.status}`}>
                                        {vote.position}
                                    </span>
                                </div>
                                <p className="text-p-small-regular">
                                    {vote.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="analysis-ai-banner">
                    <RiMessage3Line aria-hidden="true" />

                    <div className="analysis-ai-text">
                        <h2 className="text-h3-bold">
                            Ficou com alguma dúvida sobre o Parlamentar?
                        </h2>
                        <p className="text-p-small-regular">
                            Nossa IA Cívica responde em linguagem simples sem
                            uma lei ou ato específico é permitido.
                        </p>
                    </div>

                    <Button
                        title="Tirar dúvidas com a IA"
                        identifier="btn-analysis-ai"
                        onClick={() => console.log("Navegação para o Chat Huari")}
                    />
                </section>

                <Footer />
            </main>
        </div>
    );
}