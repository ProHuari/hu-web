/**
 * Central API Client for Huari Civic Platform.
 * Connects to Spring Boot REST backend with Bearer token injection,
 * JSON handling, silent refresh token rotation, and 401 recovery queue.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api/v1';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Get active access token from localStorage or sessionStorage.
 */
export function getAuthToken() {
    return (
        localStorage.getItem('huari_token') ||
        sessionStorage.getItem('huari_token') ||
        null
    );
}

/**
 * Get active refresh token from localStorage or sessionStorage.
 */
export function getRefreshToken() {
    return (
        localStorage.getItem('huari_refresh_token') ||
        sessionStorage.getItem('huari_refresh_token') ||
        null
    );
}

/**
 * Update stored tokens in whichever storage engine holds the session.
 */
export function setAuthTokens(token, refreshToken) {
    const isLocal = Boolean(
        localStorage.getItem('huari_token') ||
        localStorage.getItem('huari_refresh_token')
    );
    const storage = isLocal ? localStorage : sessionStorage;

    if (token) {
        storage.setItem('huari_token', token);
    }
    if (refreshToken) {
        storage.setItem('huari_refresh_token', refreshToken);
    }
}

/**
 * Clear all stored session keys across both storage engines.
 */
export function clearAuthSession() {
    localStorage.removeItem('huari_token');
    sessionStorage.removeItem('huari_token');
    localStorage.removeItem('huari_user');
    sessionStorage.removeItem('huari_user');
    localStorage.removeItem('huari_refresh_token');
    sessionStorage.removeItem('huari_refresh_token');
    localStorage.removeItem('huari_user_role');
    sessionStorage.removeItem('huari_user_role');
}

/**
 * Safely redirect to login page when session has expired.
 */
export function redirectToLogin() {
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=true';
    }
}

// Concurrency control for silent refresh
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });
    failedQueue = [];
}

/**
 * Custom fetch wrapper with token injection, silent refresh rotation,
 * and pending request queueing on 401 Unauthorized responses.
 */
export async function apiClient(endpoint, options = {}) {
    const {
        method = 'GET',
        headers = {},
        body,
        params,
        _retry = false,
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
            // 1. Credentials error on login endpoint: do not refresh, forward message
            if (endpoint.includes('/auth/login')) {
                const data = await response.json().catch(() => null);
                const message = data?.message || 'Incorrect email or password.';
                throw new ApiError(message, 401, data);
            }

            // 2. Failure during refresh itself or already retried: terminate session
            if (endpoint.includes('/auth/refresh') || _retry) {
                clearAuthSession();
                redirectToLogin();
                throw new ApiError('Session expired. Please log in again.', 401);
            }

            // 3. Check for available refresh token
            const currentRefreshToken = getRefreshToken();
            if (!currentRefreshToken) {
                clearAuthSession();
                redirectToLogin();
                throw new ApiError('Session expired. Please log in again.', 401);
            }

            // 4. If refresh is already in progress, enqueue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((newAccessToken) => {
                    return apiClient(endpoint, {
                        ...options,
                        _retry: true,
                        headers: {
                            ...headers,
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                    });
                });
            }

            // 5. Initiate silent token refresh
            isRefreshing = true;

            try {
                let newAccessToken = null;
                let newRefreshToken = null;

                if (USE_MOCKS && currentRefreshToken.startsWith('mock-')) {
                    // Offline development mock refresh
                    await new Promise((r) => setTimeout(r, 200));
                    newAccessToken = `mock-jwt-token-${Date.now()}`;
                    newRefreshToken = `mock-refresh-token-${Date.now()}`;
                } else {
                    const refreshUrl = `${API_BASE_URL.replace(/\/+$/, '')}/auth/refresh`;
                    const refreshResponse = await fetch(refreshUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({ refreshToken: currentRefreshToken }),
                    });

                    if (!refreshResponse.ok) {
                        const errData = await refreshResponse.json().catch(() => null);
                        throw new ApiError(
                            errData?.message || 'Failed to refresh authentication token',
                            refreshResponse.status,
                            errData
                        );
                    }

                    const refreshData = await refreshResponse.json().catch(() => null);
                    newAccessToken = refreshData?.token || refreshData?.accessToken;
                    newRefreshToken = refreshData?.refreshToken || currentRefreshToken;
                }

                if (!newAccessToken) {
                    throw new ApiError('Invalid token response from refresh endpoint', 401);
                }

                // Persist rotated tokens
                setAuthTokens(newAccessToken, newRefreshToken);

                // Notify all queued requests waiting on this refresh
                processQueue(null, newAccessToken);

                // Retry the original request with the fresh token
                return apiClient(endpoint, {
                    ...options,
                    _retry: true,
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${newAccessToken}`,
                    },
                });
            } catch (refreshErr) {
                processQueue(refreshErr, null);
                clearAuthSession();
                redirectToLogin();
                throw new ApiError('Session expired. Please log in again.', 401);
            } finally {
                isRefreshing = false;
            }
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
