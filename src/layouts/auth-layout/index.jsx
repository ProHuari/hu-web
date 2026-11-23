import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import WebsiteInformation from '../../components/web-site-information';
import bgLogin from '../../assets/images/HuariEducationalLibrary.jpg';
import bgRegister from '../../assets/images/HuariEducationLibrary2.jpg';
import bgRecover from '../../assets/images/HuariEducationLibrary3.jpg';
import bgReset from '../../assets/images/HuariEducationLibrary4.jpg';
import './style.css';

export default function AuthLayout() {
    const location = useLocation();

    const getBackgroundImage = () => {
        const path = location.pathname.toLowerCase();
        if (path.includes('register') || path.includes('create-an-account')) {
            return bgRegister;
        }
        if (path.includes('recover') || path.includes('forgot')) {
            return bgRecover;
        }
        if (path.includes('reset') || path.includes('create-new-password')) {
            return bgReset;
        }
        return bgLogin;
    };

    return (
        <div className="auth-layout-container">
            <aside className="auth-layout-left" aria-label="Platform Highlights">
                <WebsiteInformation backgroundImage={getBackgroundImage()} />
            </aside>

            <main className="auth-layout-right">
                <Outlet />
            </main>
        </div>
    );
}

