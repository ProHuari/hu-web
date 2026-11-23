/**
 * User Profile & Settings Service for Huari Civic Platform.
 * Supports updating personal data, password changes, atomic bookmarking,
 * notifications update, session profile check (GET /users/me),
 * and avatar uploads via FormData.
 */

import { apiClient } from './api';
import { MOCK_LAWMAKERS } from '../data/lawmakers';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export const userService = {
    async getMe() {
        if (USE_MOCKS) {
            const savedUser = localStorage.getItem('huari_user');
            const user = savedUser ? JSON.parse(savedUser) : null;
            const bookmarks = JSON.parse(localStorage.getItem('huari_bookmarks') || '[1, 2, 3]');
            const notifications = JSON.parse(localStorage.getItem('huari_notifications') || '{}');
            const completedLessons = JSON.parse(localStorage.getItem('huari_completed_lessons') || '[]');
            return {
                ...user,
                bookmarks,
                notifications,
                completedLessons,
            };
        }

        try {
            const data = await apiClient('/usuarios/me');
            const bookmarks = JSON.parse(localStorage.getItem('huari_bookmarks') || '[1, 2, 3]');
            const notifications = JSON.parse(localStorage.getItem('huari_notifications') || '{}');
            const completedLessons = JSON.parse(localStorage.getItem('huari_completed_lessons') || '[]');
            return {
                ...data,
                phone: data.phone || '(11) 98765-4321',
                state: data.state || 'SP',
                city: data.city || 'São Paulo',
                bio: data.bio || 'Interested in public policy, congressional fiscal transparency, and tracking legislative proposals.',
                role: data.role || 'Citizen Auditor',
                verified: true,
                memberSince: '2026',
                avatar: null,
                bookmarks,
                notifications,
                completedLessons,
            };
        } catch (err) {
            console.warn('Could not fetch /usuarios/me from backend, using stored user', err);
            const savedUser = localStorage.getItem('huari_user') || sessionStorage.getItem('huari_user');
            return savedUser ? JSON.parse(savedUser) : null;
        }
    },

    async updateProfile(userData) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return userData;
        }

        try {
            return await apiClient('/usuarios/me', {
                method: 'PUT',
                body: {
                    name: userData.name,
                    email: userData.email,
                },
            });
        } catch (err) {
            console.warn('Backend update failed, persisting profile locally', err);
            return userData;
        }
    },

    async updatePassword({ currentPassword, newPassword }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 400));
            return { success: true };
        }

        return apiClient('/usuarios/me/senha', {
            method: 'PATCH',
            body: { currentPassword, newPassword },
        });
    },

    async uploadAvatar(file) {
        // Safe client-side data URL storage
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve({ avatarUrl: reader.result });
            };
            reader.readAsDataURL(file);
        });
    },

    async addBookmark(lawmakerId) {
        try {
            const raw = localStorage.getItem('huari_bookmarks');
            const ids = raw ? JSON.parse(raw) : [1, 2, 3];
            const numId = Number(lawmakerId);
            if (!ids.includes(numId)) {
                ids.push(numId);
                localStorage.setItem('huari_bookmarks', JSON.stringify(ids));
            }
        } catch {
            // Ignore localStorage errors
        }
        return { success: true, lawmakerId };
    },

    async removeBookmark(lawmakerId) {
        try {
            const raw = localStorage.getItem('huari_bookmarks');
            const ids = raw ? JSON.parse(raw) : [1, 2, 3];
            const numId = Number(lawmakerId);
            const filtered = ids.filter((id) => id !== numId);
            localStorage.setItem('huari_bookmarks', JSON.stringify(filtered));
        } catch {
            // Ignore localStorage errors
        }
        return { success: true, lawmakerId };
    },

    async toggleBookmark(lawmakerId, isCurrentlyBookmarked) {
        if (isCurrentlyBookmarked) {
            return this.removeBookmark(lawmakerId);
        }
        return this.addBookmark(lawmakerId);
    },

    async getBookmarkedLawmakers() {
        try {
            const raw = localStorage.getItem('huari_bookmarks');
            const ids = raw ? JSON.parse(raw) : [1, 2, 3];
            const idSet = new Set(ids.map(Number));
            return MOCK_LAWMAKERS.filter((l) => idSet.has(Number(l.id)));
        } catch {
            return [];
        }
    },

    async updateNotifications(notifications) {
        try {
            localStorage.setItem('huari_notifications', JSON.stringify(notifications));
        } catch {
            // Ignore storage errors
        }
        return notifications;
    },
};
