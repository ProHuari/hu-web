import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/protected-route';
import RoleRoute from './components/role-route';
import { PageLoader } from './components/skeleton';

const Login = lazy(() => import('./pages/login'));
const CreateAnAccount = lazy(() => import('./pages/create-an-account'));
const RecoverPassword = lazy(() => import('./pages/recover-password'));
const CreateNewPassword = lazy(() => import('./pages/create-new-password'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const LawmakersPage = lazy(() => import('./pages/parliamentarians'));
const ParliamentarianAnalysis = lazy(() => import('./pages/parliamentarian-analysis'));
const ChatHuari = lazy(() => import('./pages/chat-huari'));
const UserProfile = lazy(() => import('./pages/user-profile'));
const Learn = lazy(() => import('./pages/learn'));
const LessonOverview = lazy(() => import('./pages/lesson-overview'));
const LessonDetails = lazy(() => import('./pages/lesson-details'));
const AdminCoursesPage = lazy(() => import('./pages/admin-courses'));
const AdminCourseEditorPage = lazy(() => import('./pages/admin-course-editor'));
const NotFoundPage = lazy(() => import('./pages/not-found'));

export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader label="Loading Huari Platform..." />}>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Public Authentication Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<CreateAnAccount />} />
                    <Route path="/recover-password" element={<RecoverPassword />} />
                    <Route path="/reset-password" element={<CreateNewPassword />} />
                </Route>

                {/* Protected Application Routes */}
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

                    {/* Admin-Only Course Management */}
                    <Route
                        path="/admin/courses"
                        element={
                            <RoleRoute allowedRoles={['ADMIN']}>
                                <AdminCoursesPage />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/admin/courses/new"
                        element={
                            <RoleRoute allowedRoles={['ADMIN']}>
                                <AdminCourseEditorPage />
                            </RoleRoute>
                        }
                    />
                    <Route
                        path="/admin/courses/:courseId/edit"
                        element={
                            <RoleRoute allowedRoles={['ADMIN']}>
                                <AdminCourseEditorPage />
                            </RoleRoute>
                        }
                    />

                    {/* Branded 404 inside authenticated layout */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
