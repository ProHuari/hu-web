import { useState } from "react";
import PropTypes from "prop-types";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    RiWallet3Line,
    RiBarChartBoxLine,
    RiSparklingLine,
    RiArrowLeftLine,
    RiAddLine,
    RiCheckLine,
} from "react-icons/ri";
import { getLawmakerById, MOCK_LAWMAKERS } from "../../data/lawmakers";
import { useApp } from "../../context/AppContext";
import Avatar from "../../components/avatar";
import Badge from "../../components/badge";
import "./style.css";

export default function ParliamentarianAnalysis({ lawmaker: propLawmaker }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { bookmarkedLawmakerIds = [], toggleBookmark } = useApp() || {};

    const [selectedQuotaYear, setSelectedQuotaYear] = useState("Quota 2026");

    // Lookup lawmaker by param or prop, falling back to first lawmaker
    const lawmaker = propLawmaker || (id ? getLawmakerById(id) : MOCK_LAWMAKERS[0]) || MOCK_LAWMAKERS[0];
    const isBookmarked = bookmarkedLawmakerIds.includes(lawmaker.id);

    // Support both expensesByYear and quotaExpenses schemas
    const rawExpenses =
        lawmaker.expensesByYear?.[selectedQuotaYear] ||
        lawmaker.quotaExpenses?.[selectedQuotaYear.replace('Quota ', '')] ||
        [];

    const expenses = rawExpenses.map((expense) => ({
        category: expense.title || expense.category || 'General Mandate Expense',
        amount: expense.amount || 'R$ 0',
        percentage: expense.percentage || 0,
        tone: (expense.tone || 'medium').replace(/^tone-/, ''),
    }));

    const handleAskAi = () => {
        navigate("/chat", {
            state: {
                initialPrompt: `Can you analyze ${lawmaker.name}'s voting and CEAP spending records in Congress?`,
            },
        });
    };

    return (
        <div className="analysis-page-container">
            {/* Top Navigation */}
            <Link to="/lawmakers" className="analysis-back-link">
                <RiArrowLeftLine size={18} aria-hidden="true" />
                <span>Back to Lawmakers Directory</span>
            </Link>

            {/* Profile Header Card */}
            <section
                className="analysis-profile-card"
                aria-label="Lawmaker Profile Header"
            >
                <Avatar
                    name={lawmaker.name}
                    src={lawmaker.avatar}
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

                    <p className="analysis-profile-role">{lawmaker.position || lawmaker.role}</p>

                    <div className="analysis-status-row">
                        <span className="status-dot-green" aria-hidden="true" />
                        <span className="status-label">In Office (57th Legislature)</span>
                    </div>
                </div>

                <button
                    type="button"
                    className={`btn-follow-toggle ${isBookmarked ? "is-following" : ""}`}
                    onClick={() => toggleBookmark(lawmaker.id)}
                    aria-pressed={isBookmarked}
                    aria-label={isBookmarked ? `Unfollow ${lawmaker.name}` : `Follow ${lawmaker.name}`}
                >
                    {isBookmarked ? (
                        <>
                            <RiCheckLine size={18} aria-hidden="true" />
                            <span>Following</span>
                        </>
                    ) : (
                        <>
                            <RiAddLine size={18} aria-hidden="true" />
                            <span>Follow</span>
                        </>
                    )}
                </button>
            </section>

            {/* Metrics Grid */}
            <section
                className="analysis-metrics-grid"
                aria-label="Key Mandate Metrics"
            >
                <article className="analysis-metric-card">
                    <span className="metric-card-header">FLOOR ATTENDANCE</span>
                    <strong className="metric-card-value highlight-orange">
                        {lawmaker.attendance}
                    </strong>
                    <p className="metric-card-subtext">{lawmaker.sessionsCount || "Roll-call deliberative sessions"}</p>
                </article>

                <article className="analysis-metric-card">
                    <span className="metric-card-header">ANNUAL CEAP SPENDING</span>
                    <strong className="metric-card-value">
                        {lawmaker.expensesYearly || lawmaker.expenses}
                    </strong>
                    <p className="metric-card-subtext">{lawmaker.expensesContext || "Within state quota average"}</p>
                </article>

                <article className="analysis-metric-card">
                    <span className="metric-card-header">BILLS PROPOSED</span>
                    <strong className="metric-card-value">{lawmaker.projects}</strong>
                    <p className="metric-card-subtext">Authored propositions in review</p>
                </article>
            </section>

            {/* CEAP Quota Spending Section */}
            <section
                className="analysis-section-card"
                aria-label="Parliamentary Quota Expenses (CEAP)"
            >
                <header className="analysis-section-header">
                    <div className="analysis-section-title-group">
                        <div className="section-icon-box">
                            <RiWallet3Line size={22} aria-hidden="true" />
                        </div>
                        <h2>Top Quota Expenses (CEAP)</h2>
                    </div>

                    <select
                        className="analysis-quota-select"
                        value={selectedQuotaYear}
                        onChange={(e) => setSelectedQuotaYear(e.target.value)}
                        aria-label="Select parliamentary quota fiscal year"
                    >
                        <option value="Quota 2026">Quota 2026</option>
                        <option value="Quota 2025">Quota 2025</option>
                    </select>
                </header>

                <div className="analysis-expenses-list">
                    {expenses.map((expense) => (
                        <div className="analysis-expense-item" key={expense.category}>
                            <div className="analysis-expense-top">
                                <span className="expense-item-title">{expense.category}</span>
                                <strong className="expense-item-amount">{expense.amount}</strong>
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
            </section>

            {/* Key Floor Votes */}
            <section
                className="analysis-section-card"
                aria-label="Key Floor Votes & Positions"
            >
                <header className="analysis-section-header">
                    <div className="analysis-section-title-group">
                        <div className="section-icon-box">
                            <RiBarChartBoxLine size={22} aria-hidden="true" />
                        </div>
                        <h2>Key Roll-Call Floor Votes</h2>
                    </div>

                    <span className="analysis-civic-tag">Civic Audit Record</span>
                </header>

                <div className="analysis-votes-list">
                    {lawmaker.votes?.map((vote) => (
                        <article className="analysis-vote-item" key={vote.title}>
                            <div className="analysis-vote-top">
                                <h3 className="vote-item-title">{vote.title}</h3>
                                <span
                                    className={`vote-item-badge ${
                                        vote.status === "vote-positive"
                                            ? "vote-positive"
                                            : "vote-negative"
                                    }`}
                                >
                                    {vote.position}
                                </span>
                            </div>
                            <p className="vote-item-desc">{vote.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Civic AI Assistant Banner */}
            <section
                className="analysis-ai-civic-banner"
                aria-label="Civic AI Query Assistant"
            >
                <div className="ai-banner-icon-wrapper">
                    <RiSparklingLine size={32} aria-hidden="true" />
                </div>

                <div className="ai-banner-content">
                    <h2>Have questions about this lawmaker&apos;s record?</h2>
                    <p>
                        Our Civic AI examines legislative voting histories, CEAP vouchers, and sponsored bills to answer questions in impartial, accessible language.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn-ask-ai"
                    onClick={handleAskAi}
                >
                    Ask Civic AI
                </button>
            </section>
        </div>
    );
}

ParliamentarianAnalysis.propTypes = {
    lawmaker: PropTypes.object,
};
