import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default function PageHeader({
    badgeIcon: BadgeIcon,
    badgeText,
    title,
    description,
    rightSlot,
    className = '',
}) {
    return (
        <header className={`page-header-container ${className}`}>
            {badgeText && (
                <div className="page-header-badge">
                    {BadgeIcon && <BadgeIcon size={16} />}
                    <span>{badgeText}</span>
                </div>
            )}

            <div className="page-header-content-row">
                <div className="page-header-text">
                    <h1 className="page-header-title">{title}</h1>
                    {description && (
                        <p className="page-header-description">{description}</p>
                    )}
                </div>

                {rightSlot && (
                    <div className="page-header-right-slot">
                        {rightSlot}
                    </div>
                )}
            </div>
        </header>
    );
}

PageHeader.propTypes = {
    badgeIcon: PropTypes.elementType,
    badgeText: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    rightSlot: PropTypes.node,
    className: PropTypes.string,
};

