import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const INITIAL_USER = {
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

const INITIAL_BOOKMARKS = [1, 2, 3]; // Default bookmarked lawmaker IDs

const INITIAL_NOTIFICATIONS = {
    emailAlerts: true,
    votingAlerts: true,
    weeklyDigest: false,
    foiaUpdates: true,
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
    // 1. User State with localStorage persistence
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('huari_user');
            return saved ? { ...INITIAL_USER, ...JSON.parse(saved) } : INITIAL_USER;
        } catch {
            return INITIAL_USER;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('huari_user', JSON.stringify(user));
        } catch (e) {
            console.error('Failed to save user to localStorage', e);
        }
    }, [user]);

    const updateUser = (updatedFields) => {
        setUser((prev) => ({ ...prev, ...updatedFields }));
    };

    // 2. Bookmarked Lawmakers State with localStorage persistence
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

    // 3. Notification Settings State
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

    return (
        <AppContext.Provider
            value={{
                user,
                updateUser,
                bookmarkedLawmakerIds,
                toggleBookmark,
                isBookmarked,
                notifications,
                toggleNotification,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

