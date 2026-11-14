import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './contextInstance';
import { useApp } from './useApp';
import { userService } from '../services/userService';
import { coursesService } from '../services/coursesService';
import { isAdminRole, normalizeRole } from '../utils/roles';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const INITIAL_USER = {
    id: 'usr-1',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@huari.org',
    phone: '(11) 98765-4321',
    state: 'SP',
    city: 'São Paulo',
    bio: 'Interested in public policy, congressional fiscal transparency, and tracking legislative proposals.',
    role: 'STUDENT',
    verified: true,
    memberSince: 'October 2026',
    avatar: null,
};

const GUEST_USER = {
    id: 'usr-guest',
    name: 'Guest Auditor',
    email: 'guest@huari.org',
    phone: '',
    state: 'DF',
    city: 'Brasília',
    bio: 'Exploring congressional open data and civic courses as a guest.',
    role: 'STUDENT',
    verified: false,
    memberSince: 'Today',
    avatar: null,
    isGuest: true,
};

const INITIAL_BOOKMARKS = [1, 2, 3];

const INITIAL_NOTIFICATIONS = {
    emailAlerts: true,
    votingAlerts: true,
    weeklyDigest: false,
    foiaUpdates: true,
};

const INITIAL_COMPLETED_LESSONS = ['intro-to-politics:lesson-1', 'intro-to-politics:lesson-2'];

function readStoredUser() {
    try {
        const saved = localStorage.getItem('huari_user') || sessionStorage.getItem('huari_user');
        const hasToken = localStorage.getItem('huari_token') || sessionStorage.getItem('huari_token');
        if (saved && hasToken) {
            const parsed = JSON.parse(saved);
            return { ...parsed, role: normalizeRole(parsed.role) };
        }
        return null;
    } catch {
        return null;
    }
}

