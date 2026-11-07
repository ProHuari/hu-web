import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiGovernmentLine } from 'react-icons/ri';
import PageHeader from '../../components/page-header';
import EmptyState from '../../components/empty-state';
import LawmakerFilters from '../../components/lawmaker-filters';
import ParliamentarianCard from '../../components/parliamentarian-card';
import Pagination from '../../components/pagination';
import { lawmakersService } from '../../services/lawmakersService';
import './style.css';

const ITEMS_PER_PAGE = 6;

export default function LawmakersPage() {
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        search: '',
        state: '',
        party: '',
        sort: 'name_asc',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [totalElements, setTotalElements] = useState(0);

    const handleFilterChange = useCallback((field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({ search: '', state: '', party: '', sort: 'name_asc' });
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        let isCancelled = false;

        async function fetchLawmakers() {
            setLoading(true);
            try {
                const result = await lawmakersService.getLawmakers(filters, {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                });
                if (!isCancelled) {
                    setData(result.items || []);
                    setTotalElements(result.totalElements || 0);
                }
            } catch (err) {
                console.error('Failed to load lawmakers', err);
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }

        fetchLawmakers();

        return () => {
            isCancelled = true;
        };
    }, [filters, currentPage]);

    const totalPages = Math.ceil(totalElements / ITEMS_PER_PAGE);

    return (
        <div className="lawmakers-page-container">
            <PageHeader
                badgeText="Civic Oversight Platform"
                title="National Congress Directory"
                description="Monitor floor attendance, legislative propositions, and parliamentary quota (CEAP) expenses for federal deputies and senators."
                rightSlot={
                    <div className="congress-stat-chip">
                        <RiGovernmentLine size={20} aria-hidden="true" />
                        <span>594 Monitored Mandates</span>
                    </div>
                }
            />

            <LawmakerFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                totalResults={totalElements}
            />

            <section className="lawmakers-grid-section" aria-label="Lawmakers Directory List">
                {loading ? (
                    <div className="lawmakers-loading-state">
                        <div className="loading-spinner" />
                        <p>Loading congressional open data...</p>
                    </div>
                ) : data.length === 0 ? (
                    <EmptyState
                        title="No lawmakers found"
                        description="Try adjusting your search criteria or clearing active filters."
                        actionText="Clear Filters"
                        onAction={handleResetFilters}
                    />
                ) : (
                    <div className="lawmakers-cards-grid">
                        {data.map((lawmaker) => (
                            <ParliamentarianCard
                                key={lawmaker.id}
                                lawmaker={lawmaker}
                                onView={() => navigate(`/lawmakers/${lawmaker.id}`)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {!loading && totalPages > 1 && (
                <footer className="lawmakers-pagination-footer">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </footer>
            )}
        </div>
    );
}
