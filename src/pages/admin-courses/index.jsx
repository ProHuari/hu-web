import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch, FiShield, FiBookOpen } from 'react-icons/fi';
import { PageTransition } from '../../components/motion/MotionPrimitives';
import Button from '../../components/button';
import EmptyState from '../../components/empty-state';
import ConfirmModal from '../../components/confirm-modal';
import { AdminTableSkeleton } from '../../components/skeleton';
import AdminCourseTable from '../../components/admin/course-table';
import { useAdminCourses } from '../../hooks/useAdminCourses';
import { coursesService } from '../../services/courses-service';
import './style.css';

export default function AdminCoursesPage() {
    const navigate = useNavigate();
    const {
        courses,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        reload,
        toggleCourseStatus,
        removeCourse,
    } = useAdminCourses();

    const [categories, setCategories] = useState(['Todas']);
    const [courseToDelete, setCourseToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let active = true;
        coursesService
            .getCategories()
            .then((list) => {
                if (active && Array.isArray(list) && list.length > 0) {
                    setCategories(list);
                }
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const stats = useMemo(() => {
        const published = courses.filter((c) => c.status === 'PUBLISHED').length;
        const drafts = courses.filter((c) => c.status !== 'PUBLISHED').length;
        const lessons = courses.reduce((sum, c) => sum + (c.lessonsCount || 0), 0);
        return {
            total: courses.length,
            published,
            drafts,
            lessons,
        };
    }, [courses]);

    const handleConfirmDelete = async () => {
        if (!courseToDelete) return;
        setDeleting(true);
        await removeCourse(courseToDelete);
        setDeleting(false);
        setCourseToDelete(null);
    };

    return (
        <PageTransition className="admin-courses-page">
            <header className="admin-page-topbar">
                <div>
                    <span className="admin-page-kicker">
                        <FiShield size={13} /> Administração
                    </span>
                    <h1 className="admin-page-title">Gerenciar Trilhas e Cursos</h1>
                    <p className="admin-page-subtitle">
                        Crie, organize módulos e publique cursos gratuitos para a Academia Cívica.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Link
                        to="/learn"
                        className="admin-icon-btn"
                        style={{ height: '40px', padding: '0 1rem' }}
                    >
                        Ver catálogo público
                    </Link>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => navigate('/admin/courses/new')}
                    >
                        <FiPlus size={16} /> Nova trilha
                    </Button>
                </div>
            </header>

            <section className="admin-stats-strip" aria-label="Resumo do catálogo">
                <div className="admin-stat-tile">
                    <span className="admin-stat-label">Trilhas listadas</span>
                    <span className="admin-stat-value tabular-nums">{stats.total}</span>
                </div>
                <div className="admin-stat-tile">
                    <span className="admin-stat-label">Publicadas</span>
                    <span className="admin-stat-value tabular-nums" style={{ color: 'var(--color-scale-success-700, #047857)' }}>
                        {stats.published}
                    </span>
                </div>
                <div className="admin-stat-tile">
                    <span className="admin-stat-label">Rascunhos</span>
                    <span className="admin-stat-value tabular-nums" style={{ color: 'var(--color-scale-warning-700, #b45309)' }}>
                        {stats.drafts}
                    </span>
                </div>
                <div className="admin-stat-tile">
                    <span className="admin-stat-label">Total de aulas</span>
                    <span className="admin-stat-value tabular-nums">{stats.lessons}</span>
                </div>
            </section>

            <section className="admin-toolbar" aria-label="Filtrar cursos">
                <div className="admin-search-box">
                    <FiSearch size={16} className="admin-search-icon" aria-hidden="true" />
                    <input
                        type="search"
                        className="admin-search-input"
                        placeholder="Buscar por título ou instrutor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Buscar trilhas"
                    />
                </div>

                <div className="admin-filter-group">
                    <select
                        className="admin-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        aria-label="Filtrar por status"
                    >
                        <option value="ALL">Todos os status</option>
                        <option value="PUBLISHED">Publicados</option>
                        <option value="DRAFT">Rascunhos</option>
                    </select>

                    <select
                        className="admin-filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        aria-label="Filtrar por categoria"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat === 'Todas' ? 'All' : cat}>
                                {cat === 'All' || cat === 'Todas' ? 'Todas as categorias' : cat}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            {error ? (
                <EmptyState
                    icon={FiBookOpen}
                    title="Não foi possível carregar os cursos"
                    description={error}
                    actionText="Tentar novamente"
                    onAction={reload}
                />
            ) : loading ? (
                <AdminTableSkeleton rows={5} />
            ) : courses.length === 0 ? (
                <EmptyState
                    icon={FiBookOpen}
                    title="Nenhuma trilha encontrada"
                    description="Crie uma nova trilha ou limpe os filtros de busca aplicados."
                    actionText="Criar primeira trilha"
                    onAction={() => navigate('/admin/courses/new')}
                />
            ) : (
                <AdminCourseTable
                    courses={courses}
                    onToggleStatus={toggleCourseStatus}
                    onDeleteRequest={(course) => setCourseToDelete(course)}
                />
            )}

            <ConfirmModal
                isOpen={Boolean(courseToDelete)}
                title="Excluir trilha permanentemente?"
                description={
                    courseToDelete
                        ? `Isso removerá "${courseToDelete.title}" e todos os seus módulos e aulas.`
                        : ''
                }
                confirmText="Excluir trilha"
                cancelText="Cancelar"
                variant="danger"
                isLoading={deleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => !deleting && setCourseToDelete(null)}
            />
        </PageTransition>
    );
}
