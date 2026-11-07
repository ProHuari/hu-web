import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    RiSendPlane2Fill,
    RiSparkling2Line,
    RiUser3Line,
    RiRefreshLine,
    RiLightbulbLine,
    RiGovernmentLine,
    RiMoneyDollarCircleLine,
    RiBookOpenLine,
    RiFileCopyLine,
    RiCheckLine,
    RiThumbUpLine,
    RiThumbDownLine,
    RiInformationLine,
} from "react-icons/ri";
import logoHuari from "../../assets/images/logoHuari.svg";
import "./style.css";

const PRESET_QUESTIONS = [
    {
        icon: RiMoneyDollarCircleLine,
        text: "What are the allowed expenses under the Parliamentary Quota (CEAP)?",
        category: "Public Spending",
    },
    {
        icon: RiGovernmentLine,
        text: "How does a Constitutional Amendment (PEC) pass through Congress?",
        category: "Legislative Process",
    },
    {
        icon: RiBookOpenLine,
        text: "How does the Electoral Quotient work in proportional representation?",
        category: "Electoral System",
    },
    {
        icon: RiLightbulbLine,
        text: "How can citizens audit lawmaker attendance and voucher expenses?",
        category: "Civic Auditing",
    },
];

const INITIAL_MESSAGES = [
    {
        id: "msg-welcome",
        sender: "huari",
        timestamp: "Just now",
        text: "Hello! I am **Huari**, your civic intelligence and transparency assistant. I can help you analyze congressional office expenses, audit floor voting records, understand legislative bills, and navigate the Brazilian political system.\n\nHow can I help you today?",
    },
];

const KNOWLEDGE_RESPONSES = {
    expenses: `The **Parliamentary Quota (CEAP - Cota para o Exercício da Atividade Parlamentar)** is a monthly expense allowance allocated to members of Congress to reimburse mandate-related activities.

Key permitted expense categories:
1. **Mandate Communication & Outreach:** Educational newsletters, video production, social media management, and activity reports.
2. **Commercial Airfare & Lodging:** Travel between the lawmaker's electoral home state and Brasília.
3. **Vehicle Rental & Fuel:** Ground transportation logistics within their state.
4. **Consulting & Technical Advisory:** Specialized research and policy analysis reports.

> **Transparency Note:** All invoices, merchant CNPJ identifiers, and receipts are publicly available in real time through official Chamber and Senate Open Data APIs!`,

    pec: `A **Constitutional Amendment Proposal (PEC - Proposta de Emenda à Constituição)** modifies the text of the 1988 Federal Constitution and requires a rigorous legislative pathway:

1. **Sponsorship:** Must be co-sponsored by at least 1/3 of Federal Deputies (171), 1/3 of Senators (27), or the President of the Republic.
2. **Constitution & Justice Committee (CCJ):** Assesses constitutional admissibility and legal harmony.
3. **Special Committee:** Reviews policy merits and proposed substitutions.
4. **Two-Round Supermajority Floor Vote:** Must be approved in both the Chamber and Senate by **3/5 supermajority** (308 Deputies and 49 Senators) in two separate voting rounds.

Executive sanction or veto does not apply: once passed by both houses, it is promulgated directly by Congress!`,

    quotient: `In Brazilian elections for Federal Deputy, State Deputy, and Municipal Councilor, elections operate under the **open-list proportional representation system**:

* **Electoral Quotient (QE):** Calculated by dividing total valid votes cast by the number of legislative seats to be filled.
* **Party Quotient (QP):** Calculated by dividing total votes received by a party list by the QE. This determines direct seats won.
* **Remaining Seat Allocation (Sobras):** Leftover seats are distributed using the highest-average (D'Hondt) method among parties meeting minimum electoral thresholds.

This ensures diverse political representation proportionate to overall citizen ideological preference!`,

    auditing: `Every citizen can audit congressional representatives using open civic tools:

1. **Official Congressional Portals:** The *Dados Abertos* and *Transparência* portals publish line-item expense receipts and roll-call voting records.
2. **Huari Civic Platform:** We correlate roll-call votes, floor attendance, and CEAP expense claims into intuitive, accessible dashboards.
3. **Federal Transparency Portal (CGU):** Directly inspect federal procurement contracts, grants, and transfers.
4. **Freedom of Information Act (LAI - Law 12.527/11):** Empowers any citizen to request government documents and explanations with a mandatory statutory response deadline of 20 days.`,
};

