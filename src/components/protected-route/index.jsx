import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * ProtectedRoute - Route guard for authenticated areas.
 * Checks for active session via AppContext. If unauthenticated,
 * redirects to login while preserving target route.
 */
export default function ProtectedRoute({ children }) {
    const location = useLocation();
    const { isAuthenticated } = useApp() || {};

    const hasStoredToken = Boolean(
        localStorage.getItem('huari_token') ||
        sessionStorage.getItem('huari_token')
    );

    const isAuthorized = Boolean(isAuthenticated || hasStoredToken);

    if (!isAuthorized) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
