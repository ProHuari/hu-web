import { useState, useEffect } from 'react';
import { lawmakersService } from '../../services/lawmakers-service';
import './style.css';

export default function HomeStats() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        lawmakersService
            .getCongressionalStats()
            .then((data) => {
                if (isMounted && data && !Array.isArray(data)) {
                    setStats(data);
                }
            })
            .catch((err) => {
                console.error('Falha ao carregar resumo de transparência', err);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const totalExpenses = stats?.totalExpensesFormatted || 'R$ 0,00';
    const expensesCount = Number(stats?.totalExpensesCount || 0);
    const totalParliamentarians = Number(stats?.totalParliamentarians || 0);
    const deputiesCount = Number(stats?.deputiesCount || 0);
    const senatorsCount = Number(stats?.senatorsCount || 0);
    const totalBillsCount = Number(stats?.totalBillsCount || 0);

    return (
        <section
            className={`home-stats-strip ${isLoading ? 'is-loading' : ''}`}
            aria-label="Resumo da base pública de transparência"
        >
            <div className="home-stat-cell home-stat-cell--lead">
                <span className="home-stat-label">Despesas CEAP registradas</span>
                <strong className="home-stat-value tabular-nums">
                    {isLoading ? '—' : totalExpenses}
                </strong>
                <span className="home-stat-note">
                    {expensesCount > 0
                        ? `${expensesCount.toLocaleString('pt-BR')} lançamentos consolidados`
                        : 'Base integrada via dados abertos'}
                </span>
            </div>

            <div className="home-stat-cell">
                <span className="home-stat-label">Parlamentares na base</span>
                <strong className="home-stat-value tabular-nums">
                    {isLoading ? '—' : totalParliamentarians.toLocaleString('pt-BR')}
                </strong>
                <span className="home-stat-note">
                    {deputiesCount} deputados · {senatorsCount} senadores
                </span>
            </div>

            <div className="home-stat-cell">
                <span className="home-stat-label">Câmara dos Deputados</span>
                <strong className="home-stat-value tabular-nums">
                    {isLoading ? '—' : deputiesCount.toLocaleString('pt-BR')}
                </strong>
                <span className="home-stat-note">Mandatos monitorados</span>
            </div>

            <div className="home-stat-cell">
                <span className="home-stat-label">Projetos de Lei</span>
                <strong className="home-stat-value tabular-nums">
                    {isLoading ? '—' : totalBillsCount.toLocaleString('pt-BR')}
                </strong>
                <span className="home-stat-note">
                    {senatorsCount > 0 ? `${senatorsCount} senadores ativos` : 'Proposições indexadas'}
                </span>
            </div>
        </section>
    );
}
