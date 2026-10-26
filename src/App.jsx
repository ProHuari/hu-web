
import { useState } from 'react';

import Login from './pages/login';
import CreateAnAccount from './pages/create-an-account';
import RecoverPassword from './pages/recover-password';

export default function App() {
    const [currentPage, setCurrentPage] = useState('create-account');

    return (
        <>
            {currentPage === 'create-account' ? (
                <CreateAnAccount
                    onNavigateToLogin={() => setCurrentPage('login')}
                />
            ) : currentPage === 'recover-password' ? (
                <RecoverPassword
                    onNavigateToLogin={() => setCurrentPage('login')}
                />
            ) : (
                <Login
                    onNavigateToRegister={() => setCurrentPage('create-account')}
                    onNavigateToRecoverPassword={() =>
                        setCurrentPage('recover-password')
                    }
                />
            )}
        </>
    );
}
