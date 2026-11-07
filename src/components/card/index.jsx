import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default function Card({
    title,
    value,
    description,
    footer,
    trend,
    icon: Icon,
    iconElement,
    highlightColor,
    className = '',
}) {
    const displayFooter = footer || description;

    return (
        <article className={`stat-card ${highlightColor ? `stat-card--${highlightColor}` : ''} ${className}`.trim()}>
            <div className="stat-card-header">
                <span className="stat-card-title text-p-small-regular">{title}</span>
                {(Icon || iconElement) && (
                    <div className="stat-card-icon" aria-hidden="true">
                        {iconElement || (Icon && <Icon size={20} />)}
                    </div>
                )}
            </div>

            <div className="stat-card-body">
                <div className="stat-card-value-row">
                    <span className="stat-card-value text-h2-bold">{value}</span>
                    {trend && <span className="stat-card-trend text-p-small-medium">{trend}</span>}
                </div>

                {displayFooter && (
                    <p className="stat-card-footer text-p-small-regular">
                        {displayFooter}
                    </p>
                )}
            </div>
        </article>
    );
}

Card.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    description: PropTypes.string,
    footer: PropTypes.string,
    trend: PropTypes.string,
    icon: PropTypes.elementType,
    iconElement: PropTypes.node,
    highlightColor: PropTypes.string,
    className: PropTypes.string,
};
