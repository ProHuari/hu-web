import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { HuariErrorBoundary } from './components/error-boundary';
import AppRoutes from './routes';

export default function App() {
    return (
        <HuariErrorBoundary>
            <MotionConfig reducedMotion="user">
                <BrowserRouter>
                    <ToastProvider>
                        <AppProvider>
                            <AppRoutes />
                        </AppProvider>
                    </ToastProvider>
                </BrowserRouter>
            </MotionConfig>
        </HuariErrorBoundary>
    );
}
