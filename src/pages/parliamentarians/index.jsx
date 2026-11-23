import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiGovernmentLine } from 'react-icons/ri';
import PageHeader from '../../components/page-header';
import EmptyState from '../../components/empty-state';
import LawmakerFilters from '../../components/lawmaker-filters';
import ParliamentarianCard from '../../components/parliamentarian-card';
import { ParliamentarianCardSkeleton } from '../../components/skeleton';
import Pagination from '../../components/pagination';
import { lawmakersService } from '../../services/lawmakers-service';
import './style.css';

const ITEMS_PER_PAGE = 6;

const INITIAL_FILTERS = {
    search: '',
    chamber: '',
    state: '',
    party: '',
    sort: 'name_asc',
};

export default function LawmakersPage() {
    const navigate = useNavigate();

    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [reloadTick, setReloadTick] = useState(0);

    const handleFilterChange = useCallback((field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
        setCurrentPage(1);
    }, []);

    useEffect(() => {
        let isCancelled = false;

        async function fetchLawmakers() {
            setLoading(true);
            setError(null);
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
                console.error('Falha ao carregar parlamentares', err);
                if (!isCancelled) {
                    setError(err?.message || 'Não foi possível consultar a lista de parlamentares.');
                    setData([]);
                    setTotalElements(0);
                }
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
    }, [filters, currentPage, reloadTick]);

    const totalPages = Math.ceil(totalElements / ITEMS_PER_PAGE);

    return (
        <div className="lawmakers-page-container">
            <PageHeader
                badgeText="Congresso Nacional"
                title="Diretório de Parlamentares"
                description="Consulte mandatos da Câmara dos Deputados e do Senado Federal, acompanhe despesas registradas na CEAP e projetos de lei."
                rightSlot={
                    <div className="congress-stat-chip">
                        <RiGovernmentLine size={20} aria-hidden="true" />
                        <span>
                            {totalElements} {totalElements === 1 ? 'mandato listado' : 'mandatos listados'}
                        </span>
                    </div>
                }
            />

            <LawmakerFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                totalResults={totalElements}
            />

            <section className="lawmakers-grid-section" aria-label="Lista de parlamentares">
                {loading ? (
                    <div className="lawmakers-cards-grid" role="status" aria-label="Carregando parlamentares">
                        {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                            <ParliamentarianCardSkeleton key={idx} />
                        ))}
                    </div>
                ) : error ? (
                    <EmptyState
                        title="Erro ao consultar parlamentares"
                        description={error}
                        actionText="Tentar novamente"
                        onAction={() => setReloadTick((prev) => prev + 1)}
                    />
                ) : data.length === 0 ? (
                    <EmptyState
                        title="Nenhum parlamentar encontrado"
                        description="Tente alterar os termos da busca ou limpar os filtros aplicados."
                        actionText="Limpar filtros"
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
