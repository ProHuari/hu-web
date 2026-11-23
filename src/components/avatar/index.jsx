import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './style.css';

export const DEFAULT_AVATAR_URL = '/images/default-avatar.png';

export default function Avatar({
    src,
    alt = '',
    name = '',
    size = 'md',
    isOnline = false,
    className = '',
    fallbackSrc = DEFAULT_AVATAR_URL,
}) {
    const [failedSrc, setFailedSrc] = useState(null);

    const normalizedSrc = typeof src === 'string' && src.trim() !== '' ? src.trim() : null;
    const hasFailed = Boolean(normalizedSrc && failedSrc === normalizedSrc);
    const activeSrc = normalizedSrc && !hasFailed ? normalizedSrc : fallbackSrc;

    const handleImageError = (e) => {
        if (normalizedSrc && failedSrc !== normalizedSrc) {
            setFailedSrc(normalizedSrc);
        } else if (e.currentTarget.src !== window.location.origin + DEFAULT_AVATAR_URL) {
            e.currentTarget.onerror = null;
            e.currentTarget.src = DEFAULT_AVATAR_URL;
        }
    };

    return (
        <div className={`huari-avatar-container avatar-${size} ${className}`.trim()}>
            <img
                src={activeSrc}
                alt={alt || name || 'User avatar'}
                className="huari-avatar-img"
                loading="lazy"
                decoding="async"
                onError={handleImageError}
            />

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
    fallbackSrc: PropTypes.string,
};
