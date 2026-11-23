import PropTypes from 'prop-types';
import { RiErrorWarningLine } from 'react-icons/ri';
import Button from '../button';
import './style.css';

export default function EmptyState({
    icon: Icon = RiErrorWarningLine,
    title = 'Nenhum registro encontrado',
    description = 'Ajuste os termos de busca ou limpe os filtros aplicados.',
    actionText,
    actionLabel,
    onAction,
    className = '',
}) {
    const label = actionText || actionLabel;

    return (
        <div className={`empty-state-card ${className}`}>
            <div className="empty-state-icon-wrapper">
                <Icon size={40} />
            </div>
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-desc">{description}</p>}
            {label && onAction && (
                <div className="empty-state-action">
                    <Button
                        title={label}
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
    actionLabel: PropTypes.string,
    onAction: PropTypes.func,
    className: PropTypes.string,
};
