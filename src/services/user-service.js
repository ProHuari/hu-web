/**
 * User Profile & Settings Service for Huari Civic Platform.
 * Fetches authenticated profile data (/usuarios/me), syncs course progress (/progresso-aulas),
 * resolves bookmarked parliamentarians against /transparencia/parlamentares,
 * and persists client-side profile preferences scoped per user.
 */

import { apiClient } from './api';
import { normalizeLawmaker } from './lawmakers-service';
import { MOCK_LAWMAKERS } from '../data/lawmakers';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

function readJsonStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function writeJsonStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore storage quota errors
    }
}

function getExtrasStorageKey(userId) {
    return userId ? `huari_profile_extras_${userId}` : 'huari_profile_extras';
}

function readStoredUserId() {
    const saved = readJsonStorage('huari_user', null);
    return saved?.id || null;
}

export const userService = {
    async getMe() {
        const defaultBookmarks = USE_MOCKS ? [1, 2, 3] : [];

        if (USE_MOCKS) {
            const savedUser = readJsonStorage('huari_user', null);
            return {
                ...savedUser,
                bookmarks: readJsonStorage('huari_bookmarks', defaultBookmarks),
                notifications: readJsonStorage('huari_notifications', {}),
                completedLessons: readJsonStorage('huari_completed_lessons', []),
            };
        }

        const [profileRes, progressRes] = await Promise.allSettled([
            apiClient('/usuarios/me'),
            apiClient('/progresso-aulas', { params: { page: 0, size: 200 } }),
        ]);

        if (profileRes.status === 'rejected') {
            const fallbackUser =
                readJsonStorage('huari_user', null) ||
                (() => {
                    try {
                        const s = sessionStorage.getItem('huari_user');
                        return s ? JSON.parse(s) : null;
                    } catch {
                        return null;
                    }
                })();
            if (fallbackUser) return fallbackUser;
            throw profileRes.reason;
        }

        const data = profileRes.value || {};
        const extras = readJsonStorage(getExtrasStorageKey(data.id), {});

        const rawProgress =
            progressRes.status === 'fulfilled'
                ? progressRes.value?.content ??
                  (Array.isArray(progressRes.value) ? progressRes.value : [])
                : [];

        const backendCompletedLessonIds = rawProgress
            .filter((item) => item?.status === 'COMPLETED' && item?.lessonId != null)
            .map((item) => String(item.lessonId));

        const localCompleted = readJsonStorage('huari_completed_lessons', []);
        const mergedCompleted = backendCompletedLessonIds.length > 0
            ? [...new Set(backendCompletedLessonIds)]
            : localCompleted;

        return {
            ...data,
            phone: extras.phone || data.phone || '',
            state: extras.state || data.state || '',
            city: extras.city || data.city || '',
            bio: extras.bio || data.bio || '',
            role: data.role || 'STUDENT',
            verified: true,
            memberSince: data.createdAt ? String(data.createdAt).slice(0, 4) : '2026',
            avatar: extras.avatar || data.avatar || null,
            bookmarks: readJsonStorage('huari_bookmarks', []),
            notifications: readJsonStorage('huari_notifications', {}),
            completedLessons: mergedCompleted,
        };
    },

    async updateProfile(userData) {
        if (USE_MOCKS) {
            await new Promise((resolve) => setTimeout(resolve, 300));
            return userData;
        }

        const updated = await apiClient('/usuarios/me', {
            method: 'PUT',
            body: {
                name: userData.name,
                email: userData.email,
            },
        });

        const userId = updated?.id || userData?.id || readStoredUserId();
        const currentExtras = readJsonStorage(getExtrasStorageKey(userId), {});
        writeJsonStorage(getExtrasStorageKey(userId), {
            ...currentExtras,
            phone: userData.phone ?? currentExtras.phone ?? '',
            state: userData.state ?? currentExtras.state ?? '',
            city: userData.city ?? currentExtras.city ?? '',
            bio: userData.bio ?? currentExtras.bio ?? '',
            avatar: userData.avatar ?? currentExtras.avatar ?? null,
        });

        return {
            ...updated,
            phone: userData.phone ?? currentExtras.phone ?? '',
            state: userData.state ?? currentExtras.state ?? '',
            city: userData.city ?? currentExtras.city ?? '',
            bio: userData.bio ?? currentExtras.bio ?? '',
        };
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
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const userId = readStoredUserId();
                const currentExtras = readJsonStorage(getExtrasStorageKey(userId), {});
                writeJsonStorage(getExtrasStorageKey(userId), {
                    ...currentExtras,
                    avatar: reader.result,
                });
                resolve({ avatarUrl: reader.result });
            };
            reader.readAsDataURL(file);
        });
    },

    async addBookmark(lawmakerId) {
        const defaultBookmarks = USE_MOCKS ? [1, 2, 3] : [];
        const ids = readJsonStorage('huari_bookmarks', defaultBookmarks);
        const numId = Number(lawmakerId);
        if (!ids.includes(numId)) {
            ids.push(numId);
            writeJsonStorage('huari_bookmarks', ids);
        }
        return { success: true, lawmakerId };
    },

    async removeBookmark(lawmakerId) {
        const defaultBookmarks = USE_MOCKS ? [1, 2, 3] : [];
        const ids = readJsonStorage('huari_bookmarks', defaultBookmarks);
        const numId = Number(lawmakerId);
        const filtered = ids.filter((id) => Number(id) !== numId);
        writeJsonStorage('huari_bookmarks', filtered);
        return { success: true, lawmakerId };
    },

    async toggleBookmark(lawmakerId, isCurrentlyBookmarked) {
        if (isCurrentlyBookmarked) {
            return this.removeBookmark(lawmakerId);
        }
        return this.addBookmark(lawmakerId);
    },

    async getBookmarkedLawmakers(idsOverride = null) {
        const defaultBookmarks = USE_MOCKS ? [1, 2, 3] : [];
        const ids = Array.isArray(idsOverride)
            ? idsOverride
            : readJsonStorage('huari_bookmarks', defaultBookmarks);

        if (!ids || ids.length === 0) {
            return [];
        }

        if (USE_MOCKS) {
            const idSet = new Set(ids.map(Number));
            return MOCK_LAWMAKERS.filter((l) => idSet.has(Number(l.id))).map(normalizeLawmaker);
        }

        const results = await Promise.allSettled(
            ids.map((id) => apiClient(`/transparencia/parlamentares/${encodeURIComponent(id)}`))
        );

        return results
            .filter((res) => res.status === 'fulfilled' && res.value)
            .map((res) => normalizeLawmaker(res.value));
    },

    async updateNotifications(notifications) {
        writeJsonStorage('huari_notifications', notifications);
        return notifications;
    },
};
