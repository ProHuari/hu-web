/**
 * Civic AI Assistant Service for Huari Platform.
 * Supports Spring Boot /ia/tutor and /historico-ia endpoints with client-side fallback knowledge base.
 */

import { apiClient } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const KNOWLEDGE_RESPONSES = {
    expenses: `A **Cota para o Exercício da Atividade Parlamentar (CEAP)** é um benefício mensal concedido a deputados e senadores para custear despesas exclusivamente ligadas ao mandato.

As principais categorias de gastos permitidas incluem:
1. **Divulgação da Atividade Parlamentar:** Produção de vídeos, relatórios de prestação de contas, informativos e gerenciamento de redes sociais.
2. **Passagens Aéreas e Hospedagem:** Deslocamento regular entre a base eleitoral do parlamentar e Brasília.
3. **Locação de Veículos e Combustíveis:** Transporte terrestre para vistorias e compromissos no estado de origem.
4. **Consultorias e Pareceres Técnicos:** Pesquisas especializadas de apoio à redação de projetos de lei e fiscalização de políticas públicas.

> **Nota de Transparência:** Todas as notas fiscais, recibos e CNPJs dos fornecedores contratados são dados públicos e ficam disponíveis nos Portais de Dados Abertos da Câmara e do Senado!`,

    pec: `Uma **Proposta de Emenda à Constituição (PEC)** altera o texto da Constituição de 1988 e segue o rito legislativo mais exigente do país:

1. **Iniciativa:** Deve ser proposta por no mínimo 1/3 dos deputados (171) ou senadores (27), pelo Presidente da República ou por mais da metade das Assembleias Legislativas.
2. **Comissão de Constituição e Justiça (CCJ):** Avalia a admissibilidade jurídica e o respeito às cláusulas pétreas.
3. **Comissão Especial:** Debate o mérito do texto e emendas sugeridas por deputados.
4. **Dois Turnos com Quórum Qualificado:** Precisa ser aprovada por **3/5 dos votos** (308 na Câmara e 49 no Senado) em dois turnos de votação em cada uma das Casas.

Não há sanção nem veto presidencial: a emenda promulgada pelas Mesas da Câmara e do Senado entra em vigor imediatamente!`,

    quotient: `Nas eleições para Deputado Federal, Deputado Estadual e Vereador no Brasil, o sistema adotado é o **proporcional de lista aberta**:

* **Quociente Eleitoral (QE):** Divide-se o número de votos válidos da eleição pelo número de vagas disponíveis na Casa.
* **Quociente Partidário (QP):** Divide-se o total de votos recebidos por um partido pelo QE. O resultado inteiro indica o número de vagas diretas conquistadas pela legenda.
* **Distribuição das Sobras:** As vagas remanescentes são distribuídas pela regra da maior média (D'Hondt) entre os partidos que atingiram a cláusula de barreira mínima.

Esse cálculo assegura que a composição do Parlamento represente de forma plural o percentual ideológico escolhido pela população!`,

    auditing: `Qualquer cidadão pode auditar parlamentares usando dados abertos e instrumentos institucionais:

1. **Portais de Transparência da Câmara e do Senado:** Consulta aberta de reembolsos da CEAP, notas fiscais digitalizadas e presenças em votações nominais.
2. **Plataforma Huari:** Cruzamos votações nominais, índice de presença e despesas em gráficos acessíveis para facilitar o monitoramento.
3. **Portal da Transparência da CGU:** Consulta a contratos públicos, emendas parlamentares e transferências de recursos federais.
4. **Lei de Acesso à Informação (LAI - Lei 12.527/11):** Permite a qualquer pessoa solicitar documentos e explicações a órgãos públicos com prazo legal máximo de resposta de 20 dias.`,
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

    return `Olá! Sou a assistente de inteligência cívica e transparência da **Huari**.\n\nMinha missão é analisar dados públicos da Câmara dos Deputados, Senado Federal e TCU para fortalecer o controle social e a fiscalização dos gastos públicos.\n\nVocê pode me perguntar sobre:\n* Detalhamento de notas fiscais e reembolsos da Cota Parlamentar (CEAP)\n* Como tramitam e são votados Projetos de Lei (PLs) e PECs\n* Como consultar presença e fidelidade partidária em votações nominais\n* Como fiscalizar contratos e emendas orçamentárias no seu estado ou município.`;
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
