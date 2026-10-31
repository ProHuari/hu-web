import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    RiGovernmentLine,
    RiShieldCheckLine,
    RiErrorWarningLine,
} from 'react-icons/ri';

import SideBar from '../../components/sidebar';
import Footer from '../../components/footer';
import LawmakerFilters from '../../components/lawmaker-filters';
import ParliamentarianCard from '../../components/parliamentarian-card';
import Pagination from '../../components/pagination';
import './style.css';

// Base mock inicial rica com deputados e senadores brasileiros reais
const MOCK_PARLIAMENTARIANS = [
    {
        id: 1,
        name: 'Tabata Amaral',
        position: 'Deputada Federal',
        party: 'PSB',
        state: 'SP',
        attendance: '96%',
        attendanceNum: 96,
        projects: '42',
        projectsNum: 42,
        expenses: 'R$ 31,8 mil',
        expensesNum: 31800,
    },
    {
        id: 2,
        name: 'Randolfe Rodrigues',
        position: 'Senador',
        party: 'PT',
        state: 'AP',
        attendance: '94%',
        attendanceNum: 94,
        projects: '38',
        projectsNum: 38,
        expenses: 'R$ 27,4 mil',
        expensesNum: 27400,
    },
    {
        id: 3,
        name: 'Alessandro Vieira',
        position: 'Senador',
        party: 'MDB',
        state: 'SE',
        attendance: '91%',
        attendanceNum: 91,
        projects: '31',
        projectsNum: 31,
        expenses: 'R$ 29,1 mil',
        expensesNum: 29100,
    },
    {
        id: 4,
        name: 'Erika Hilton',
        position: 'Deputada Federal',
        party: 'PSOL',
        state: 'SP',
        attendance: '93%',
        attendanceNum: 93,
        projects: '35',
        projectsNum: 35,
        expenses: 'R$ 32,5 mil',
        expensesNum: 32500,
    },
    {
        id: 5,
        name: 'Nikolas Ferreira',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'MG',
        attendance: '89%',
        attendanceNum: 89,
        projects: '24',
        projectsNum: 24,
        expenses: 'R$ 35,1 mil',
        expensesNum: 35100,
    },
    {
        id: 6,
        name: 'Guilherme Boulos',
        position: 'Deputado Federal',
        party: 'PSOL',
        state: 'SP',
        attendance: '92%',
        attendanceNum: 92,
        projects: '29',
        projectsNum: 29,
        expenses: 'R$ 28,6 mil',
        expensesNum: 28600,
    },
    {
        id: 7,
        name: 'Sergio Moro',
        position: 'Senador',
        party: 'UNIÃO',
        state: 'PR',
        attendance: '88%',
        attendanceNum: 88,
        projects: '19',
        projectsNum: 19,
        expenses: 'R$ 33,4 mil',
        expensesNum: 33400,
    },
    {
        id: 8,
        name: 'Eduardo Bolsonaro',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'SP',
        attendance: '85%',
        attendanceNum: 85,
        projects: '18',
        projectsNum: 18,
        expenses: 'R$ 39,2 mil',
        expensesNum: 39200,
    },
    {
        id: 9,
        name: 'Kim Kataguiri',
        position: 'Deputado Federal',
        party: 'UNIÃO',
        state: 'SP',
        attendance: '95%',
        attendanceNum: 95,
        projects: '48',
        projectsNum: 48,
        expenses: 'R$ 18,5 mil',
        expensesNum: 18500,
    },
    {
        id: 10,
        name: 'Soraya Thronicke',
        position: 'Senadora',
        party: 'PODEMOS',
        state: 'MS',
        attendance: '90%',
        attendanceNum: 90,
        projects: '22',
        projectsNum: 22,
        expenses: 'R$ 34,7 mil',
        expensesNum: 34700,
    },
    {
        id: 11,
        name: 'Marcel van Hattem',
        position: 'Deputado Federal',
        party: 'NOVO',
        state: 'RS',
        attendance: '97%',
        attendanceNum: 97,
        projects: '33',
        projectsNum: 33,
        expenses: 'R$ 15,2 mil',
        expensesNum: 15200,
    },
    {
        id: 12,
        name: 'Renan Calheiros',
        position: 'Senador',
        party: 'MDB',
        state: 'AL',
        attendance: '82%',
        attendanceNum: 82,
        projects: '15',
        projectsNum: 15,
        expenses: 'R$ 41,0 mil',
        expensesNum: 41000,
    },
];

const ITEMS_PER_PAGE = 6;

/**
 * LawmakersPage (Organismo / Página) - Gerenciador central de parlamentares.
 * Estruturado com arquitetura desacoplada para rápida substituição de mock por Spring Boot API:
 * GET /api/v1/parliamentarians?page=0&size=6&search=...&state=...&party=...&sort=...
 */
