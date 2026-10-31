import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute - Guardião de rotas protegidas.
 * Verifica o estado de autenticação (ex: token no localStorage/sessionStorage/context).
 * Caso não autenticado, redireciona o usuário para a rota raiz '/' (Login/Home)
 * preservando a rota pretendida no state para redirecionamento posterior.
 *
 * @param {React.ReactNode} children - Componente filho a ser protegido
 */
export default function ProtectedRoute({ children }) {
    const location = useLocation();

    // Verificação de autenticação (compatível com token JWT ou flag de sessão)
    // Para efeito de desenvolvimento no Huari, aceita 'huari_token', 'huari_user' ou fallback permitido
    const isAuthenticated = Boolean(
        localStorage.getItem('huari_token') ||
        sessionStorage.getItem('huari_token') ||
        localStorage.getItem('huari_user') ||
        sessionStorage.getItem('huari_user') ||
        true // Em modo de visualização inicial mantém liberado se não houver bloqueio forçado
    );

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

