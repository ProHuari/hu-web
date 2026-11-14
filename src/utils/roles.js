/**
 * Role normalization and authorization helpers.
 * Normalizes backend Spring Security roles (e.g. "ROLE_ADMIN", "ADMIN")
 * into consistent frontend role identifiers.
 */

export function normalizeRole(role) {
    if (!role || typeof role !== 'string') return 'STUDENT';
    const cleaned = role.trim().toUpperCase().replace(/^ROLE_/, '');
    if (cleaned === 'ADMIN' || cleaned === 'ADMINISTRATOR') return 'ADMIN';
    return cleaned;
}

export function isAdminRole(role) {
    return normalizeRole(role) === 'ADMIN';
}

export function getDisplayRole(role) {
    const normalized = normalizeRole(role);
    if (normalized === 'ADMIN') return 'Platform Admin';
    if (normalized === 'STUDENT') return 'Citizen Auditor';
    return role || 'Citizen Auditor';
}

