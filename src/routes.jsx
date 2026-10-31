import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importação das páginas da aplicação
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
import LessonDetails from './pages/lesson-details';

// Guardião de rotas protegidas
import ProtectedRoute from './components/protected-route';

/**
 * AppRoutes - Definição centralizada de todas as rotas absolutas da Huari:
 *  - /                 -> Login / Autenticação
 *  - /register         -> Cadastro de Conta
 *  - /recover-password -> Recuperação de Senha
 *  - /reset-password   -> Criação de Nova Senha
 *  - /dashboard        -> Dashboard Executivo (Home)
 *  - /lawmakers        -> Listagem de Parlamentares com Filtros
 *  - /lawmakers/:id    -> Detalhes e Análise do Parlamentar
 *  - /chat             -> Chat Huari com IA Cívica
 *  - /profile          -> Perfil e Configurações do Usuário
 *  - /learn            -> Catálogo de Cursos / Academia Cívica
 *  - /learn/:courseId/:lessonId -> Aula e Player de Vídeo
 */
export default function AppRoutes() {
    return (
        <Routes>
            {/* Rotas Públicas de Autenticação */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<CreateAnAccount />} />
            <Route path="/recover-password" element={<RecoverPassword />} />
            <Route path="/reset-password" element={<CreateNewPassword />} />

            {/* Rotas Protegidas / Principais da Plataforma */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/lawmakers"
                element={
                    <ProtectedRoute>
                        <LawmakersPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/lawmakers/:id"
                element={
                    <ProtectedRoute>
                        <ParliamentarianAnalysis />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <ChatHuari />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <UserProfile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/learn"
                element={
                    <ProtectedRoute>
                        <Learn />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/learn/:courseId/:lessonId"
                element={
                    <ProtectedRoute>
                        <LessonDetails />
                    </ProtectedRoute>
                }
            />

            {/* Fallback para rotas inexistentes: redireciona para o Dashboard ou Login */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