export default function LawmakersPage({
    onNavigateToHome,
    onNavigateToLearn,
    onNavigateToChat,
    onNavigateToConfig,
    onNavigateToLogin,
    onViewParliamentarian,
}) {
    // 1. Estados de Filtros e Paginação
    const [filters, setFilters] = useState({
        search: '',
        state: '',
        party: '',
        sort: 'name_asc',
    });
    const [currentPage, setCurrentPage] = useState(1);

    // 2. Estados de Controle de Ciclo de Vida Assíncrono (Padrão REST API Spring Boot)
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [totalElements, setTotalElements] = useState(0);

    // Callback para atualizar filtros individuais com reset de página para a 1
    const handleFilterChange = useCallback((field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters({ search: '', state: '', party: '', sort: 'name_asc' });
        setCurrentPage(1);
    }, []);

    // 3. Efeito que simula a requisição ao Backend (Spring Boot GET /api/v1/parliamentarians)
    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            // Filtragem
            let result = MOCK_PARLIAMENTARIANS.filter((item) => {
                const matchesSearch = filters.search
                    ? item.name.toLowerCase().includes(filters.search.toLowerCase())
                    : true;
                const matchesState = filters.state ? item.state === filters.state : true;
                const matchesParty = filters.party ? item.party === filters.party : true;
                return matchesSearch && matchesState && matchesParty;
            });

            // Ordenação
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

            // Paginação (substituível por Pageable do Spring Data)
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const paginatedItems = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

            setData(paginatedItems);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [filters, currentPage]);

    const totalPages = Math.ceil(totalElements / ITEMS_PER_PAGE);

    const handleSidebarNavigate = (label) => {
        if (label === 'Home') onNavigateToHome?.();
        else if (label === 'Learn') onNavigateToLearn?.();
        else if (label === 'Chat Huari') onNavigateToChat?.();
    };

    return (
        <div className="lawmakers-page-layout">
            {/* Sidebar Fixa à Esquerda */}
            <div className="lawmakers-sidebar-wrapper">
                <SideBar
                    activeItem="Lawmakers"
                    onNavigate={handleSidebarNavigate}
                    onLogout={onNavigateToLogin}
                    onSettings={onNavigateToConfig}
                />
            </div>

            {/* Conteúdo Principal à Direita */}
            <main className="lawmakers-main-content">
                <div className="lawmakers-container">
                    {/* Header Institucional da Seção */}
                    <header className="lawmakers-page-header">
                        <div className="header-badge">
                            <RiShieldCheckLine size={16} />
                            <span>Fiscalização Cívica Huari</span>
                        </div>
                        <div className="header-title-row">
                            <div className="title-group">
                                <h1>Congresso Nacional em Aberto</h1>
                                <p>
                                    Consulte assiduidade em plenário, proposições legislativas
                                    e cotas de gabinete (CEAP) de deputados federais e senadores.
                                </p>
                            </div>
                            <div className="congress-stat-chip">
                                <RiGovernmentLine size={20} />
                                <span>594 Mandatos Ativos</span>
                            </div>
                        </div>
                    </header>

                    {/* Molécula: Filtros Agrupados */}
                    <LawmakerFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onResetFilters={handleResetFilters}
                        totalResults={totalElements}
                    />

                    {/* Grade de Resultados / Cards */}
                    <section className="lawmakers-grid-section" aria-label="Parlamentares listados">
                        {loading ? (
                            <div className="lawmakers-loading-state">
                                <div className="loading-spinner" />
                                <p>Carregando dados da Câmara e do Senado...</p>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="lawmakers-empty-state">
                                <RiErrorWarningLine size={48} />
                                <h3>Nenhum parlamentar encontrado</h3>
                                <p>Tente ajustar os termos de busca ou remover alguns dos filtros aplicados.</p>
                                <button
                                    type="button"
                                    className="btn-empty-reset"
                                    onClick={handleResetFilters}
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        ) : (
                            <div className="lawmakers-cards-grid">
                                {data.map((lawmaker) => (
                                    <ParliamentarianCard
                                        key={lawmaker.id}
                                        name={lawmaker.name}
                                        position={lawmaker.position}
                                        party={lawmaker.party}
                                        state={lawmaker.state}
                                        attendance={lawmaker.attendance}
                                        projects={lawmaker.projects}
                                        expenses={lawmaker.expenses}
                                        onView={() => onViewParliamentarian?.(lawmaker)}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Átomo: Paginação */}
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

                {/* Footer Institucional na Base */}
                <Footer />
            </main>
        </div>
    );
}

LawmakersPage.propTypes = {
    onNavigateToHome: PropTypes.func,
    onNavigateToLearn: PropTypes.func,
    onNavigateToChat: PropTypes.func,
    onNavigateToConfig: PropTypes.func,
    onNavigateToLogin: PropTypes.func,
    onViewParliamentarian: PropTypes.func,
};
