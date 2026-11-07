/**
 * Currency, number, and percentage formatting utilities for Brazilian Open Data.
 */

/**
 * Format a numeric value as Brazilian Real (BRL).
 * @param {number|string} value - The numeric value to format.
 * @returns {string} Formatted currency string (e.g., "R$ 31.800,00").
 */
export function formatBRL(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(num);
}

/**
 * Format a number as compact currency (e.g., "R$ 31.8k" or "R$ 4.2M").
 * @param {number|string} value
 * @returns {string}
 */
export function formatCompactBRL(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return 'R$ 0';
    if (Math.abs(num) >= 1_000_000_000) {
        return `R$ ${(num / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
    }
    if (Math.abs(num) >= 1_000_000) {
        return `R$ ${(num / 1_000_000).toFixed(1).replace('.0', '')}M`;
    }
    if (Math.abs(num) >= 1_000) {
        return `R$ ${(num / 1_000).toFixed(1).replace('.0', '')}k`;
    }
    return formatBRL(num);
}

/**
 * Format a percentage value (e.g. 0.94 -> "94%" or 94 -> "94%").
 * @param {number|string} value
 * @param {boolean} isDecimal - Whether value is in range 0-1 (e.g. 0.88).
 * @returns {string}
 */
export function formatPercent(value, isDecimal = false) {
    const num = Number(value);
    if (Number.isNaN(num)) return '0%';
    const pct = isDecimal ? num * 100 : num;
    return `${Math.round(pct)}%`;
}

/**
 * Format a number with compact suffix (e.g., 1240 -> "1.24k").
 * @param {number|string} value
 * @returns {string}
 */
export function formatCompactNumber(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return '0';
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(num);
}

