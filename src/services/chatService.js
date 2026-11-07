/**
 * Civic AI Assistant Service for Huari Platform.
 * Supports Spring Boot /chat endpoint with client-side fallback knowledge base.
 */

import { apiClient } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

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

export const chatService = {
    async sendMessage(query) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 600));
            const lowerQuery = query.toLowerCase();

            if (lowerQuery.includes('expense') || lowerQuery.includes('quota') || lowerQuery.includes('ceap') || lowerQuery.includes('spending') || lowerQuery.includes('cost')) {
                return { response: KNOWLEDGE_RESPONSES.expenses };
            }
            if (lowerQuery.includes('pec') || lowerQuery.includes('amendment') || lowerQuery.includes('bill') || lowerQuery.includes('constitution') || lowerQuery.includes('law')) {
                return { response: KNOWLEDGE_RESPONSES.pec };
            }
            if (lowerQuery.includes('quotient') || lowerQuery.includes('election') || lowerQuery.includes('vote') || lowerQuery.includes('proportional')) {
                return { response: KNOWLEDGE_RESPONSES.quotient };
            }
            if (lowerQuery.includes('audit') || lowerQuery.includes('citizen') || lowerQuery.includes('oversight') || lowerQuery.includes('track') || lowerQuery.includes('lai')) {
                return { response: KNOWLEDGE_RESPONSES.auditing };
            }

            return {
                response: `Thank you for your question regarding: "${query}".\n\nAs the civic intelligence assistant for **Huari**, I am designed to synthesize public records from the Chamber of Deputies, Federal Senate, and the Federal Court of Accounts (TCU).\n\nYou can explore lawmakers directly in the **Lawmakers** section, inspect courses under **Learn**, or ask about:\n* Detailed expense voucher categories for specific lawmakers\n* How legislative bills (PL, PLP, PEC, and MPV) become law\n* How to inspect parliamentary attendance and voting discipline`,
            };
        }

        return apiClient('/chat', {
            method: 'POST',
            body: { message: query },
        });
    },
};