function renderFormattedMessage(text) {
    return text.split("\n\n").map((paragraph, idx) => {
        if (paragraph.startsWith("> ")) {
            return (
                <blockquote key={idx} className="bubble-quote">
                    {paragraph.replace("> ", "")}
                </blockquote>
            );
        }

        const lines = paragraph.split("\n");
        const isList = lines.every((line) => line.match(/^(\*|\d+\.)\s/));

        if (isList) {
            return (
                <ul key={idx} className="bubble-list">
                    {lines.map((item, itemIdx) => {
                        const cleanItem = item.replace(/^(\*|\d+\.)\s/, "");
                        return (
                            <li key={itemIdx} dangerouslySetInnerHTML={{
                                __html: cleanItem.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            }} />
                        );
                    })}
                </ul>
            );
        }

        const formattedHtml = paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        return <p key={idx} dangerouslySetInnerHTML={{ __html: formattedHtml }} />;
    });
}

export default function ChatHuari() {
    const location = useLocation();
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputPrompt, setInputPrompt] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Check for initial prompt passed from other pages (e.g. ParliamentarianAnalysis)
    useEffect(() => {
        if (location.state?.initialPrompt) {
            handleSendMessage(location.state.initialPrompt);
        }
    }, [location.state]);

    const handleSendMessage = (textToSend) => {
        const query = (textToSend || inputPrompt).trim();
        if (!query) return;

        const userMessage = {
            id: `usr-${Date.now()}`,
            sender: "user",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            text: query,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputPrompt("");
        setIsTyping(true);

        setTimeout(() => {
            let responseText = "";
            const lowerQuery = query.toLowerCase();

            if (lowerQuery.includes("expense") || lowerQuery.includes("quota") || lowerQuery.includes("ceap") || lowerQuery.includes("spending") || lowerQuery.includes("cost") || lowerQuery.includes("gasto")) {
                responseText = KNOWLEDGE_RESPONSES.expenses;
            } else if (lowerQuery.includes("pec") || lowerQuery.includes("amendment") || lowerQuery.includes("bill") || lowerQuery.includes("constitution") || lowerQuery.includes("law")) {
                responseText = KNOWLEDGE_RESPONSES.pec;
            } else if (lowerQuery.includes("quotient") || lowerQuery.includes("election") || lowerQuery.includes("vote") || lowerQuery.includes("proportional")) {
                responseText = KNOWLEDGE_RESPONSES.quotient;
            } else if (lowerQuery.includes("audit") || lowerQuery.includes("citizen") || lowerQuery.includes("oversight") || lowerQuery.includes("track") || lowerQuery.includes("lai")) {
                responseText = KNOWLEDGE_RESPONSES.auditing;
            } else {
                responseText = `Thank you for your question regarding: "${query}".\n\nAs the civic intelligence assistant for **Huari**, I am designed to synthesize public records from the Chamber of Deputies, Federal Senate, and the Federal Court of Accounts (TCU).\n\nYou can explore lawmakers directly in the **Lawmakers** section, inspect courses under **Learn**, or ask about:\n* Detailed expense voucher categories for specific lawmakers\n* How legislative bills (PL, PLP, PEC, and MPV) become law\n* How to inspect parliamentary attendance and voting discipline`;
            }

            const aiMessage = {
                id: `ai-${Date.now()}`,
                sender: "huari",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                text: responseText,
            };

            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 750);
    };

    const handleClearChat = () => {
        setMessages(INITIAL_MESSAGES);
    };

    const handleCopy = (id, text) => {
        navigator.clipboard?.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="chat-page-container">
            {/* Chat Top Header */}
            <header className="chat-header">
                <div className="chat-header-left">
                    <div className="chat-agent-avatar">
                        <img src={logoHuari} alt="Huari AI" />
                        <span className="online-indicator" title="AI Active" />
                    </div>
                    <div className="chat-agent-meta">
                        <div className="agent-name-row">
                            <h1>Huari Civic AI</h1>
                            <span className="agent-badge">Civic Intelligence</span>
                        </div>
                        <p>Open Governance &amp; Congressional Data Assistant</p>
                    </div>
                </div>

                <div className="chat-header-actions">
                    <button
                        type="button"
                        className="chat-header-btn"
                        onClick={handleClearChat}
                        title="Start a new chat conversation"
                    >
                        <RiRefreshLine size={18} aria-hidden="true" />
                        <span>New Conversation</span>
                    </button>
                </div>
            </header>

            {/* Chat Body */}
            <div className="chat-body">
                {/* Transparency banner */}
                <div className="chat-transparency-banner">
                    <RiInformationLine size={20} aria-hidden="true" />
                    <p>
                        Huari AI answers are grounded in official open data published by the Chamber of Deputies, Federal Senate, and TCU, rendered with non-partisan impartiality.
                    </p>
                </div>

                {/* Messages stream */}
                <div className="chat-messages-container">
                    {messages.map((msg) => {
                        const isHuari = msg.sender === "huari";

                        return (
                            <div
                                key={msg.id}
                                className={`chat-bubble-row ${isHuari ? "bubble-huari" : "bubble-user"}`}
                            >
                                <div className="bubble-avatar">
                                    {isHuari ? (
                                        <div className="avatar-huari-icon" aria-hidden="true">
                                            <RiSparkling2Line size={18} />
                                        </div>
                                    ) : (
                                        <div className="avatar-user-icon" aria-hidden="true">
                                            <RiUser3Line size={18} />
                                        </div>
                                    )}
                                </div>

                                <div className="bubble-content-box">
                                    <div className="bubble-meta">
                                        <span className="bubble-sender-name">
                                            {isHuari ? "Huari AI" : "You"}
                                        </span>
                                        <span className="bubble-time">{msg.timestamp}</span>
                                    </div>

                                    <div className="bubble-text">
                                        {renderFormattedMessage(msg.text)}
                                    </div>

                                    {isHuari && (
                                        <div className="bubble-actions">
                                            <button
                                                type="button"
                                                className="bubble-action-btn"
                                                onClick={() => handleCopy(msg.id, msg.text)}
                                                title="Copy answer to clipboard"
                                            >
                                                {copiedId === msg.id ? (
                                                    <>
                                                        <RiCheckLine size={14} aria-hidden="true" />
                                                        <span>Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <RiFileCopyLine size={14} aria-hidden="true" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="bubble-action-btn"
                                                title="Helpful response"
                                                aria-label="Mark response as helpful"
                                            >
                                                <RiThumbUpLine size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                className="bubble-action-btn"
                                                title="Not helpful"
                                                aria-label="Mark response as not helpful"
                                            >
                                                <RiThumbDownLine size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div className="chat-bubble-row bubble-huari">
                            <div className="bubble-avatar">
                                <div className="avatar-huari-icon" aria-hidden="true">
                                    <RiSparkling2Line size={18} />
                                </div>
                            </div>
                            <div className="bubble-content-box typing-indicator-box" aria-label="Huari is typing">
                                <span className="typing-dot" />
                                <span className="typing-dot" />
                                <span className="typing-dot" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Preset Suggestions */}
                {messages.length <= 2 && (
                    <div className="chat-suggestions-section">
                        <span className="suggestions-title">Suggested questions on political transparency:</span>
                        <div className="suggestions-grid">
                            {PRESET_QUESTIONS.map((preset, index) => {
                                const Icon = preset.icon;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className="suggestion-card"
                                        onClick={() => handleSendMessage(preset.text)}
                                    >
                                        <div className="suggestion-icon" aria-hidden="true">
                                            <Icon size={18} />
                                        </div>
                                        <div className="suggestion-info">
                                            <span className="suggestion-category">{preset.category}</span>
                                            <p className="suggestion-text">{preset.text}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="chat-input-bar">
                <form
                    className="chat-input-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                >
                    <input
                        type="text"
                        className="chat-text-input"
                        placeholder="Ask about lawmakers, CEAP quota expenses, bills, or floor votes..."
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        disabled={isTyping}
                        aria-label="Chat input message"
                    />

                    <button
                        type="submit"
                        className="chat-send-btn"
                        disabled={!inputPrompt.trim() || isTyping}
                        aria-label="Send message"
                    >
                        <RiSendPlane2Fill size={19} aria-hidden="true" />
                        <span>Send</span>
                    </button>
                </form>
                <p className="chat-disclaimer">
                    Huari AI may make mistakes. Verify critical legislative records directly on official congressional portals.
                </p>
            </div>
        </div>
    );
}
