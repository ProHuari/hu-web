import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default function Badge({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    className = '',
    ...props
}) {
    return (
        <span
            className={`huari-badge badge-${variant} badge-size-${size} ${className}`}
            {...props}
        >
            {Icon && <Icon className="huari-badge-icon" size={size === 'sm' ? 12 : 14} />}
            <span>{children}</span>
        </span>
    );
}

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf([
        'primary',
        'secondary',
        'tertiary',
        'success',
        'danger',
        'warning',
        'neutral',
    ]),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    icon: PropTypes.elementType,
    className: PropTypes.string,
};
