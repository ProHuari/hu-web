/**
 * Utility functions for exporting tabular data into CSV format.
 * Encodes with UTF-8 Byte Order Mark (\uFEFF) for native compatibility
 * with Microsoft Excel, Apple Numbers, and Google Sheets.
 */

/**
 * Sanitize text to form valid, normalized filenames (e.g. "gastos_deputado_nome_2026.csv").
 * Removes accents and special characters.
 * @param {string} text
 * @returns {string}
 */
export function sanitizeFilename(text) {
    return String(text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Strip diacritics
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric chars with underscore
        .replace(/^_+|_+$/g, ''); // Trim leading and trailing underscores
}

/**
 * Formats a single row of values into a standard RFC 4180 CSV line.
 * Escapes quotes and wraps fields containing commas, quotes, or newlines.
 * @param {Array<string|number>} fields
 * @returns {string}
 */
export function formatCsvRow(fields) {
    return fields
        .map((field) => {
            if (field === null || field === undefined) {
                return '""';
            }
            const str = String(field);
            if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return `"${str}"`;
        })
        .join(',');
}

/**
 * Triggers a client-side file download for CSV content using Blob and object URL.
 * Prepends \uFEFF (UTF-8 BOM) so Excel on Windows renders UTF-8 correctly without encoding glitches.
 * @param {string} filename - Target filename (e.g. "gastos_tabata_amaral_2026.csv")
 * @param {string} csvContent - Raw CSV text
 * @returns {boolean} Success status
 */
export function downloadCsv(filename, csvContent) {
    if (typeof window === 'undefined' || !filename || !csvContent) {
        return false;
    }

    try {
        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.setAttribute('href', url);
        link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
    } catch (err) {
        console.error('Failed to trigger CSV download', err);
        return false;
    }
}

/**
 * Generic tabular CSV export helper.
 * @param {Object} options
 * @param {string} options.filename
 * @param {Array<string>} [options.headers]
 * @param {Array<Array<any>>} options.rows
 * @returns {boolean}
 */
export function exportToCsv({ filename, headers = [], rows = [] }) {
    if (!rows || rows.length === 0) {
        return false;
    }

    const headerLine = headers.length > 0 ? `${formatCsvRow(headers)}\n` : '';
    const dataLines = rows.map((r) => formatCsvRow(r)).join('\n');
    return downloadCsv(filename, `${headerLine}${dataLines}`);
}

/**
 * Specialized exporter for parliamentary CEAP expense records.
 * Generates dynamic filename: gastos_<nome_parlamentar>_<ano>.csv
 * Standard headers: Data, Categoria, Fornecedor, Valor, Percentual da Cota
 *
 * @param {Object} params
 * @param {Array<Object>} params.expenses - List of expenses
 * @param {string} params.lawmakerName - Name of lawmaker (e.g. "Eduardo Bolsonaro")
 * @param {string|number} params.year - Year or label (e.g. "Quota 2026" or 2026)
 * @returns {boolean} Success status
 */
export function exportExpensesToCsv({ expenses = [], lawmakerName = 'parlamentar', year = '2026' }) {
    if (!Array.isArray(expenses) || expenses.length === 0) {
        return false;
    }

    const yearClean = String(year).replace(/\D+/g, '') || new Date().getFullYear();
    const nameClean = sanitizeFilename(lawmakerName) || 'parlamentar';
    const filename = `gastos_${nameClean}_${yearClean}.csv`;

    const headers = ['Data', 'Categoria', 'Fornecedor', 'Valor', 'Percentual da Cota'];

    const rows = expenses.map((item) => {
        const date = item.date || item.mes || yearClean;
        const category = item.category || item.title || 'Despesa de Gabinete (CEAP)';
        const supplier = item.supplier || item.fornecedor || 'Diversos Fornecedores Credenciados';
        const amount = item.amount || (item.value ? `R$ ${item.value}` : 'R$ 0,00');
        const percentage = item.percentage != null ? `${item.percentage}%` : 'N/A';

        return [date, category, supplier, amount, percentage];
    });

    return exportToCsv({ filename, headers, rows });
}
