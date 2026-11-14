import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'motion/react';
import { RiAlertLine, RiCloseLine } from 'react-icons/ri';
import './style.css';

export default function ConfirmModal({
    isOpen,
    title = 'Confirm action',
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
    onConfirm,
    onCancel,
}) {
    const cancelBtnRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return undefined;

        cancelBtnRef.current?.focus();

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !isLoading) {
                onCancel?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isLoading, onCancel]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="huari-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={() => !isLoading && onCancel?.()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="huari-confirm-title"
                >
                    <motion.div
                        className="huari-modal-card"
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="huari-modal-header">
                            <span className={`huari-modal-icon huari-modal-icon--${variant}`} aria-hidden="true">
                                <RiAlertLine size={22} />
                            </span>
                            <button
                                type="button"
                                className="huari-modal-close"
                                onClick={onCancel}
                                disabled={isLoading}
                                aria-label="Close modal"
                            >
                                <RiCloseLine size={20} />
                            </button>
                        </div>

                        <h2 id="huari-confirm-title" className="huari-modal-title">
                            {title}
                        </h2>
                        {description && <p className="huari-modal-desc">{description}</p>}

                        <div className="huari-modal-actions">
                            <button
                                ref={cancelBtnRef}
                                type="button"
                                className="huari-modal-btn-cancel"
                                onClick={onCancel}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                className={`huari-modal-btn-confirm huari-modal-btn-confirm--${variant}`}
                                onClick={onConfirm}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

ConfirmModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    variant: PropTypes.oneOf(['danger', 'primary']),
    isLoading: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

