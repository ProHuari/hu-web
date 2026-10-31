import React, { useState, useRef, useEffect } from "react";
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

import SideBar from "../../components/sidebar";
import logoHuari from "../../assets/images/logoHuari.svg";
import "./style.css";

const PRESET_QUESTIONS = [
    {
        icon: RiMoneyDollarCircleLine,
        text: "Quais são as principais despesas da Cota Parlamentar (CEAP)?",
        category: "Gastos Públicos",
    },
    {
        icon: RiGovernmentLine,
        text: "Como funciona a tramitação de uma PEC no Congresso Nacional?",
        category: "Processo Legislativo",
    },
    {
        icon: RiBookOpenLine,
        text: "Explique como funciona o Quociente Eleitoral nas eleições brasileiras.",
        category: "Sistema Eleitoral",
    },
    {
        icon: RiLightbulbLine,
        text: "Como um cidadão comum pode auditar votações e gastos de deputados?",
        category: "Fiscalização Cidadã",
    },
];

const INITIAL_MESSAGES = [
    {
        id: "msg-welcome",
        sender: "huari",
        timestamp: "Agora",
        text: "Olá! Sou a **Huari**, sua assistente de inteligência cívica e transparência pública. Posso te ajudar a consultar despesas de gabinetes, entender votações, decifrar Projetos de Lei e explicar o funcionamento do sistema político brasileiro.\n\nComo posso te ajudar hoje?",
    },
];

const KNOWLEDGE_RESPONSES = {
    gastos: `A **Cota para o Exercício da Atividade Parlamentar (CEAP)**, popularmente chamada de "cota parlamentar", é uma verba mensal destinada a custear despesas exclusivamente ligadas ao mandato dos deputados e senadores.

Principais categorias de gastos permitidos:
1. **Divulgação da Atividade Parlamentar:** Produção de vídeos, gestão de redes, impressos informativos.
2. **Passagens aéreas e hospedagem:** Viagens entre o estado de origem e Brasília.
3. **Locação de veículos e combustíveis:** Transporte terrestre nos estados.
4. **Consultorias e pesquisas:** Pareceres técnicos especializados.

> **Importante:** Todos os recibos e notas fiscais são públicos e disponibilizados no portal de Dados Abertos da Câmara e do Senado!`,

    pec: `Uma **Proposta de Emenda à Constituição (PEC)** altera o texto da Constituição Federal de 1988 e possui um rito legislativo rigoroso:

1. **Apresentação:** Precisa da assinatura de pelo menos 1/3 dos deputados ou 1/3 dos senadores, ou do Presidente da República.
2. **Comissão de Constituição e Justiça (CCJ):** Avalia a admissibilidade e constitucionalidade.
3. **Comissão Especial:** Analisa o mérito do texto.
4. **Plenário em 2 Turnos:** Deve ser aprovada tanto na Câmara quanto no Senado por **3/5 dos votos** (308 deputados e 49 senadores) em duas votações separadas.

Não cabe sanção ou veto do Presidente: uma vez aprovada nas duas Casas, é promulgada pelas Mesas do Congresso!`,

    quociente: `Nas eleições para Deputado Federal, Deputado Estadual e Vereador vigora o **sistema proporcional**:

* **Quociente Eleitoral (QE):** Divide-se o número de votos válidos pelo número de vagas a preencher.
* **Quociente Partidário (QP):** Divide-se a votação do partido pelo QE. O resultado é o número de vagas diretas que a legenda conquistou.
* **Distribuição das Sobras:** As vagas restantes são distribuídas pela regra da maior média.

Isso significa que o voto em um candidato ajuda o seu partido a atingir o quociente e eleger mais representantes daquela lista!`,

    fiscalizar: `Qualquer cidadão pode auditar mandatos parlamentares usando ferramentas públicas:

1. **Portal da Câmara dos Deputados & Senado:** Seção de *Transparência* e *Dados Abertos*.
2. **Plataforma Huari:** Cruzamos dados de votações, assiduidade e notas fiscais em gráficos simples e sem jargões.
3. **Portal da Transparência da CGU:** Consulta direta de contratos federais e convênios.
4. **Lei de Acesso à Informação (LAI - Lei 12.527/11):** Permite solicitar documentos e explicações a órgãos públicos com prazo legal de resposta de até 20 dias.`,
};

