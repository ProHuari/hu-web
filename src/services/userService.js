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

        return apiClient('/users/me');
    },

    async updateProfile(userData) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return userData;
        }

        return apiClient('/users/me', {
            method: 'PUT',
            body: userData,
        });
    },

    async updatePassword({ currentPassword, newPassword }) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 400));
            return { success: true };
        }

        return apiClient('/users/me/password', {
            method: 'PUT',
            body: { currentPassword, newPassword },
        });
    },

    async uploadAvatar(file) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({ avatarUrl: reader.result });
                };
                reader.readAsDataURL(file);
            });
        }

        const formData = new FormData();
        formData.append('avatar', file);

        return apiClient('/users/me/avatar', {
            method: 'POST',
            body: formData,
        });
    },

    async addBookmark(lawmakerId) {
        if (USE_MOCKS) {
            return { success: true, lawmakerId };
        }

        return apiClient(`/users/me/bookmarks/${lawmakerId}`, {
            method: 'POST',
        });
    },

    async removeBookmark(lawmakerId) {
        if (USE_MOCKS) {
            return { success: true, lawmakerId };
        }

        return apiClient(`/users/me/bookmarks/${lawmakerId}`, {
            method: 'DELETE',
        });
    },

    async toggleBookmark(lawmakerId, isCurrentlyBookmarked) {
        if (isCurrentlyBookmarked) {
            return this.removeBookmark(lawmakerId);
        }
        return this.addBookmark(lawmakerId);
    },

    async getBookmarkedLawmakers() {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            try {
                const raw = localStorage.getItem('huari_bookmarks');
                const ids = raw ? JSON.parse(raw) : [1, 2, 3];
                const idSet = new Set(ids.map(Number));
                return MOCK_LAWMAKERS.filter((l) => idSet.has(Number(l.id)));
            } catch {
                return [];
            }
        }

        const res = await apiClient('/users/me/bookmarks');
        return Array.isArray(res) ? res : (res?.content ?? res?.items ?? []);
    },

    async updateNotifications(notifications) {
        if (USE_MOCKS) {
            return notifications;
        }

        return apiClient('/users/me/notifications', {
            method: 'PUT',
            body: notifications,
        });
    },
};
