import React from 'react';
import PropTypes from 'prop-types';
import { RiErrorWarningLine } from 'react-icons/ri';
import Button from '../button';
import './style.css';

export default function EmptyState({
    icon: Icon = RiErrorWarningLine,
    title = 'No items found',
    description = 'Try refining your search terms or clearing active filters.',
    actionText,
    onAction,
    className = '',
}) {
    return (
        <div className={`empty-state-card ${className}`}>
            <div className="empty-state-icon-wrapper">
                <Icon size={44} />
            </div>
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-desc">{description}</p>}
            {actionText && onAction && (
                <div className="empty-state-action">
                    <Button
                        title={actionText}
                        identifier="btn-primary btn-radius-10"
                        onClick={onAction}
                        type="button"
                    />
                </div>
            )}
        </div>
    );
}

EmptyState.propTypes = {
    icon: PropTypes.elementType,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    actionText: PropTypes.string,
    onAction: PropTypes.func,
    className: PropTypes.string,
};

