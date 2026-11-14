import { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AnimatePresence, motion } from 'motion/react';
import {
    RiCheckboxCircleFill,
    RiErrorWarningFill,
    RiInformationFill,
    RiAlertFill,
    RiCloseLine,
} from 'react-icons/ri';
import { ToastContext } from './toastInstance';
import '../components/toast/style.css';

const TOAST_ICONS = {
    success: RiCheckboxCircleFill,
    error: RiErrorWarningFill,
    warning: RiAlertFill,
    info: RiInformationFill,
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timersRef = useRef({});

    const removeToast = useCallback((id) => {
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id]);
            delete timersRef.current[id];
        }
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback(
        ({ title, message, variant = 'info', duration = 3800 }) => {
            const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
            setToasts((prev) => [...prev.slice(-3), { id, title, message, variant }]);

            if (duration > 0) {
                timersRef.current[id] = setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
            return id;
        },
        [removeToast]
    );

    useEffect(() => {
        const activeTimers = timersRef.current;
        return () => {
            Object.values(activeTimers).forEach(clearTimeout);
        };
    }, []);

    const toastApi = {
        show: showToast,
        success: (message, title) => showToast({ message, title, variant: 'success' }),
        error: (message, title) => showToast({ message, title, variant: 'error', duration: 5000 }),
        warning: (message, title) => showToast({ message, title, variant: 'warning' }),
        info: (message, title) => showToast({ message, title, variant: 'info' }),
    };

    return (
        <ToastContext.Provider value={toastApi}>
            {children}
            <div className="huari-toast-viewport" aria-live="polite" aria-atomic="true">
                <AnimatePresence initial={false}>
                    {toasts.map((toast) => {
                        const Icon = TOAST_ICONS[toast.variant] || RiInformationFill;
                        return (
                            <motion.div
                                key={toast.id}
                                layout
                                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                                className={`huari-toast huari-toast--${toast.variant}`}
                                role="status"
                            >
                                <span className="huari-toast-icon" aria-hidden="true">
                                    <Icon size={20} />
                                </span>
                                <div className="huari-toast-body">
                                    {toast.title && <strong className="huari-toast-title">{toast.title}</strong>}
                                    <p className="huari-toast-message">{toast.message}</p>
                                </div>
                                <button
                                    type="button"
                                    className="huari-toast-close"
                                    onClick={() => removeToast(toast.id)}
                                    aria-label="Dismiss notification"
                                >
                                    <RiCloseLine size={18} />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

