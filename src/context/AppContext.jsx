import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './contextInstance';
import { useApp } from './useApp';
import { userService } from '../services/userService';
import { coursesService } from '../services/coursesService';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

const INITIAL_USER = {
    id: 'usr-1',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@huari.org',
    phone: '(11) 98765-4321',
    state: 'SP',
    city: 'São Paulo',
    bio: 'Interested in public policy, congressional fiscal transparency, and tracking legislative proposals.',
    role: 'Citizen Auditor',
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
    role: 'Citizen Visitor',
    verified: false,
    memberSince: 'Today',
    avatar: null,
    isGuest: true,
};

const INITIAL_BOOKMARKS = [1, 2, 3]; // Default bookmarked lawmaker IDs

const INITIAL_NOTIFICATIONS = {
    emailAlerts: true,
    votingAlerts: true,
    weeklyDigest: false,
    foiaUpdates: true,
};

const INITIAL_COMPLETED_LESSONS = ['intro-to-politics:lesson-1', 'intro-to-politics:lesson-2'];

export function AppProvider({ children }) {
    // 1. Session Token State
    const [token, setToken] = useState(() => {
        return (
            localStorage.getItem('huari_token') ||
            sessionStorage.getItem('huari_token') ||
            null
        );
    });

    // 2. User State (only restored if token or guest session exists)
    const [user, setUser] = useState(() => {
        try {
            const savedLocal = localStorage.getItem('huari_user');
            const savedSession = sessionStorage.getItem('huari_user');
            const saved = savedLocal || savedSession;
            const hasToken = localStorage.getItem('huari_token') || sessionStorage.getItem('huari_token');
            if (saved && hasToken) {
                return JSON.parse(saved);
            }
            return null;
        } catch {
            return null;
        }
    });

    // Initial session sync with Spring Boot backend (GET /users/me)
    useEffect(() => {
        if (token && !USE_MOCKS) {
            userService.getMe().then((profile) => {
                if (profile) {
                    setUser((prev) => ({ ...prev, ...profile }));
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
            }).catch((err) => {
                console.error('Failed to sync initial session with GET /users/me', err);
            });
        }
    }, [token]);

    const updateUser = (updatedFields) => {
        setUser((prev) => {
            if (!prev) return prev;
            const next = { ...prev, ...updatedFields };
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
    };

    const login = (userData, authToken, rememberMe = true) => {
        const targetUser = userData || INITIAL_USER;
        const targetToken = authToken || `mock-jwt-token-${Date.now()}`;
        setUser(targetUser);
        setToken(targetToken);

        const storage = rememberMe ? localStorage : sessionStorage;
        const otherStorage = rememberMe ? sessionStorage : localStorage;

        otherStorage.removeItem('huari_token');
        otherStorage.removeItem('huari_user');

        try {
            storage.setItem('huari_token', targetToken);
            storage.setItem('huari_user', JSON.stringify(targetUser));
        } catch (e) {
            console.error('Failed to store session', e);
        }
    };

    const loginAsGuest = () => {
        login(GUEST_USER, 'guest-session-token', false);
    };

    const register = (newUserData, authToken) => {
        login(newUserData, authToken, true);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('huari_token');
        sessionStorage.removeItem('huari_token');
        localStorage.removeItem('huari_user');
        sessionStorage.removeItem('huari_user');
    };

    const isAuthenticated = Boolean(token && user);

    // 3. Bookmarked Lawmakers State with localStorage persistence and atomic API sync
    const [bookmarkedLawmakerIds, setBookmarkedLawmakerIds] = useState(() => {
        try {
            const saved = localStorage.getItem('huari_bookmarks');
            return saved ? JSON.parse(saved) : INITIAL_BOOKMARKS;
        } catch {
            return INITIAL_BOOKMARKS;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('huari_bookmarks', JSON.stringify(bookmarkedLawmakerIds));
        } catch (e) {
            console.error('Failed to save bookmarks to localStorage', e);
        }
    }, [bookmarkedLawmakerIds]);

    const toggleBookmark = (id) => {
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
    };

    const isBookmarked = (id) => {
        return bookmarkedLawmakerIds.includes(Number(id));
    };

    // 4. Notification Settings State with backend sync
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem('huari_notifications');
            return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
        } catch {
            return INITIAL_NOTIFICATIONS;
        }
    });

    const toggleNotification = (key) => {
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
    };

    // 5. Course Lessons Completed & Progress Tracking with Compound Keys (${courseId}:${lessonId})
    const [completedLessonIds, setCompletedLessonIds] = useState(() => {
        try {
            const saved = localStorage.getItem('huari_completed_lessons');
            return saved ? JSON.parse(saved) : INITIAL_COMPLETED_LESSONS;
        } catch {
            return INITIAL_COMPLETED_LESSONS;
        }
    });

    const toggleLessonCompleted = (courseId, lessonId) => {
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
    };

    const isLessonCompleted = (courseId, lessonId) => {
        if (!lessonId) {
            return completedLessonIds.includes(courseId) || completedLessonIds.some((k) => k.endsWith(`:${courseId}`));
        }
        const compoundKey = `${courseId}:${lessonId}`;
        return completedLessonIds.includes(compoundKey) || completedLessonIds.includes(lessonId);
    };

    return (
        <AppContext.Provider
            value={{
                token,
                user: user || INITIAL_USER,
                isAuthenticated,
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
