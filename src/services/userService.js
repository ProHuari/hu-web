/**
 * User Profile & Settings Service for Huari Civic Platform.
 * Supports updating personal data, password changes, bookmarks sync,
 * and avatar uploads via FormData.
 */

import { apiClient } from './api';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const userService = {
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

    async syncBookmarks(bookmarkIds) {
        if (USE_MOCKS) {
            return bookmarkIds;
        }

        return apiClient('/users/me/bookmarks', {
            method: 'PUT',
            body: { bookmarks: bookmarkIds },
        });
    },
};
