import PropTypes from 'prop-types';
import './style.css';

export default function PageHeader({
    badgeIcon: BadgeIcon,
    badgeText,
    badge,
    title,
    description,
    rightSlot,
    actions,
    className = '',
}) {
    const displayBadgeText = badgeText || badge;
    const displayRightSlot = rightSlot || actions;

    return (
        <header className={`page-header-container ${className}`}>
            {displayBadgeText && (
                <div className="page-header-badge">
                    {BadgeIcon && <BadgeIcon size={16} />}
                    <span>{displayBadgeText}</span>
                </div>
            )}

            <div className="page-header-content-row">
                <div className="page-header-text">
                    <h1 className="page-header-title">{title}</h1>
                    {description && (
                        <p className="page-header-description">{description}</p>
                    )}
                </div>

                {displayRightSlot && (
                    <div className="page-header-right-slot">
                        {displayRightSlot}
                    </div>
                )}
            </div>
        </header>
    );
}

PageHeader.propTypes = {
    badgeIcon: PropTypes.elementType,
    badgeText: PropTypes.string,
    badge: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    rightSlot: PropTypes.node,
    actions: PropTypes.node,
    className: PropTypes.string,
};
