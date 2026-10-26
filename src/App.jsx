import { useState } from 'react';
import Login from './pages/login';
import CreateAnAccount from './pages/create-an-account';

export default function App() {
  const [currentPage, setCurrentPage] = useState('create-account');

  return (
    <>
      {currentPage === 'create-account' ? (
        <CreateAnAccount onNavigateToLogin={() => setCurrentPage('login')} />
      ) : (
        <Login onNavigateToRegister={() => setCurrentPage('create-account')} />
      )}
    </>
  );
}
