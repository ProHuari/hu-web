import React from 'react';
import PropTypes from 'prop-types';
import { RiUser3Line } from 'react-icons/ri';
import './style.css';

export default function Avatar({
    src,
    alt = '',
    name = '',
    size = 'md',
    isOnline = false,
    className = '',
}) {
    const getInitials = (fullName) => {
        if (!fullName) return '';
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(name);

    return (
        <div className={`huari-avatar-container avatar-${size} ${className}`}>
            {src ? (
                <img src={src} alt={alt || name || 'User avatar'} className="huari-avatar-img" />
            ) : initials ? (
                <div className="huari-avatar-initials">{initials}</div>
            ) : (
                <div className="huari-avatar-placeholder">
                    <RiUser3Line />
                </div>
            )}

            {isOnline && <span className="huari-avatar-online-dot" title="Online" />}
        </div>
    );
}

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    isOnline: PropTypes.bool,
    className: PropTypes.string,
};

