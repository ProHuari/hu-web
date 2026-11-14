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

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
