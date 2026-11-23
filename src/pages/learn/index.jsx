import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { RiSearchLine, RiAddLine, RiSettings4Line, RiShieldStarLine } from 'react-icons/ri';
import { PageTransition, StaggerGrid, StaggerItem } from '../../components/motion/MotionPrimitives';
import PageHeader from '../../components/page-header';
import EmptyState from '../../components/empty-state';
import CourseCard from '../../components/course-card';
import { CourseCardSkeleton } from '../../components/skeleton';
import { useApp } from '../../context/AppContext';
import { coursesService } from '../../services/courses-service';
import './style.css';

export default function LearnCatalog() {
    const { isAdmin = false } = useApp() || {};
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState(['Todas']);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [reloadTick, setReloadTick] = useState(0);

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            coursesService.getCourses(),
            coursesService.getCategories(),
        ])
            .then(([fetchedCourses, fetchedCategories]) => {
                if (isMounted) {
                    if (Array.isArray(fetchedCourses)) {
                        setCourses(fetchedCourses);
                    }
                    if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
                        setCategories(fetchedCategories);
                    }
                }
            })
            .catch((err) => {
                console.error('Falha ao carregar trilhas de ensino', err);
                if (isMounted) {
                    setLoadError(err?.message || 'Não foi possível carregar o catálogo de trilhas.');
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [reloadTick]);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesCategory =
                selectedCategory === 'Todas' ||
                selectedCategory === 'All' ||
                course.category === selectedCategory;
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                (course.title && course.title.toLowerCase().includes(query)) ||
                (course.description && course.description.toLowerCase().includes(query));
            return matchesCategory && matchesSearch;
        });
    }, [courses, selectedCategory, searchQuery]);

    return (
        <PageTransition className="learn-page-container">
            <PageHeader
                badgeText="Academia Cívica"
                title="Trilhas de Formação Cidadã"
                description="Aulas objetivas e gratuitas sobre orçamento público, processo legislativo e ferramentas de acompanhamento de mandatos."
            />

            {isAdmin && (
                <div className="learn-admin-bar" role="region" aria-label="Atalhos de administração de cursos">
                    <div className="learn-admin-bar-label">
                        <RiShieldStarLine size={16} aria-hidden="true" />
                        <span>Gestão do catálogo</span>
                    </div>
                    <div className="learn-admin-bar-actions">
                        <Link to="/admin/courses" className="learn-admin-secondary-link">
                            <RiSettings4Line size={15} aria-hidden="true" />
                            <span>Gerenciar cursos</span>
                        </Link>
                        <Link to="/admin/courses/new" className="learn-admin-primary-link">
                            <RiAddLine size={16} aria-hidden="true" />
                            <span>Novo curso</span>
                        </Link>
                    </div>
                </div>
            )}

            <div className="learn-filters-bar">
                <div className="learn-search-box">
                    <RiSearchLine className="learn-search-icon" size={18} aria-hidden="true" />
                    <input
                        type="text"
                        className="learn-search-input"
                        placeholder="Buscar trilhas, temas ou módulos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Buscar trilhas de ensino"
                    />
                </div>

                <div className="learn-category-pills" role="tablist" aria-label="Categorias de ensino">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                className={`category-pill-btn ${isActive ? 'is-active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="learnCategoryPill"
                                        className="category-pill-active-bg"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <section className="learn-courses-grid-section" aria-label="Catálogo de trilhas">
                {loading ? (
                    <div className="learn-courses-grid" role="status" aria-label="Carregando trilhas de ensino">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <CourseCardSkeleton key={idx} />
                        ))}
                    </div>
                ) : loadError ? (
                    <EmptyState
                        title="Não foi possível carregar as trilhas"
                        description={loadError}
                        actionText="Tentar novamente"
                        onAction={() => {
                            setLoading(true);
                            setLoadError(null);
                            setReloadTick((prev) => prev + 1);
                        }}
                    />
                ) : filteredCourses.length === 0 ? (
                    <EmptyState
                        title="Nenhuma trilha encontrada"
                        description="Tente buscar por outro termo ou selecione 'Todas' para ver o catálogo completo."
                        actionText="Ver todas as trilhas"
                        onAction={() => {
                            setSelectedCategory('Todas');
                            setSearchQuery('');
                        }}
                    />
                ) : (
                    <StaggerGrid className="learn-courses-grid">
                        {filteredCourses.map((course) => (
                            <StaggerItem key={course.id}>
                                <CourseCard course={course} />
                            </StaggerItem>
                        ))}
                    </StaggerGrid>
                )}
            </section>
        </PageTransition>
    );
}
