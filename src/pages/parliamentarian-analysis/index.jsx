import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    RiWallet3Line,
    RiFileList3Line,
    RiSparklingLine,
    RiArrowLeftLine,
    RiAddLine,
    RiCheckLine,
    RiDownloadLine,
} from "react-icons/ri";
import { lawmakersService } from "../../services/lawmakers-service";
import { chatService } from "../../services/chat-service";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/useToast";
import { exportExpensesToCsv } from "../../utils/csv-export";
import Avatar from "../../components/avatar";
import Badge from "../../components/badge";
import EmptyState from "../../components/empty-state";
import "./style.css";

export default function ParliamentarianAnalysis({ lawmaker: propLawmaker }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { bookmarkedLawmakerIds = [], toggleBookmark } = useApp() || {};

    const [fetchedLawmaker, setFetchedLawmaker] = useState(null);
    const [loading, setLoading] = useState(!propLawmaker);
    const [notFound, setNotFound] = useState(false);
    const [selectedQuotaYear, setSelectedQuotaYear] = useState("");
    const [billExplanations, setBillExplanations] = useState({});
    const [explainingBillId, setExplainingBillId] = useState(null);

    const lawmaker = propLawmaker || fetchedLawmaker;

    useEffect(() => {
        if (propLawmaker || !id) {
            return undefined;
        }

        let isMounted = true;

        async function loadLawmaker() {
            setLoading(true);
            try {
                const data = await lawmakersService.getLawmakerById(id);
                if (!isMounted) return;
                if (data) {
                    setFetchedLawmaker(data);
                    const years = Object.keys(data.expensesByYear || {});
                    setSelectedQuotaYear(years[0] || "");
                    setNotFound(false);
                } else {
                    setFetchedLawmaker(null);
                    setNotFound(true);
                }
            } catch (err) {
                console.error("Falha ao carregar detalhes do parlamentar", err);
                if (isMounted) {
                    setNotFound(true);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadLawmaker();

        return () => {
            isMounted = false;
        };
    }, [id, propLawmaker]);

    const isRecordNotFound = notFound || (!propLawmaker && !id);

    if (loading) {
        return (
            <div className="analysis-page-container">
                <Link to="/lawmakers" className="analysis-back-link">
                    <RiArrowLeftLine size={18} aria-hidden="true" />
                    <span>Voltar para parlamentares</span>
                </Link>
                <div
                    className="analysis-loading-state"
                    style={{
                        padding: "4rem 1rem",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <div className="loading-spinner" />
                    <p style={{ color: "var(--color-text-muted)" }}>
                        Carregando dados do mandato...
                    </p>
                </div>
            </div>
        );
    }

    if (isRecordNotFound || !lawmaker) {
        return (
            <div className="analysis-page-container">
                <Link to="/lawmakers" className="analysis-back-link">
                    <RiArrowLeftLine size={18} aria-hidden="true" />
                    <span>Voltar para parlamentares</span>
                </Link>
                <EmptyState
                    title="Parlamentar não encontrado"
                    description="Não encontramos nenhum mandato correspondente a este identificador."
                    actionText="Ver diretório completo"
                    onAction={() => navigate("/lawmakers")}
                />
            </div>
        );
    }

    const isBookmarked = bookmarkedLawmakerIds.includes(Number(lawmaker.id));
    const availableYears = Object.keys(lawmaker.expensesByYear || lawmaker.quotaExpenses || {});
    const activeYear =
        selectedQuotaYear && availableYears.includes(selectedQuotaYear)
            ? selectedQuotaYear
            : availableYears[0] || "";

    const rawCategoryExpenses = activeYear
        ? lawmaker.expensesByYear?.[activeYear] || lawmaker.quotaExpenses?.[activeYear] || []
        : [];

    const expenses = rawCategoryExpenses.map((expense) => ({
        category: expense.title || expense.category || "Despesa de mandato",
        amount: expense.amount || "R$ 0,00",
        percentage: expense.percentage || 0,
        tone: (expense.tone || "medium").replace(/^tone-/, ""),
    }));

    const bills = Array.isArray(lawmaker.bills) ? lawmaker.bills : [];

    const handleAskAi = () => {
        navigate("/chat", {
            state: {
                initialPrompt: `Explique o histórico de despesas CEAP e projetos de ${lawmaker.name} (${lawmaker.party}/${lawmaker.state}).`,
            },
        });
    };

    const handleExplainBill = async (bill) => {
        const key = bill.id || bill.code;
        if (billExplanations[key]) {
            setBillExplanations((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
            return;
        }

        setExplainingBillId(key);
        try {
            const res = await chatService.explainBill({
                billCode: bill.code,
                summary: bill.summary,
                title: `${lawmaker.name} — ${bill.title}`,
            });
            setBillExplanations((prev) => ({
                ...prev,
                [key]: res,
            }));
        } catch (err) {
            toast?.error?.(err?.message || "Não foi possível gerar a explicação deste projeto agora.");
        } finally {
            setExplainingBillId(null);
        }
    };

    const handleExportCsv = () => {
        const detailedForYear = Array.isArray(lawmaker.expenseRecords)
            ? lawmaker.expenseRecords.filter((rec) => !activeYear || rec.yearKey === activeYear)
            : [];
        const rowsToExport =
            detailedForYear.length > 0
                ? detailedForYear.map((rec) => ({
                      date: rec.date,
                      category: rec.category,
                      supplier: rec.supplier,
                      amount: rec.amountFormatted,
                      percentage: rec.percentage,
                  }))
                : rawCategoryExpenses;

        const success = exportExpensesToCsv({
            expenses: rowsToExport,
            lawmakerName: lawmaker?.name,
            year: activeYear || String(new Date().getFullYear()),
        });

        if (success) {
            toast?.success?.("Demonstrativo de despesas exportado em CSV.");
        } else {
            toast?.info?.("Não há lançamentos de despesas disponíveis para exportar.");
        }
    };

    return (
        <div className="analysis-page-container">
            <Link to="/lawmakers" className="analysis-back-link">
                <RiArrowLeftLine size={18} aria-hidden="true" />
                <span>Voltar para parlamentares</span>
            </Link>

            <section
                className="analysis-profile-card"
                aria-label="Perfil do parlamentar"
            >
                <Avatar
                    name={lawmaker.name}
                    src={lawmaker.avatar || "/images/default-avatar.png"}
                    fallbackSrc="/images/default-avatar.png"
                    size="xl"
                />

                <div className="analysis-profile-info">
                    <div className="analysis-name-row">
                        <h1 className="analysis-profile-name">{lawmaker.name}</h1>

                        <div className="analysis-badges">
                            <Badge variant="party">{lawmaker.party}</Badge>
                            <Badge variant="state">{lawmaker.state}</Badge>
                        </div>
                    </div>

                    <p className="analysis-profile-role">
                        {lawmaker.position || lawmaker.role} · {lawmaker.chamberLabel || "Congresso Nacional"}
                    </p>
                </div>

                <button
                    type="button"
                    className={`btn-follow-toggle ${isBookmarked ? "is-following" : ""}`}
                    onClick={() => toggleBookmark(lawmaker.id)}
                    aria-pressed={isBookmarked}
                    aria-label={isBookmarked ? `Remover ${lawmaker.name} dos salvos` : `Salvar ${lawmaker.name}`}
                >
                    {isBookmarked ? (
                        <>
                            <RiCheckLine size={18} aria-hidden="true" />
                            <span>Acompanhando</span>
                        </>
                    ) : (
                        <>
                            <RiAddLine size={18} aria-hidden="true" />
                            <span>Acompanhar</span>
                        </>
                    )}
                </button>
            </section>

            <section
                className="analysis-metrics-grid"
                aria-label="Resumo do mandato"
            >
                <article className="analysis-metric-card">
                    <span className="metric-card-header">Casa legislativa</span>
                    <strong className="metric-card-value highlight-orange">
                        {lawmaker.chamber === "FEDERAL_SENATE" ? "Senado" : "Câmara"}
                    </strong>
                    <p className="metric-card-subtext">
                        {lawmaker.externalId ? `Registro oficial nº ${lawmaker.externalId}` : "Mandato em exercício"}
                    </p>
                </article>

                <article className="analysis-metric-card">
                    <span className="metric-card-header">Despesas CEAP registradas</span>
                    <strong className="metric-card-value tabular-nums">
                        {lawmaker.totalExpensesFormatted || lawmaker.expenses || "R$ 0,00"}
                    </strong>
                    <p className="metric-card-subtext">
                        {lawmaker.expensesCount > 0
                            ? `${lawmaker.expensesCount} lançamentos contabilizados na base`
                            : "Nenhum lançamento registrado até o momento"}
                    </p>
                </article>

                <article className="analysis-metric-card">
                    <span className="metric-card-header">Projetos de Lei de autoria</span>
                    <strong className="metric-card-value tabular-nums">
                        {lawmaker.billsCount ?? bills.length}
                    </strong>
                    <p className="metric-card-subtext">Proposições cadastradas no sistema</p>
                </article>
            </section>

            <section
                className="analysis-section-card"
                aria-label="Prestação de contas da Cota Parlamentar (CEAP)"
            >
                <header className="analysis-section-header">
                    <div className="analysis-section-title-group">
                        <div className="section-icon-box">
                            <RiWallet3Line size={22} aria-hidden="true" />
                        </div>
                        <h2>Prestação de Contas (CEAP)</h2>
                    </div>

                    <div className="analysis-section-actions">
                        <button
                            type="button"
                            className="btn-export-csv"
                            onClick={handleExportCsv}
                            title="Exportar demonstrativo de despesas em CSV"
                            aria-label="Exportar gastos em CSV"
                            disabled={expenses.length === 0}
                        >
                            <RiDownloadLine size={16} aria-hidden="true" />
                            <span>Exportar CSV</span>
                        </button>

                        {availableYears.length > 0 && (
                            <select
                                className="analysis-quota-select"
                                value={activeYear}
                                onChange={(e) => setSelectedQuotaYear(e.target.value)}
                                aria-label="Selecionar ano das despesas CEAP"
                            >
                                {availableYears.map((yr) => (
                                    <option key={yr} value={yr}>
                                        {yr}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </header>

                {expenses.length === 0 ? (
                    <p className="analysis-empty-note">
                        Ainda não há notas fiscais ou reembolsos da CEAP registrados para este mandato na base atual.
                    </p>
                ) : (
                    <div className="analysis-expenses-list">
                        {expenses.map((expense) => (
                            <div className="analysis-expense-item" key={expense.category}>
                                <div className="analysis-expense-top">
                                    <span className="expense-item-title">{expense.category}</span>
                                    <strong className="expense-item-amount tabular-nums">{expense.amount}</strong>
                                </div>

                                <div
                                    className="analysis-progress-bar-bg"
                                    role="progressbar"
                                    aria-label={expense.category}
                                    aria-valuenow={expense.percentage}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    <div
                                        className={`analysis-progress-bar-fill tone-${expense.tone || "medium"}`}
                                        style={{ width: `${expense.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section
                className="analysis-section-card"
                aria-label="Projetos de Lei vinculados ao parlamentar"
            >
                <header className="analysis-section-header">
                    <div className="analysis-section-title-group">
                        <div className="section-icon-box">
                            <RiFileList3Line size={22} aria-hidden="true" />
                        </div>
                        <h2>Projetos de Lei de Autoria</h2>
                    </div>
                </header>

                {bills.length === 0 ? (
                    <p className="analysis-empty-note">
                        Nenhum projeto de lei vinculado diretamente a este mandato no banco até o momento.
                    </p>
                ) : (
                    <div className="analysis-votes-list">
                        {bills.map((bill) => {
                            const billKey = bill.id || bill.code;
                            const explanation = billExplanations[billKey];
                            const isExplaining = explainingBillId === billKey;

                            return (
                                <article className="analysis-vote-item" key={billKey}>
                                    <div className="analysis-vote-top">
                                        <h3 className="vote-item-title">
                                            {bill.code} — {bill.title}
                                        </h3>
                                        <span className="analysis-civic-tag">{bill.status}</span>
                                    </div>
                                    <p className="vote-item-desc">{bill.summary}</p>

                                    <div className="analysis-bill-actions">
                                        <button
                                            type="button"
                                            className="btn-explain-bill"
                                            onClick={() => handleExplainBill(bill)}
                                            disabled={isExplaining}
                                        >
                                            <RiSparklingLine size={15} aria-hidden="true" />
                                            <span>
                                                {isExplaining
                                                    ? "Traduzindo ementa..."
                                                    : explanation
                                                      ? "Ocultar explicação"
                                                      : "Explicar em linguagem simples"}
                                            </span>
                                        </button>
                                    </div>

                                    {explanation && (
                                        <div className="analysis-bill-explanation">
                                            <p>{explanation.simplifiedExplanation}</p>
                                            {explanation.practicalImpacts && (
                                                <p className="analysis-bill-impact">
                                                    <strong>Impacto prático:</strong> {explanation.practicalImpacts}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            <section
                className="analysis-ai-civic-banner"
                aria-label="Assistente Huari IA"
            >
                <div className="ai-banner-icon-wrapper">
                    <RiSparklingLine size={28} aria-hidden="true" />
                </div>

                <div className="ai-banner-content">
                    <h2>Quer aprofundar a análise deste mandato?</h2>
                    <p>
                        Pergunte à Huari IA sobre regras da Cota Parlamentar, projetos de lei ou acompanhamento legislativo.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn-ask-ai"
                    onClick={handleAskAi}
                >
                    Perguntar à Huari IA
                </button>
            </section>
        </div>
    );
}

ParliamentarianAnalysis.propTypes = {
    lawmaker: PropTypes.object,
};
