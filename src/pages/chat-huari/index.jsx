import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { chatService } from "../../services/chatService";
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

/**
 * Safe React inline bold tokenizer (**bold**) without dangerouslySetInnerHTML.
 */
function renderInlineBold(text) {
    if (!text) return null;
    const parts = String(text).split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}

function renderFormattedMessage(text) {
    return text.split("\n\n").map((paragraph, idx) => {
        if (paragraph.startsWith("> ")) {
            const rawQuote = paragraph.replace(/^>\s*/, "");
            return (
                <blockquote key={idx} className="bubble-quote">
                    {renderInlineBold(rawQuote)}
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
                        return <li key={itemIdx}>{renderInlineBold(cleanItem)}</li>;
                    })}
                </ul>
            );
        }

        return <p key={idx}>{renderInlineBold(paragraph)}</p>;
    });
}

export default function ChatHuari() {
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputPrompt, setInputPrompt] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);
    const hasHandledInitialPrompt = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = useCallback(async (textToSend) => {
        const query = (textToSend || inputPrompt).trim();
        if (!query) return;

        const userMessage = {
            id: `usr-${Date.now()}`,
            sender: "user",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            text: query,
        };

        const history = messages
            .filter((m) => m.id !== "init-1")
            .map((m) => ({
                role: m.sender === "user" ? "user" : "assistant",
                content: m.text,
            }));

        setMessages((prev) => [...prev, userMessage]);
        setInputPrompt("");
        setIsTyping(true);

        try {
            const result = await chatService.sendMessage(query, history);
            const aiMessage = {
                id: `ai-${Date.now()}`,
                sender: "huari",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                text: result.response,
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            const errorMessage = {
                id: `err-${Date.now()}`,
                sender: "huari",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                text: `I encountered an issue processing your request: ${err.message || 'Please check your connection and try again.'}`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    }, [inputPrompt, messages]);

    // Check for initial prompt passed from other pages (e.g. ParliamentarianAnalysis)
    useEffect(() => {
        if (location.state?.initialPrompt && !hasHandledInitialPrompt.current) {
            hasHandledInitialPrompt.current = true;
            const prompt = location.state.initialPrompt;
            navigate(location.pathname, { replace: true, state: {} });
            handleSendMessage(prompt);
        }
    }, [location.state, location.pathname, navigate, handleSendMessage]);

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
