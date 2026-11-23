import { useContext } from 'react';
import { ToastContext } from './toast-instance';

export function useToast() {
    return useContext(ToastContext);
}