export function AppProvider({ children }) {
    const [token, setToken] = useState(() => {
        return (
            localStorage.getItem('huari_token') ||
            sessionStorage.getItem('huari_token') ||
            null
        );
    });

    const [user, setUser] = useState(readStoredUser);

    const [bookmarkedLawmakerIds, setBookmarkedLawmakerIds] = useState(() => {
        try {
            const saved = localStorage.getItem('huari_bookmarks');
            return saved ? JSON.parse(saved) : INITIAL_BOOKMARKS;
        } catch {
            return INITIAL_BOOKMARKS;
        }
    });

    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem('huari_notifications');
            return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
        } catch {
            return INITIAL_NOTIFICATIONS;
        }
    });

    const [completedLessonIds, setCompletedLessonIds] = useState(() => {
        try {
            const saved = localStorage.getItem('huari_completed_lessons');
            return saved ? JSON.parse(saved) : INITIAL_COMPLETED_LESSONS;
        } catch {
            return INITIAL_COMPLETED_LESSONS;
        }
    });

    useEffect(() => {
        if (token && !USE_MOCKS) {
            userService
                .getMe()
                .then((profile) => {
                    if (profile) {
                        setUser((prev) => ({
                            ...prev,
                            ...profile,
                            role: normalizeRole(profile.role || prev?.role),
                        }));
                        if (Array.isArray(profile.bookmarks)) {
                            setBookmarkedLawmakerIds(profile.bookmarks.map(Number));
                        }
                        if (profile.notifications) {
                            setNotifications((prev) => ({ ...prev, ...profile.notifications }));
                        }
                        if (Array.isArray(profile.completedLessons)) {
                            setCompletedLessonIds(profile.completedLessons);
                        }
                    }
                })
                .catch((err) => {
                    console.error('Failed to sync initial session with GET /usuarios/me', err);
                });
        }
    }, [token]);

    const updateUser = useCallback((updatedFields) => {
        setUser((prev) => {
            if (!prev) return prev;
            const next = {
                ...prev,
                ...updatedFields,
                role: normalizeRole(updatedFields.role || prev.role),
            };
            try {
                if (localStorage.getItem('huari_user')) {
                    localStorage.setItem('huari_user', JSON.stringify(next));
                }
                if (sessionStorage.getItem('huari_user')) {
                    sessionStorage.setItem('huari_user', JSON.stringify(next));
                }
            } catch (e) {
                console.error('Failed to sync updated user in storage', e);
            }
            return next;
        });
    }, []);

    const login = useCallback((userData, authToken, rememberMe = true) => {
        const baseUser = userData || INITIAL_USER;
        const targetUser = { ...baseUser, role: normalizeRole(baseUser.role) };
        const targetToken = authToken || `mock-jwt-token-${Date.now()}`;
        setUser(targetUser);
        setToken(targetToken);

        const storage = rememberMe ? localStorage : sessionStorage;
        const otherStorage = rememberMe ? sessionStorage : localStorage;

        otherStorage.removeItem('huari_token');
        otherStorage.removeItem('huari_user');
        otherStorage.removeItem('huari_refresh_token');
        otherStorage.removeItem('huari_user_role');

        try {
            storage.setItem('huari_token', targetToken);
            storage.setItem('huari_user', JSON.stringify(targetUser));
            storage.setItem('huari_user_role', targetUser.role);
        } catch (e) {
            console.error('Failed to store session', e);
        }
    }, []);

    const loginAsGuest = useCallback(() => {
        login(GUEST_USER, 'guest-session-token', false);
    }, [login]);

    const register = useCallback(
        (newUserData, authToken) => {
            login(newUserData, authToken, true);
        },
        [login]
    );

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('huari_token');
        sessionStorage.removeItem('huari_token');
        localStorage.removeItem('huari_user');
        sessionStorage.removeItem('huari_user');
        localStorage.removeItem('huari_refresh_token');
        sessionStorage.removeItem('huari_refresh_token');
        localStorage.removeItem('huari_user_role');
        sessionStorage.removeItem('huari_user_role');
    }, []);

    const isAuthenticated = Boolean(token && user);
    const isAdmin = Boolean(isAuthenticated && isAdminRole(user?.role));

    useEffect(() => {
        try {
            localStorage.setItem('huari_bookmarks', JSON.stringify(bookmarkedLawmakerIds));
        } catch (e) {
            console.error('Failed to save bookmarks to localStorage', e);
        }
    }, [bookmarkedLawmakerIds]);

    const toggleBookmark = useCallback(
        (id) => {
            const numId = Number(id);
            const isCurrentlyBookmarked = bookmarkedLawmakerIds.includes(numId);

            setBookmarkedLawmakerIds((prev) => {
                if (prev.includes(numId)) {
                    return prev.filter((item) => item !== numId);
                }
                return [...prev, numId];
            });

            if (!USE_MOCKS) {
                userService.toggleBookmark(numId, isCurrentlyBookmarked).catch((err) => {
                    console.error('Failed to sync bookmark with backend', err);
                });
            }
        },
        [bookmarkedLawmakerIds]
    );

    const isBookmarked = useCallback(
        (id) => bookmarkedLawmakerIds.includes(Number(id)),
        [bookmarkedLawmakerIds]
    );

    const toggleNotification = useCallback((key) => {
        setNotifications((prev) => {
            const updated = { ...prev, [key]: !prev[key] };
            try {
                localStorage.setItem('huari_notifications', JSON.stringify(updated));
            } catch (e) {
                console.error('Failed to save notifications', e);
            }
            if (!USE_MOCKS) {
                userService.updateNotifications(updated).catch((err) => {
                    console.error('Failed to sync notifications with backend', err);
                });
            }
            return updated;
        });
    }, []);

    const toggleLessonCompleted = useCallback((courseId, lessonId) => {
        if (!courseId) return;
        const compoundKey = lessonId ? `${courseId}:${lessonId}` : courseId;
        const targetCourseId = lessonId ? courseId : null;
        const targetLessonId = lessonId || courseId;

        setCompletedLessonIds((prev) => {
            const isCompleted = prev.includes(compoundKey) || (lessonId && prev.includes(lessonId));
            const next = isCompleted
                ? prev.filter((id) => id !== compoundKey && id !== lessonId)
                : [...prev, compoundKey];

            try {
                localStorage.setItem('huari_completed_lessons', JSON.stringify(next));
            } catch (e) {
                console.error('Failed to store completed lessons', e);
            }
            return next;
        });

        if (!USE_MOCKS && targetCourseId && targetLessonId) {
            coursesService.toggleLesson(targetCourseId, targetLessonId).catch((err) => {
                console.error('Failed to sync lesson completion with backend', err);
            });
        }
    }, []);

    const isLessonCompleted = useCallback(
        (courseId, lessonId) => {
            if (!lessonId) {
                return (
                    completedLessonIds.includes(courseId) ||
                    completedLessonIds.some((k) => k.endsWith(`:${courseId}`))
                );
            }
            const compoundKey = `${courseId}:${lessonId}`;
            return completedLessonIds.includes(compoundKey) || completedLessonIds.includes(lessonId);
        },
        [completedLessonIds]
    );

    const getCourseProgress = useCallback(
        (course) => {
            if (!course) return 0;
            const lessons = (course.modules || []).flatMap((m) => m.lessons || []);
            if (lessons.length === 0) return course.progress || 0;
            const completedCount = lessons.filter((l) => isLessonCompleted(course.id, l.id)).length;
            return Math.round((completedCount / lessons.length) * 100);
        },
        [isLessonCompleted]
    );

    return (
        <AppContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                isAdmin,
                login,
                loginAsGuest,
                register,
                logout,
                updateUser,
                bookmarkedLawmakerIds,
                toggleBookmark,
                isBookmarked,
                notifications,
                toggleNotification,
                completedLessonIds,
                toggleLessonCompleted,
                isLessonCompleted,
                getCourseProgress,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { useApp, AppContext };
