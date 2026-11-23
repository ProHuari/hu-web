import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ParliamentarianCard from '../parliamentarian-card';
import { ParliamentarianCardSkeleton } from '../skeleton';
import EmptyState from '../empty-state';
import { lawmakersService } from '../../services/lawmakers-service';
import './style.css';

export default function ParliamentariansGrid({
    lawmakers: propLawmakers,
    className = '',
}) {
    const [fetchedLawmakers, setFetchedLawmakers] = useState([]);
    const [isLoading, setIsLoading] = useState(!propLawmakers);

    useEffect(() => {
        if (propLawmakers) {
            return;
        }

        let isMounted = true;

        lawmakersService
            .getLawmakers({}, { page: 1, limit: 4 })
            .then((res) => {
                if (isMounted) {
                    setFetchedLawmakers(res.items || []);
                }
            })
            .catch((err) => {
                console.error('Falha ao carregar parlamentares em destaque', err);
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [propLawmakers]);

    const list = propLawmakers || fetchedLawmakers;

    return (
        <section
            className={`parliamentarians-grid ${className}`.trim()}
            aria-label="Grade de parlamentares em destaque"
        >
            {isLoading && list.length === 0 ? (
                <div className="parliamentarians-cards-list" role="status" aria-label="Carregando parlamentares">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <ParliamentarianCardSkeleton key={idx} />
                    ))}
                </div>
            ) : list.length === 0 ? (
                <div className="parliamentarians-grid-empty">
                    <EmptyState
                        title="Nenhum parlamentar encontrado"
                        description="Os mandatos cadastrados na base aparecerão aqui assim que forem sincronizados."
                    />
                </div>
            ) : (
                list.map((lawmaker) => (
                    <ParliamentarianCard
                        key={lawmaker.id}
                        lawmaker={lawmaker}
                    />
                ))
            )}
        </section>
    );
}

ParliamentariansGrid.propTypes = {
    lawmakers: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
};
