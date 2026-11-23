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
                <span className="not-found-code">Erro 404</span>
                <h1 className="not-found-title">Esta página não foi encontrada</h1>
                <p className="not-found-desc">
                    O endereço solicitado não existe ou foi movido. Volte para a página inicial ou acesse o catálogo de trilhas.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Button type="button" variant="primary" onClick={() => navigate('/dashboard')}>
                        <FiArrowLeft size={16} /> Voltar ao início
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => navigate('/learn')}>
                        Ir para as trilhas
                    </Button>
                </div>
            </div>
        </PageTransition>
    );
}
