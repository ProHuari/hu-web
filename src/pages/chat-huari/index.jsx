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
import { useToast } from "../../context/useToast";
import "./style.css";

const CHAT_STORAGE_KEY = "huari_chat_history";

const PRESET_QUESTIONS = [
    {
        icon: RiMoneyDollarCircleLine,
        text: "Quais os gastos permitidos pela Cota Parlamentar (CEAP) e seus limites?",
        category: "Gastos Públicos",
    },
    {
        icon: RiGovernmentLine,
        text: "Como funciona o rito de tramitação e aprovação de uma PEC no Congresso?",
        category: "Processo Legislativo",
    },
    {
        icon: RiBookOpenLine,
        text: "Como funciona o cálculo do Quociente Eleitoral nas eleições proporcionais?",
        category: "Sistema Eleitoral",
    },
    {
        icon: RiLightbulbLine,
        text: "Como qualquer cidadão pode auditar a frequência e notas fiscais de um deputado?",
        category: "Auditoria Cívica",
    },
];

const CONTEXTUAL_CHIPS = [
    {
        label: "Gastos com cota (CEAP)",
        prompt: "Quais os principais tipos de despesas permitidos pela Cota Parlamentar (CEAP) e como auditá-las?",
    },
    {
        label: "Auditar notas fiscais",
        prompt: "Como posso consultar e auditar as notas fiscais emitidas no reembolso da CEAP de um deputado?",
    },
    {
        label: "Tramitação de PECs",
        prompt: "Como funciona a tramitação e votação de uma Proposta de Emenda Constitucional (PEC) no Congresso?",
    },
    {
        label: "Passagens e diárias",
        prompt: "Como identificar e auditar gastos com passagens aéreas e diárias de gabinete parlamentar?",
    },
    {
        label: "Quociente Eleitoral",
        prompt: "Como funciona o cálculo do quociente eleitoral e partidário nas eleições legislativas proporcionais?",
    },
];

const INITIAL_MESSAGES = [
    {
        id: "msg-welcome",
        sender: "huari",
        timestamp: "Agora",
        text: "Olá! Eu sou a **Huari**, sua assistente de inteligência cívica e transparência parlamentar. Posso ajudar você a analisar despesas de gabinetes, auditar notas fiscais da CEAP, acompanhar projetos de lei e fiscalizar o Congresso Nacional.\n\nComo posso ajudar na sua auditoria hoje?",
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
    const toast = useToast();

    // Recover chat conversation from sessionStorage to avoid context loss on navigation
    const [messages, setMessages] = useState(() => {
        try {
            const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error("Failed to restore chat history from sessionStorage", e);
        }
        return INITIAL_MESSAGES;
    });

    const [inputPrompt, setInputPrompt] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const messagesEndRef = useRef(null);
    const hasHandledInitialPrompt = useRef(false);

    // Persist conversation updates to sessionStorage
    useEffect(() => {
        try {
            sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
        } catch (e) {
            console.error("Failed to persist chat history to sessionStorage", e);
        }
    }, [messages]);

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
            .filter((m) => m.id !== "msg-welcome")
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
                text: `Houve uma instabilidade na consulta de inteligência cívica: ${err.message || 'Verifique sua conexão e tente novamente.'}`,
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
        try {
            sessionStorage.removeItem(CHAT_STORAGE_KEY);
        } catch (e) {
            console.error("Failed to clear chat history", e);
        }
        toast?.info?.("Conversa reiniciada com sucesso.");
    };

    const handleCopyAnalysis = async (id, text) => {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            setCopiedId(id);
            toast?.success?.("Análise copiada para a área de transferência!");
            setTimeout(() => setCopiedId(null), 2500);
        } catch (e) {
            console.error("Failed to copy text", e);
            toast?.error?.("Não foi possível copiar o texto automaticamente.");
        }
    };

    return (
        <div className="chat-page-container">
            {/* Chat Top Header */}
            <header className="chat-header">
                <div className="chat-header-left">
                    <div className="chat-agent-avatar">
                        <img src={logoHuari} alt="Huari AI" />
                        <span className="online-indicator" title="IA Ativa" />
                    </div>
                    <div className="chat-agent-meta">
                        <div className="agent-name-row">
                            <h1>Huari Civic AI</h1>
                            <span className="agent-badge">Inteligência Cívica</span>
                        </div>
                        <p>Assistente de Auditoria Cívica e Dados Parlamentares</p>
                    </div>
                </div>

                <div className="chat-header-actions">
                    <button
                        type="button"
                        className="chat-header-btn"
                        onClick={handleClearChat}
                        title="Limpar e iniciar nova conversa"
                    >
                        <RiRefreshLine size={18} aria-hidden="true" />
                        <span>Nova Conversa</span>
                    </button>
                </div>
            </header>

            {/* Chat Body */}
            <div className="chat-body">
                {/* Transparency banner */}
                <div className="chat-transparency-banner">
                    <RiInformationLine size={20} aria-hidden="true" />
                    <p>
                        As análises da Huari AI são fundamentadas em dados abertos oficiais da Câmara dos Deputados, Senado Federal e TCU, apresentadas com rigor e imparcialidade técnica.
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
                                            {isHuari ? "Huari AI" : "Você"}
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
                                                className={`bubble-action-btn copy-analysis-btn ${copiedId === msg.id ? "is-copied" : ""}`}
                                                onClick={() => handleCopyAnalysis(msg.id, msg.text)}
                                                title="Copiar análise da Huari AI para a área de transferência"
                                                aria-label="Copiar análise da Huari AI"
                                            >
                                                {copiedId === msg.id ? (
                                                    <>
                                                        <RiCheckLine size={15} aria-hidden="true" />
                                                        <span>Análise Copiada!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <RiFileCopyLine size={15} aria-hidden="true" />
                                                        <span>Copiar Análise</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="bubble-action-btn"
                                                title="Resposta útil"
                                                aria-label="Marcar resposta como útil"
                                            >
                                                <RiThumbUpLine size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                className="bubble-action-btn"
                                                title="Não foi útil"
                                                aria-label="Marcar resposta como não útil"
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
                            <div className="bubble-content-box typing-indicator-box" aria-label="Huari AI está redigindo a resposta">
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
                        <span className="suggestions-title">Perguntas sugeridas sobre transparência e fiscalização:</span>
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

            {/* Input Bar with Contextual Chips */}
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
                        placeholder="Pergunte sobre parlamentares, despesas da CEAP, projetos de lei ou votações..."
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        disabled={isTyping}
                        aria-label="Mensagem para Huari AI"
                    />

                    <button
                        type="submit"
                        className="chat-send-btn"
                        disabled={!inputPrompt.trim() || isTyping}
                        aria-label="Enviar mensagem"
                    >
                        <RiSendPlane2Fill size={19} aria-hidden="true" />
                        <span>Enviar</span>
                    </button>
                </form>

                {/* Contextual Suggestion Chips */}
                <div className="chat-chips-scroll" role="region" aria-label="Sugestões contextuais de auditoria">
                    <span className="chat-chips-label">
                        <RiLightbulbLine size={14} aria-hidden="true" />
                        <span>Sugestões:</span>
                    </span>
                    <div className="chat-chips-list">
                        {CONTEXTUAL_CHIPS.map((chip, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className="chat-chip-btn"
                                onClick={() => handleSendMessage(chip.prompt)}
                                disabled={isTyping}
                                title={chip.prompt}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="chat-disclaimer">
                    A Huari AI utiliza dados abertos oficiais da Câmara dos Deputados e Senado Federal. Sempre consulte as notas e diários oficiais.
                </p>
            </div>
        </div>
    );
}
