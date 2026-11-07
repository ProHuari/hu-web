import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Route Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/login';
import CreateAnAccount from './pages/create-an-account';
import RecoverPassword from './pages/recover-password';
import CreateNewPassword from './pages/create-new-password';
import Dashboard from './pages/dashboard';
import LawmakersPage from './pages/parliamentarians';
import ParliamentarianAnalysis from './pages/parliamentarian-analysis';
import ChatHuari from './pages/chat-huari';
import UserProfile from './pages/user-profile';
import Learn from './pages/learn';
import LessonOverview from './pages/lesson-overview';
import LessonDetails from './pages/lesson-details';

// Route Guard
import ProtectedRoute from './components/protected-route';

/**
 * AppRoutes - Centralized routing hierarchy for Huari Civic Platform.
 * Auth routes are nested within AuthLayout; platform routes within MainLayout.
 */
export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Authentication Routes (Wrapped in AuthLayout) */}
            <Route element={<AuthLayout />}>
                <Route index element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<CreateAnAccount />} />
                <Route path="/create-an-account" element={<CreateAnAccount />} />
                <Route path="/recover-password" element={<RecoverPassword />} />
                <Route path="/reset-password" element={<CreateNewPassword />} />
                <Route path="/create-new-password" element={<CreateNewPassword />} />
            </Route>

            {/* Authenticated Platform Routes (Protected & Wrapped in MainLayout) */}
            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/lawmakers" element={<LawmakersPage />} />
                <Route path="/lawmakers/:id" element={<ParliamentarianAnalysis />} />
                <Route path="/chat" element={<ChatHuari />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/learn/:courseId" element={<LessonOverview />} />
                <Route path="/learn/:courseId/overview" element={<LessonOverview />} />
                <Route path="/learn/:courseId/:lessonId" element={<LessonDetails />} />
                <Route path="/learn/:courseId/:lessonId/overview" element={<LessonOverview />} />
            </Route>

            {/* Fallback for undefined routes */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
