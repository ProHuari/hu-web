import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { PageTransition } from '../../components/motion/MotionPrimitives';
import Button from '../../components/button';
import './style.css';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <PageTransition className="not-found-page">
            <div className="not-found-card">
                <span className="not-found-code">404 • PAGE NOT FOUND</span>
                <h1 className="not-found-title">This page is off the civic record</h1>
                <p className="not-found-desc">
                    The route you requested does not exist or may have moved. Head back to your
                    dashboard or explore the learning catalog.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Button type="button" variant="primary" onClick={() => navigate('/dashboard')}>
                        <FiArrowLeft size={16} /> Back to Dashboard
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/learn')}>
                        Browse Courses
                    </Button>
                </div>
            </div>
        </PageTransition>
    );
}

