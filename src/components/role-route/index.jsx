import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/useToast';
import { normalizeRole } from '../../utils/roles';

/**
 * Route guard checking both authentication and normalized role authorization.
 */
export default function RoleRoute({ children, allowedRoles = ['ADMIN'] }) {
    const location = useLocation();
    const { isAuthenticated, user } = useApp() || {};
    const toast = useToast();
    const notifiedRef = useRef(false);

    const userRole = normalizeRole(user?.role);
    const normalizedAllowed = allowedRoles.map(normalizeRole);
    const hasRoleAccess = Boolean(isAuthenticated && normalizedAllowed.includes(userRole));

    useEffect(() => {
        if (isAuthenticated && !hasRoleAccess && !notifiedRef.current) {
            notifiedRef.current = true;
            toast.warning('Administrator access is required for this area.');
        }
    }, [isAuthenticated, hasRoleAccess, toast]);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!hasRoleAccess) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

RoleRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

