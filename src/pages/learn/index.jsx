import React, { useState, useMemo } from 'react';
import {
    RiGraduationCapLine,
    RiSearchLine,
    RiFilter3Line,
    RiBookOpenLine,
    RiTimeLine,
} from 'react-icons/ri';

import SideBar from '../../components/sidebar';
import Footer from '../../components/footer';
import CourseCard from '../../components/course-card';
import './style.css';

const MOCK_COURSES = [
    {
        id: 'introducao-politica',
        title: 'Introdução ao Sistema Político Brasileiro',
        description:
            'Aprenda como funciona a divisão dos Três Poderes, o pacto federativo e as funções de deputados, senadores e prefeitos.',
        category: 'Iniciantes',
        level: 'Básico',
        duration: '2h 15m',
        progress: 65,
        lessonsCount: 6,
    },
    {
        id: 'orcamento-e-ceap',
        title: 'Orçamento Público & Cota Parlamentar (CEAP)',
        description:
            'Entenda de onde vem o dinheiro público, como ler a LOA e auditar despesas de notas fiscais de gabinetes parlamentares.',
        category: 'Economia',
        level: 'Intermediário',
        duration: '3h 40m',
        progress: 25,
        lessonsCount: 8,
    },
    {
        id: 'processo-legislativo',
        title: 'Processo Legislativo: Como Leis são Aprovadas',
        description:
            'Do protocolo da proposta à sanção presidencial: desvende como tramitam Projetos de Lei (PL), PECs e Medidas Provisórias.',
        category: 'Direito',
        level: 'Avançado',
        duration: '4h 10m',
        progress: 0,
        lessonsCount: 10,
    },
    {
        id: 'fiscalizacao-e-lai',
        title: 'Fiscalização Cidadã e a Lei de Acesso à Informação',
        description:
            'Guia prático para formular pedidos via LAI, auditar contratos de compras públicas e fiscalizar o Diário Oficial.',
        category: 'Iniciantes',
        level: 'Básico',
        duration: '1h 50m',
        progress: 100,
        lessonsCount: 5,
    },
    {
        id: 'sistema-eleitoral',
        title: 'Sistema Eleitoral e Quociente Partidário',
        description:
            'Compreenda o cálculo do quociente eleitoral, a distribuição das sobras de votos e o financiamento de campanhas eleitorais.',
        category: 'Direito',
        level: 'Intermediário',
        duration: '2h 30m',
        progress: 0,
        lessonsCount: 6,
    },
    {
        id: 'politicas-publicas',
        title: 'Avaliação de Políticas Públicas com Evidências',
        description:
            'Metodologias de mensuração de impacto social, custo-efetividade e transparência de programas sociais governamentais.',
        category: 'Economia',
        level: 'Avançado',
        duration: '3h 15m',
        progress: 0,
        lessonsCount: 7,
    },
];

const CATEGORIES = ['Todos', 'Iniciantes', 'Economia', 'Direito'];

/**
 * LearnCatalog - Página da Academia Cívica (/learn)
 * Catálogo de trilhas com filtros por categoria e busca em tempo real.
 */
export default function LearnCatalog() {
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = useMemo(() => {
        return MOCK_COURSES.filter((course) => {
            const matchesCategory =
                selectedCategory === 'Todos' || course.category === selectedCategory;
            const matchesSearch =
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <div className="learn-catalog-layout">
            <div className="learn-sidebar-wrapper">
                <SideBar />
            </div>

            <main className="learn-catalog-main">
                <div className="learn-catalog-container">
                    {/* Header Institucional */}
                    <header className="learn-catalog-header">
                        <div className="learn-badge">
                            <RiGraduationCapLine size={16} />
                            <span>Academia Cívica Huari</span>
                        </div>

                        <div className="learn-header-title-row">
                            <div className="learn-title-block">
                                <h1>Trilhas de Formação Cidadã</h1>
                                <p>
                                    Cursos gratuitos, didáticos e apartidários desenvolvidos
                                    para você fiscalizar e entender a política brasileira.
                                </p>
                            </div>
                        </div>

                        {/* Barra de Filtros e Busca */}
                        <div className="learn-filters-bar">
                            <div className="learn-search-box">
                                <RiSearchLine className="learn-search-icon" size={18} />
                                <input
                                    type="text"
                                    className="learn-search-input"
                                    placeholder="Buscar trilhas ou temas cívicos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="learn-category-pills" role="tablist">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        className={`category-pill-btn ${selectedCategory === cat ? 'is-active' : ''}`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </header>

                    {/* Grade de Cursos / CourseCards */}
                    <section className="learn-courses-grid-section" aria-label="Catálogo de cursos">
                        {filteredCourses.length === 0 ? (
                            <div className="learn-empty-state">
                                <h3>Nenhuma trilha encontrada</h3>
                                <p>Tente buscar por outro termo ou selecione a categoria 'Todos'.</p>
                                <button
                                    type="button"
                                    className="btn-reset-learn"
                                    onClick={() => {
                                        setSelectedCategory('Todos');
                                        setSearchQuery('');
                                    }}
                                >
                                    Ver todos os cursos
                                </button>
                            </div>
                        ) : (
                            <div className="learn-courses-grid">
                                {filteredCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <Footer />
            </main>
        </div>
    );
}
