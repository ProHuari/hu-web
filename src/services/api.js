/**
 * Central API Client for Huari Civic Platform.
 * Connects to Spring Boot REST backend with Bearer token injection,
 * JSON handling, and 401 Unauthorized session clearance.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Get active token from localStorage or sessionStorage.
 */
export function getAuthToken() {
    return (
        localStorage.getItem('huari_token') ||
        sessionStorage.getItem('huari_token') ||
        null
    );
}

/**
 * Custom fetch wrapper with token injection and error handling.
 */
export async function apiClient(endpoint, options = {}) {
    const {
        method = 'GET',
        headers = {},
        body,
        params,
        ...customConfig
    } = options;

    let url = endpoint.startsWith('http')
        ? endpoint
        : `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

    if (params) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== '') {
                query.append(key, val);
            }
        });
        const queryString = query.toString();
        if (queryString) {
            url += `${url.includes('?') ? '&' : '?'}${queryString}`;
        }
    }

    const token = getAuthToken();
    const isFormData = body instanceof FormData;

    const requestHeaders = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
    };

    const config = {
        method,
        headers: requestHeaders,
        body: isFormData ? body : body ? JSON.stringify(body) : undefined,
        ...customConfig,
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            // Unauthorized - clear stored tokens
            localStorage.removeItem('huari_token');
            sessionStorage.removeItem('huari_token');
            localStorage.removeItem('huari_user');
            sessionStorage.removeItem('huari_user');

            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                window.location.href = '/login?expired=true';
            }
            throw new ApiError('Session expired. Please log in again.', 401);
        }

        if (response.status === 204) {
            return null;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const message = data?.message || data?.error || `HTTP error ${response.status}`;
            throw new ApiError(message, response.status, data);
        }

        return data;
    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }
        throw new ApiError(err.message || 'Network request failed', 0);
    }
}
