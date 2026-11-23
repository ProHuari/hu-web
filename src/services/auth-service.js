/**
 * Authentication Service for Huari Civic Platform.
 * Supports Spring Boot endpoints (/auth/login, /auth/register, etc.)
 * with seamless VITE_USE_MOCKS fallback and role normalization.
 */

import { apiClient } from './api';
import { normalizeRole } from '../utils/roles';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

function buildMockUserFromEmail(email) {
    const isAdminEmail = email.toLowerCase().includes('admin');
    const derivedName = email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
        id: isAdminEmail ? 'usr-admin-1' : 'usr-1',
        name: derivedName || (isAdminEmail ? 'Huari Admin' : 'Carlos Oliveira'),
        email,
        phone: '(11) 98765-4321',
        state: isAdminEmail ? 'DF' : 'SP',
        city: isAdminEmail ? 'Brasília' : 'São Paulo',
        bio: isAdminEmail
            ? 'Platform curriculum coordinator and civic education administrator.'
            : 'Interested in public policy, congressional fiscal transparency, and tracking legislative proposals.',
        role: isAdminEmail ? 'ADMIN' : 'STUDENT',
        verified: true,
        memberSince: 'October 2026',
        avatar: null,
    };
}

export const authService = {
    async login({ email, password, rememberMe = true }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 350));
            if (!email || !password) {
                throw new Error('Please provide both email and password.');
            }
            const mockUser = buildMockUserFromEmail(email);
            const mockToken = `mock-jwt-token-${Date.now()}`;
            const mockRefreshToken = `mock-refresh-token-${Date.now()}`;
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('huari_token', mockToken);
            storage.setItem('huari_refresh_token', mockRefreshToken);
            return { user: mockUser, token: mockToken, refreshToken: mockRefreshToken, rememberMe };
        }

        const data = await apiClient('/auth/login', {
            method: 'POST',
            body: { email, password },
        });

        const normalizedRole = normalizeRole(data?.role);
        const storage = rememberMe ? localStorage : sessionStorage;
        const otherStorage = rememberMe ? sessionStorage : localStorage;

        otherStorage.removeItem('huari_token');
        otherStorage.removeItem('huari_refresh_token');
        otherStorage.removeItem('huari_user_role');

        if (data?.token) {
            storage.setItem('huari_token', data.token);
            if (data.refreshToken) {
                storage.setItem('huari_refresh_token', data.refreshToken);
            }
            storage.setItem('huari_user_role', normalizedRole);
        }

        const user = {
            id: String(data.userId || 'usr-1'),
            name:
                data.name ||
                email
                    .split('@')[0]
                    .replace(/[._-]/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase()),
            email,
            role: normalizedRole,
            phone: data.phone || '',
            state: data.state || 'DF',
            city: data.city || 'Brasília',
            bio: data.bio || 'Citizen auditor on the Huari platform.',
            verified: true,
            memberSince: '2026',
            avatar: data.avatar || null,
        };

        return { ...data, user, rememberMe };
    },

    async register({ name, email, password }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 450));
            const mockUser = {
                id: `usr-${Date.now()}`,
                name,
                email,
                phone: '',
                state: 'DF',
                city: 'Brasília',
                bio: 'New citizen auditor on the Huari platform.',
                role: 'STUDENT',
                verified: false,
                memberSince: 'November 2026',
                avatar: null,
            };
            const mockToken = `mock-jwt-token-${Date.now()}`;
            const mockRefreshToken = `mock-refresh-token-${Date.now()}`;
            localStorage.setItem('huari_token', mockToken);
            localStorage.setItem('huari_refresh_token', mockRefreshToken);
            return { user: mockUser, token: mockToken, refreshToken: mockRefreshToken };
        }

        await apiClient('/usuarios', {
            method: 'POST',
            body: { name, email, password },
        });

        return this.login({ email, password, rememberMe: true });
    },

    async requestPasswordReset(email) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 450));
            return { success: true, message: 'Reset instructions dispatched.' };
        }

        return apiClient('/auth/forgot-password', {
            method: 'POST',
            body: { email },
        });
    },

    async resetPassword({ token, newPassword }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return { success: true, message: 'Password successfully updated.' };
        }

        return apiClient('/auth/reset-password', {
            method: 'POST',
            body: { token, newPassword },
        });
    },
};
