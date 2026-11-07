import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ParliamentarianCard from '../parliamentarian-card';
import EmptyState from '../empty-state';
import { lawmakersService } from '../../services/lawmakersService';
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

        lawmakersService.getLawmakers({}, { page: 1, limit: 4 })
            .then((res) => {
                if (isMounted) {
                    setFetchedLawmakers(res.items || []);
                }
            })
            .catch((err) => {
                console.error('Failed to load featured lawmakers in grid', err);
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
            aria-label="Featured Lawmakers Grid"
        >
            {isLoading && list.length === 0 ? (
                <div className="parliamentarians-grid-loading">
                    <div className="loading-spinner" />
                    <p>Loading featured lawmakers...</p>
                </div>
            ) : list.length === 0 ? (
                <div className="parliamentarians-grid-empty">
                    <EmptyState
                        title="No lawmakers available"
                        description="Featured congressional records will appear here."
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
