import { useContext } from 'react';
import { ToastContext } from './toastInstance';

export function useToast() {
    return useContext(ToastContext);
}

