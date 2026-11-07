import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiGovernmentLine } from 'react-icons/ri';
import PageHeader from '../../components/page-header';
import EmptyState from '../../components/empty-state';
import LawmakerFilters from '../../components/lawmaker-filters';
import ParliamentarianCard from '../../components/parliamentarian-card';
import Pagination from '../../components/pagination';
import { MOCK_LAWMAKERS } from '../../data/lawmakers';
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
    const [loading, setLoading] = useState(false);
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
        setLoading(true);

        const timer = setTimeout(() => {
            let result = MOCK_LAWMAKERS.filter((item) => {
                const matchesSearch = filters.search
                    ? item.name.toLowerCase().includes(filters.search.toLowerCase())
                    : true;
                const matchesState = filters.state ? item.state === filters.state : true;
                const matchesParty = filters.party ? item.party === filters.party : true;
                return matchesSearch && matchesState && matchesParty;
            });

            result.sort((a, b) => {
                if (filters.sort === 'name_asc') return a.name.localeCompare(b.name);
                if (filters.sort === 'name_desc') return b.name.localeCompare(a.name);
                if (filters.sort === 'attendance_desc') return b.attendanceNum - a.attendanceNum;
                if (filters.sort === 'bills_desc') return b.projectsNum - a.projectsNum;
                if (filters.sort === 'expenses_asc') return a.expensesNum - b.expensesNum;
                if (filters.sort === 'expenses_desc') return b.expensesNum - a.expensesNum;
                return 0;
            });

            setTotalElements(result.length);

            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const paginatedItems = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

            setData(paginatedItems);
            setLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [filters, currentPage]);

    const totalPages = Math.ceil(totalElements / ITEMS_PER_PAGE);

    return (
        <div className="lawmakers-page-container">
            <PageHeader
                badge="Civic Oversight Platform"
                title="National Congress Directory"
                description="Monitor floor attendance, legislative propositions, and parliamentary quota (CEAP) expenses for federal deputies and senators."
                actions={
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
                        actionLabel="Clear Filters"
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
