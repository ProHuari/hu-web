/**
 * Civic AI Assistant Service for Huari Platform.
 * Supports Spring Boot /ia/tutor and /historico-ia endpoints with client-side fallback knowledge base.
 */

import { apiClient } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const KNOWLEDGE_RESPONSES = {
    expenses: `A **Cota para o Exercício da Atividade Parlamentar (CEAP)** é uma verba pública mensal destinada a deputados e senadores para cobrir despesas diretamente vinculadas ao trabalho legislativo.

Entre os gastos amparados pela cota estão a **divulgação da atividade parlamentar** por meio de relatórios e canais institucionais, a emissão de **passagens aéreas e hospedagem** para atuação entre Brasília e o estado de origem, a **locação de veículos e combustíveis** em agendas regionais e a contratação de **consultorias e pesquisas técnicas** que apoiam a elaboração de projetos de lei.

> **Nota de Transparência:** Cada nota fiscal, recibo e CNPJ contratado compõe o patrimônio de dados abertos da sociedade e pode ser verificado integralmente nos portais da Câmara e do Senado.`,

    pec: `Uma **Proposta de Emenda à Constituição (PEC)** modifica diretamente o texto constitucional de 1988 e por isso atravessa o rito mais rigoroso do Parlamento brasileiro.

A apresentação do texto exige o apoio mínimo de **um terço da Câmara (171 deputados) ou do Senado (27 senadores)**, além da possibilidade de iniciativa pelo Presidente da República ou por mais da metade das Assembleias Legislativas. Na sequência, a proposta passa pela **Comissão de Constituição e Justiça (CCJ)** para verificação das cláusulas pétreas e segue para uma **Comissão Especial** dedicada ao debate de mérito. Para ser aprovada, precisa conquistar **três quintos dos votos** (308 deputados e 49 senadores) em dois turnos de votação em cada Casa.

Após a aprovação bicameral, a emenda é promulgada diretamente pelas Mesas da Câmara e do Senado, entrando em vigor sem necessidade de sanção presidencial.`,

    quotient: `Nas eleições para Deputado Federal, Deputado Estadual e Vereador, o Brasil adota o **sistema proporcional de lista aberta**, pensado para refletir a pluralidade de ideias da sociedade no Parlamento.

O cálculo começa pelo **Quociente Eleitoral (QE)**, obtido ao dividir o total de votos válidos pelo número de cadeiras em disputa. Em seguida, calcula-se o **Quociente Partidário (QP)** dividindo a votação acumulada por cada partido pelo QE, o que define quantas vagas diretas a legenda conquistou. Quando restam cadeiras a preencher, a **distribuição das sobras** aplica a regra da maior média entre os partidos que superaram o desempenho mínimo exigido.

Dessa forma, o voto dado a um candidato fortalece simultaneamente sua candidatura individual e a bancada do partido ou federação.`,

    auditing: `Acompanhar de perto o mandato de deputados e senadores é um direito cidadão amparado por ferramentas públicas abertas e acessíveis.

Nos **Portais de Transparência da Câmara e do Senado**, você encontra o histórico completo de reembolsos da CEAP com notas fiscais digitalizadas e o registro de presença em plenário. Aqui na **Plataforma Huari**, reunimos essas informações em painéis visuais claros que cruzam votações nominais, frequência e despesas de gabinete. Para investigar repasses federais e emendas na sua cidade, o **Portal da Transparência da CGU** detalha contratos e convênios, enquanto a **Lei de Acesso à Informação (LAI — Lei 12.527/11)** garante o direito de solicitar documentos oficiais a qualquer órgão público com resposta em até 20 dias.`,
};

function getMockResponse(query) {
    const lowerQuery = query.toLowerCase();

    if (
        lowerQuery.includes('expense') ||
        lowerQuery.includes('quota') ||
        lowerQuery.includes('ceap') ||
        lowerQuery.includes('spending') ||
        lowerQuery.includes('cost') ||
        lowerQuery.includes('despesa') ||
        lowerQuery.includes('gasto') ||
        lowerQuery.includes('cota')
    ) {
        return KNOWLEDGE_RESPONSES.expenses;
    }
    if (
        lowerQuery.includes('pec') ||
        lowerQuery.includes('emenda') ||
        lowerQuery.includes('amendment') ||
        lowerQuery.includes('bill') ||
        lowerQuery.includes('constitution') ||
        lowerQuery.includes('lei') ||
        lowerQuery.includes('projeto') ||
        lowerQuery.includes('tramita')
    ) {
        return KNOWLEDGE_RESPONSES.pec;
    }
    if (
        lowerQuery.includes('quotient') ||
        lowerQuery.includes('election') ||
        lowerQuery.includes('vote') ||
        lowerQuery.includes('proportional') ||
        lowerQuery.includes('quociente') ||
        lowerQuery.includes('partid') ||
        lowerQuery.includes('voto')
    ) {
        return KNOWLEDGE_RESPONSES.quotient;
    }
    if (
        lowerQuery.includes('audit') ||
        lowerQuery.includes('citizen') ||
        lowerQuery.includes('oversight') ||
        lowerQuery.includes('track') ||
        lowerQuery.includes('lai') ||
        lowerQuery.includes('fiscalizar') ||
        lowerQuery.includes('nota fiscal') ||
        lowerQuery.includes('auditar')
    ) {
        return KNOWLEDGE_RESPONSES.auditing;
    }

    return `Olá! Sou a assistente de inteligência cívica e transparência da **Huari**.\n\nMinha missão é traduzir dados públicos da Câmara dos Deputados, do Senado Federal e do TCU em informações claras para apoiar o acompanhamento cidadão.\n\nPodemos conversar sobre o detalhamento de notas fiscais e reembolsos da **Cota Parlamentar (CEAP)**, o rito de tramitação e votação de **Projetos de Lei e PECs**, os registros de **presença e votações nominais** em plenário ou caminhos práticos para **fiscalizar contratos e emendas orçamentárias** no seu estado e município.`;
}

export const chatService = {
    async sendMessage(query, history = []) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return { response: getMockResponse(query) };
        }

        try {
            // Prioridade 1: Endpoint /ia/tutor (público, Gemini 2.5 Flash + RAG)
            const data = await apiClient('/ia/tutor', {
                method: 'POST',
                body: {
                    question: query,
                    subject: 'Auditoria Cívica e Transparência',
                },
            });

            if (data?.answer || data?.response) {
                return {
                    response: data.answer || data.response,
                };
            }
        } catch (err) {
            console.warn('Backend /ia/tutor indisponível, tentando /historico-ia', err);
            try {
                // Prioridade 2: /historico-ia caso o usuário esteja autenticado
                const histData = await apiClient('/historico-ia', {
                    method: 'POST',
                    body: { question: query, history },
                });

                if (histData?.answer || histData?.response) {
                    return {
                        response: histData.answer || histData.response,
                    };
                }
            } catch (fallbackErr) {
                console.warn('Backend IA indisponível, ativando base cívica de contingência', fallbackErr);
            }
        }

        return { response: getMockResponse(query) };
    },
};
