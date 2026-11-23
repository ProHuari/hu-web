/**
 * Civic AI Assistant Service for Huari Platform.
 * Integrates with Spring Boot /ia/tutor, /ia/explicar-projeto-lei, and /historico-ia.
 */

import { apiClient, getAuthToken } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const DEMO_KNOWLEDGE_RESPONSES = {
    expenses: `A **Cota para o Exercício da Atividade Parlamentar (CEAP)** é uma verba pública mensal destinada a deputados e senadores para cobrir despesas diretamente vinculadas ao trabalho legislativo.

Entre os gastos amparados pela cota estão a **divulgação da atividade parlamentar**, a emissão de **passagens aéreas e hospedagem** entre Brasília e o estado de origem, a **locação de veículos e combustíveis** e a contratação de **consultorias técnicas** de apoio ao mandato.`,

    pec: `Uma **Proposta de Emenda à Constituição (PEC)** modifica diretamente o texto constitucional de 1988 e exige aprovação por **três quintos dos votos** (308 deputados e 49 senadores) em dois turnos em cada Casa antes de ser promulgada pelas Mesas do Congresso.`,

    quotient: `Nas eleições proporcionais, o **Quociente Eleitoral (QE)** resulta da divisão dos votos válidos pelo número de cadeiras em disputa. Cada partido conquista vagas diretas conforme seu **Quociente Partidário (QP)** e participa da distribuição das sobras pela maior média.`,

    auditing: `Nos portais da **Câmara dos Deputados**, do **Senado Federal** e da **Plataforma Huari**, você acompanha notas fiscais da CEAP, projetos de lei e repasses federais com respaldo da **Lei de Acesso à Informação (Lei 12.527/2011)**.`,
};

function getDemoResponse(query) {
    const lowerQuery = String(query || '').toLowerCase();
    if (lowerQuery.includes('cota') || lowerQuery.includes('ceap') || lowerQuery.includes('despesa')) {
        return DEMO_KNOWLEDGE_RESPONSES.expenses;
    }
    if (lowerQuery.includes('pec') || lowerQuery.includes('emenda') || lowerQuery.includes('projeto') || lowerQuery.includes('lei')) {
        return DEMO_KNOWLEDGE_RESPONSES.pec;
    }
    if (lowerQuery.includes('quociente') || lowerQuery.includes('voto') || lowerQuery.includes('elei')) {
        return DEMO_KNOWLEDGE_RESPONSES.quotient;
    }
    if (lowerQuery.includes('fiscalizar') || lowerQuery.includes('lai') || lowerQuery.includes('auditar')) {
        return DEMO_KNOWLEDGE_RESPONSES.auditing;
    }
    return `Olá! Posso explicar regras da **Cota Parlamentar (CEAP)**, tramitação de **Projetos de Lei e PECs**, orçamento público ou caminhos práticos de fiscalização cidadã.`;
}

export const chatService = {
    async sendMessage(query, history = []) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 400));
            return { response: getDemoResponse(query) };
        }

        const hasToken = Boolean(getAuthToken());

        try {
            // Prioridade 1: Se usuário autenticado, /historico-ia registra a pergunta com contexto RAG no MySQL
            if (hasToken) {
                const histData = await apiClient('/historico-ia', {
                    method: 'POST',
                    body: { question: query },
                });
                if (histData?.answer || histData?.response) {
                    return {
                        response: histData.answer || histData.response,
                        mode: histData.mode || 'LIVE',
                        id: histData.id,
                    };
                }
            }
        } catch {
            // Continua para o endpoint público /ia/tutor caso o registro autenticado falhe
        }

        const data = await apiClient('/ia/tutor', {
            method: 'POST',
            body: {
                question: query,
                history: Array.isArray(history) ? history.slice(-6) : [],
                subject: 'Auditoria Cívica e Transparência',
            },
        });

        const answer = data?.answer || data?.response;
        if (!answer) {
            throw new Error('A assistente não retornou resposta no momento.');
        }

        return {
            response: answer,
            mode: data?.mode,
            disclaimer: data?.disclaimer,
        };
    },

    async explainBill({ billCode, summary, title }) {
        const data = await apiClient('/ia/explicar-projeto-lei', {
            method: 'POST',
            body: {
                billCode,
                summary,
                authorOrTopic: title || 'Legislativo Brasileiro',
            },
        });
        return data;
    },

    async getHistory(page = 0, size = 20) {
        if (USE_MOCKS || !getAuthToken()) {
            return [];
        }
        const res = await apiClient('/historico-ia', {
            params: { page, size },
        });
        return res?.content ?? (Array.isArray(res) ? res : []);
    },
};
