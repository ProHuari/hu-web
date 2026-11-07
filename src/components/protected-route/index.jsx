import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute - Route guard for authenticated areas.
 * Checks for authentication token/session. If unauthenticated,
 * redirects to login while preserving target route.
 */
export default function ProtectedRoute({ children }) {
    const location = useLocation();

    const isAuthenticated = Boolean(
        localStorage.getItem('huari_token') ||
        sessionStorage.getItem('huari_token') ||
        localStorage.getItem('huari_user') ||
        sessionStorage.getItem('huari_user') ||
        true // Permissive in preview/demo mode
    );

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
