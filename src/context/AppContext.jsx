import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from './contextInstance';

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

    // 3. Bookmarked Lawmakers State with localStorage persistence
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
        setBookmarkedLawmakerIds((prev) => {
            if (prev.includes(numId)) {
                return prev.filter((item) => item !== numId);
            }
            return [...prev, numId];
        });
    };

    const isBookmarked = (id) => {
        return bookmarkedLawmakerIds.includes(Number(id));
    };

    // 4. Notification Settings State
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
            return updated;
        });
    };

    // 5. Course Lessons Completed & Progress Tracking
    const [completedLessonIds, setCompletedLessonIds] = useState(() => {
        try {
            const saved = localStorage.getItem('huari_completed_lessons');
            return saved ? JSON.parse(saved) : ['lesson-1', 'lesson-2'];
        } catch {
            return ['lesson-1', 'lesson-2'];
        }
    });

    const toggleLessonCompleted = (lessonId) => {
        if (!lessonId) return;
        setCompletedLessonIds((prev) => {
            const next = prev.includes(lessonId)
                ? prev.filter((id) => id !== lessonId)
                : [...prev, lessonId];
            try {
                localStorage.setItem('huari_completed_lessons', JSON.stringify(next));
            } catch (e) {
                console.error('Failed to store completed lessons', e);
            }
            return next;
        });
    };

    const isLessonCompleted = (lessonId) => {
        return completedLessonIds.includes(lessonId);
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
