import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './context-instance';
import { useApp } from './useApp';
import { userService } from '../services/user-service';
import { coursesService } from '../services/courses-service';
import { isAdminRole, normalizeRole } from '../utils/roles';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const INITIAL_USER = {
    id: 'usr-1',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@huari.org',
    phone: '',
    state: 'SP',
    city: 'São Paulo',
    bio: 'Acompanhando políticas públicas, transparência fiscal no Congresso e projetos de lei.',
    role: 'STUDENT',
    verified: true,
    memberSince: '2026',
    avatar: null,
};

const GUEST_USER = {
    id: 'usr-guest',
    name: 'Visitante Cidadão',
    email: 'visitante@huari.org',
    phone: '',
    state: 'DF',
    city: 'Brasília',
    bio: 'Explorando dados abertos parlamentares e trilhas de formação cívica.',
    role: 'STUDENT',
    verified: false,
    memberSince: 'Hoje',
    avatar: null,
    isGuest: true,
};

const INITIAL_BOOKMARKS = USE_MOCKS ? [1, 2, 3] : [];

const INITIAL_NOTIFICATIONS = {
    emailAlerts: true,
    votingAlerts: true,
    weeklyDigest: false,
    foiaUpdates: true,
};

const INITIAL_COMPLETED_LESSONS = USE_MOCKS
    ? ['intro-to-politics:lesson-1', 'intro-to-politics:lesson-2']
    : [];

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
        if (token && token !== 'guest-session-token' && !USE_MOCKS) {
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
                            setCompletedLessonIds(profile.completedLessons.map(String));
                        }
                    }
                })
                .catch((err) => {
                    console.error('Falha ao sincronizar sessão inicial com GET /usuarios/me', err);
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

    const login = useCallback((userData, authToken, rememberMe = true, refreshToken = null) => {
        const baseUser = userData || INITIAL_USER;
        const targetUser = { ...baseUser, role: normalizeRole(baseUser.role) };
        const targetToken = authToken || (USE_MOCKS ? `mock-jwt-token-${Date.now()}` : null);
        const targetRefreshToken =
            refreshToken || (USE_MOCKS && targetToken ? `mock-refresh-token-${Date.now()}` : null);
        setUser(targetUser);
        setToken(targetToken);

        const storage = rememberMe ? localStorage : sessionStorage;
        const otherStorage = rememberMe ? sessionStorage : localStorage;

        otherStorage.removeItem('huari_token');
        otherStorage.removeItem('huari_user');
        otherStorage.removeItem('huari_refresh_token');
        otherStorage.removeItem('huari_user_role');

        try {
            if (targetToken) {
                storage.setItem('huari_token', targetToken);
            }
            if (targetRefreshToken) {
                storage.setItem('huari_refresh_token', targetRefreshToken);
            }
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

            if (!USE_MOCKS && token && token !== 'guest-session-token') {
                userService.toggleBookmark(numId, isCurrentlyBookmarked).catch((err) => {
                    console.error('Falha ao atualizar parlamentar salvo', err);
                });
            }
        },
        [bookmarkedLawmakerIds, token]
    );

    const isBookmarked = useCallback(
        (id) => bookmarkedLawmakerIds.includes(Number(id)),
        [bookmarkedLawmakerIds]
    );

    const toggleNotification = useCallback(
        (key) => {
            setNotifications((prev) => {
                const updated = { ...prev, [key]: !prev[key] };
                try {
                    localStorage.setItem('huari_notifications', JSON.stringify(updated));
                } catch (e) {
                    console.error('Failed to save notifications', e);
                }

                if (!USE_MOCKS && token && token !== 'guest-session-token') {
                    userService.updateNotifications(updated).catch((err) => {
                        console.error('Falha ao salvar notificações', err);
                    });
                }
                return updated;
            });
        },
        [token]
    );

    const isLessonCompleted = useCallback(
        (courseId, lessonId) => {
            if (!lessonId) {
                const target = String(courseId);
                return (
                    completedLessonIds.includes(target) ||
                    completedLessonIds.some((k) => String(k).endsWith(`:${target}`))
                );
            }
            const lessonKey = String(lessonId);
            const compoundKey = `${courseId}:${lessonKey}`;
            return completedLessonIds.includes(compoundKey) || completedLessonIds.includes(lessonKey);
        },
        [completedLessonIds]
    );

    const toggleLessonCompleted = useCallback(
        (courseId, lessonId) => {
            if (!courseId) return;
            const lessonKey = String(lessonId || courseId);
            const compoundKey = lessonId ? `${courseId}:${lessonKey}` : lessonKey;
            const targetCourseId = lessonId ? courseId : null;
            const targetLessonId = lessonId || courseId;
            const wasCompleted =
                completedLessonIds.includes(compoundKey) || completedLessonIds.includes(lessonKey);
            const nextCompleted = !wasCompleted;

            const updateLocalState = (enable) => {
                setCompletedLessonIds((prev) => {
                    const next = enable
                        ? [...new Set([...prev, compoundKey, lessonKey])]
                        : prev.filter((id) => String(id) !== compoundKey && String(id) !== lessonKey);
                    try {
                        localStorage.setItem('huari_completed_lessons', JSON.stringify(next));
                    } catch (e) {
                        console.error('Failed to store completed lessons', e);
                    }
                    return next;
                });
            };

            updateLocalState(nextCompleted);

            if (!USE_MOCKS && token && token !== 'guest-session-token' && targetCourseId && targetLessonId) {
                coursesService
                    .toggleLesson(targetCourseId, targetLessonId, nextCompleted)
                    .catch((err) => {
                        console.error('Falha ao persistir progresso da aula no backend', err);
                        updateLocalState(wasCompleted);
                    });
            }
        },
        [completedLessonIds, token]
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