export default function ChatHuari({
    onNavigateToHome,
    onNavigateToParliamentarians,
    onNavigateToLearn,
    onNavigateToLogin,
}) {
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

            if (lowerQuery.includes("gasto") || lowerQuery.includes("cota") || lowerQuery.includes("ceap") || lowerQuery.includes("despesa")) {
                responseText = KNOWLEDGE_RESPONSES.gastos;
            } else if (lowerQuery.includes("pec") || lowerQuery.includes("emenda") || lowerQuery.includes("constitui") || lowerQuery.includes("tramita")) {
                responseText = KNOWLEDGE_RESPONSES.pec;
            } else if (lowerQuery.includes("quociente") || lowerQuery.includes("elei") || lowerQuery.includes("voto") || lowerQuery.includes("sistema proporcional")) {
                responseText = KNOWLEDGE_RESPONSES.quociente;
            } else if (lowerQuery.includes("auditar") || lowerQuery.includes("fiscaliz") || lowerQuery.includes("cidad") || lowerQuery.includes("acompanhar")) {
                responseText = KNOWLEDGE_RESPONSES.fiscalizar;
            } else {
                responseText = `Compreendi a sua dúvida sobre: "${query}".\n\nComo assistente de inteligência cívica da **Huari**, estou estruturada para interpretar dados públicos oficiais da Câmara dos Deputados, Senado Federal e TCU.\n\nVocê pode explorar dados de deputados diretamente na aba **Lawmakers**, conferir cursos na aba **Learn**, ou perguntar sobre:\n* Detalhes de despesas de parlamentares específicos\n* Significado de siglas como PEC, PL, PLP e MPV\n* Critérios de transparência e assiduidade legislativa`;
            }

            const aiMessage = {
                id: `ai-${Date.now()}`,
                sender: "huari",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                text: responseText,
            };

            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 800);
    };

    const handleClearChat = () => {
        setMessages(INITIAL_MESSAGES);
    };

    const handleCopy = (id, text) => {
        navigator.clipboard?.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSidebarNavigate = (label) => {
        if (label === "Home") onNavigateToHome?.();
        else if (label === "Lawmakers") onNavigateToParliamentarians?.();
        else if (label === "Learn") onNavigateToLearn?.();
    };

    return (
        <div className="chat-layout">
            {/* Sidebar Fixa à Esquerda */}
            <div className="chat-sidebar-wrapper">
                <SideBar
                    activeItem="Chat Huari"
                    onNavigate={handleSidebarNavigate}
                    onLogout={onNavigateToLogin}
                    onSettings={() => console.log("Configurações")}
                />
            </div>

            {/* Painel do Chat */}
            <main className="chat-main">
                {/* Header Superior do Chat */}
                <header className="chat-header">
                    <div className="chat-header-left">
                        <div className="chat-agent-avatar">
                            <img src={logoHuari} alt="Huari IA" />
                            <span className="online-indicator" title="IA Ativa" />
                        </div>
                        <div className="chat-agent-meta">
                            <div className="agent-name-row">
                                <h1>Huari Cívica</h1>
                                <span className="agent-badge">IA Especialista</span>
                            </div>
                            <p>Inteligência de Dados Abertos e Legislação Brasileira</p>
                        </div>
                    </div>

                    <div className="chat-header-actions">
                        <button
                            type="button"
                            className="chat-header-btn"
                            onClick={handleClearChat}
                            title="Reiniciar conversa"
                        >
                            <RiRefreshLine size={18} />
                            <span>Nova Conversa</span>
                        </button>
                    </div>
                </header>

                {/* Área de Mensagens com Scroll */}
                <div className="chat-body">
                    {/* Alerta de transparência / cívico */}
                    <div className="chat-transparency-banner">
                        <RiInformationLine size={20} />
                        <p>
                            As respostas da Huari são fundamentadas em fontes de dados abertos oficiais da Câmara, Senado e TCU com linguagem neutra e apartidária.
                        </p>
                    </div>

                    {/* Lista de Mensagens */}
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
                                            <div className="avatar-huari-icon">
                                                <RiSparkling2Line size={18} />
                                            </div>
                                        ) : (
                                            <div className="avatar-user-icon">
                                                <RiUser3Line size={18} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="bubble-content-box">
                                        <div className="bubble-meta">
                                            <span className="bubble-sender-name">
                                                {isHuari ? "Huari IA" : "Você"}
                                            </span>
                                            <span className="bubble-time">{msg.timestamp}</span>
                                        </div>

                                        <div className="bubble-text">
                                            {msg.text.split("\n\n").map((paragraph, idx) => {
                                                if (paragraph.startsWith("> ")) {
                                                    return (
                                                        <blockquote key={idx} className="bubble-quote">
                                                            {paragraph.replace("> ", "")}
                                                        </blockquote>
                                                    );
                                                }
                                                return <p key={idx}>{paragraph}</p>;
                                            })}
                                        </div>

                                        {isHuari && (
                                            <div className="bubble-actions">
                                                <button
                                                    type="button"
                                                    className="bubble-action-btn"
                                                    onClick={() => handleCopy(msg.id, msg.text)}
                                                    title="Copiar texto"
                                                >
                                                    {copiedId === msg.id ? (
                                                        <>
                                                            <RiCheckLine size={14} />
                                                            <span>Copiado!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RiFileCopyLine size={14} />
                                                            <span>Copiar</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bubble-action-btn"
                                                    title="Útil"
                                                >
                                                    <RiThumbUpLine size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="bubble-action-btn"
                                                    title="Não foi útil"
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
                                    <div className="avatar-huari-icon">
                                        <RiSparkling2Line size={18} />
                                    </div>
                                </div>
                                <div className="bubble-content-box typing-indicator-box">
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Sugestões Rápidas (Cards de Perguntas Frequentes) */}
                    {messages.length <= 2 && (
                        <div className="chat-suggestions-section">
                            <span className="suggestions-title">Perguntas sugeridas sobre transparência:</span>
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
                                            <div className="suggestion-icon">
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

                {/* Barra Inferior de Entrada de Mensagem */}
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
                            placeholder="Pergunte sobre deputados, gastos de gabinete, leis ou votações..."
                            value={inputPrompt}
                            onChange={(e) => setInputPrompt(e.target.value)}
                            disabled={isTyping}
                        />

                        <button
                            type="submit"
                            className="chat-send-btn"
                            disabled={!inputPrompt.trim() || isTyping}
                            aria-label="Enviar mensagem"
                        >
                            <RiSendPlane2Fill size={19} />
                            <span>Enviar</span>
                        </button>
                    </form>
                    <p className="chat-disclaimer">
                        A Huari pode cometer equívocos. Verifique informações críticas nos canais oficiais do Congresso Nacional.
                    </p>
                </div>
            </main>
        </div>
    );
}

