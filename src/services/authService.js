/**
 * Authentication Service for Huari Civic Platform.
 * Supports Spring Boot endpoints (/auth/login, /auth/register, etc.)
 * with seamless VITE_USE_MOCKS fallback.
 */

import { apiClient } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const authService = {
    async login({ email, password, rememberMe = true }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 400));
            if (!email || !password) {
                throw new Error('Please provide both email and password.');
            }
            const mockUser = {
                id: 'usr-1',
                name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Carlos Oliveira',
                email,
                phone: '(11) 98765-4321',
                state: 'SP',
                city: 'São Paulo',
                bio: 'Interested in public policy, congressional fiscal transparency, and tracking legislative proposals.',
                role: 'Citizen Auditor',
                verified: true,
                memberSince: 'October 2026',
                avatar: null,
            };
            const mockToken = `mock-jwt-token-${Date.now()}`;
            return { user: mockUser, token: mockToken, rememberMe };
        }

        const data = await apiClient('/auth/login', {
            method: 'POST',
            body: { email, password },
        });

        if (data?.token) {
            localStorage.setItem('huari_token', data.token);
            if (data.refreshToken) {
                localStorage.setItem('huari_refresh_token', data.refreshToken);
            }
            if (data.role) {
                localStorage.setItem('huari_user_role', data.role);
            }
        }

        const user = {
            id: String(data.userId || 'usr-1'),
            name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            email,
            role: data.role || 'STUDENT',
            phone: '',
            state: 'DF',
            city: 'Brasília',
            bio: 'Citizen auditor on the Huari platform.',
            verified: true,
            memberSince: '2026',
            avatar: null,
        };

        return { ...data, user, rememberMe };
    },

    async register({ name, email, password }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const mockUser = {
                id: `usr-${Date.now()}`,
                name,
                email,
                phone: '',
                state: 'DF',
                city: 'Brasília',
                bio: 'New citizen auditor on the Huari platform.',
                role: 'Citizen Auditor',
                verified: false,
                memberSince: 'November 2026',
                avatar: null,
            };
            const mockToken = `mock-jwt-token-${Date.now()}`;
            return { user: mockUser, token: mockToken };
        }

        // hu-service creates user via POST /usuarios
        await apiClient('/usuarios', {
            method: 'POST',
            body: { name, email, password },
        });

        // Automatically log in with newly created credentials to receive token
        return this.login({ email, password, rememberMe: true });
    },

    async requestPasswordReset(email) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return { success: true, message: 'Reset instructions dispatched.' };
        }

        return apiClient('/auth/forgot-password', {
            method: 'POST',
            body: { email },
        });
    },

    async resetPassword({ token, newPassword }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 600));
            return { success: true, message: 'Password successfully updated.' };
        }

        return apiClient('/auth/reset-password', {
            method: 'POST',
            body: { token, newPassword },
        });
    },
};
