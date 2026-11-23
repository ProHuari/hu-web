import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    RiShieldStarLine,
    RiUser3Line,
    RiGraduationCapLine,
    RiSparklingLine,
    RiBookOpenLine,
    RiArrowRightLine,
    RiAddLine,
    RiFileEditLine,
    RiRobotLine,
    RiDatabase2Line,
    RiAlertLine,
    RiGovernmentLine,
} from 'react-icons/ri';
import { adminAnalyticsService } from '../../../services/admin-analytics-service';
import { SkeletonBlock } from '../../skeleton';
import './style.css';

function AdminDashboardSkeleton() {
    return (
        <div className="admin-dash-skeleton" aria-label="Carregando painel administrativo" role="status">
            <SkeletonBlock width="100%" height="150px" style={{ borderRadius: '16px' }} />
            <div className="admin-dash-kpis-grid">
                <SkeletonBlock width="100%" height="124px" style={{ borderRadius: '14px' }} />
                <SkeletonBlock width="100%" height="124px" style={{ borderRadius: '14px' }} />
                <SkeletonBlock width="100%" height="124px" style={{ borderRadius: '14px' }} />
                <SkeletonBlock width="100%" height="124px" style={{ borderRadius: '14px' }} />
            </div>
            <div className="admin-dash-analytics-row">
                <SkeletonBlock width="100%" height="320px" style={{ borderRadius: '16px' }} />
                <SkeletonBlock width="100%" height="320px" style={{ borderRadius: '16px' }} />
            </div>
        </div>
    );
}

export default function AdminDashboardView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        adminAnalyticsService
            .getDashboardMetrics()
            .then((res) => {
                if (isMounted) {
                    setData(res);
                }
            })
            .catch((err) => {
                console.error('Falha ao carregar métricas de administração', err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading || !data) {
        return <AdminDashboardSkeleton />;
    }

    const { overview, aiMetrics, courseEngagement, integrations = [], systemHealth } = data;
    const maxDailyCount = Math.max(...aiMetrics.dailyPromptVolume.map((d) => d.count), 1);

    return (
        <motion.div
            className="admin-dash"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
            <header className="admin-dash-header">
                <div className="admin-dash-header-left">
                    <span className="admin-dash-kicker">
                        <RiShieldStarLine size={14} /> Administração Huari
                    </span>
                    <h1 className="admin-dash-title">Painel da Plataforma</h1>
                    <p className="admin-dash-subtitle">
                        Dados consolidados de usuários, matrículas, consultas à Huari IA, transparência legislativa e integrações externas.
                    </p>
                </div>

                <div className="admin-dash-header-actions">
                    <Link
                        to="/admin/courses"
                        className="admin-dash-action-btn admin-dash-action-btn--secondary"
                    >
                        <RiFileEditLine size={16} aria-hidden="true" />
                        <span>Gerenciar trilhas</span>
                    </Link>
                    <Link
                        to="/admin/courses/new"
                        className="admin-dash-action-btn admin-dash-action-btn--primary"
                    >
                        <RiAddLine size={17} aria-hidden="true" />
                        <span>Nova trilha</span>
                    </Link>
                </div>
            </header>

            <section className="admin-dash-kpis-grid" aria-label="Indicadores do banco de dados">
                <div className="admin-dash-kpi-card">
                    <div className="admin-dash-kpi-top">
                        <span className="admin-dash-kpi-label">Usuários cadastrados</span>
                        <div className="admin-dash-kpi-icon">
                            <RiUser3Line size={19} aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="admin-dash-kpi-value-row">
                            <span className="admin-dash-kpi-value tabular-nums">
                                {overview.totalUsers.toLocaleString('pt-BR')}
                            </span>
                        </div>
                        <p className="admin-dash-kpi-sub">Contas ativas no banco</p>
                    </div>
                </div>

                <div className="admin-dash-kpi-card">
                    <div className="admin-dash-kpi-top">
                        <span className="admin-dash-kpi-label">Matrículas em trilhas</span>
                        <div className="admin-dash-kpi-icon">
                            <RiGraduationCapLine size={20} aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="admin-dash-kpi-value-row">
                            <span className="admin-dash-kpi-value tabular-nums">
                                {overview.totalEnrollments.toLocaleString('pt-BR')}
                            </span>
                            <span className="admin-dash-kpi-badge admin-dash-kpi-badge--neutral">
                                {courseEngagement.completionRate} concluídas
                            </span>
                        </div>
                        <p className="admin-dash-kpi-sub">Registros na Academia Cívica</p>
                    </div>
                </div>

                <div className="admin-dash-kpi-card">
                    <div className="admin-dash-kpi-top">
                        <span className="admin-dash-kpi-label">Consultas à Huari IA</span>
                        <div className="admin-dash-kpi-icon">
                            <RiSparklingLine size={19} aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="admin-dash-kpi-value-row">
                            <span className="admin-dash-kpi-value tabular-nums">
                                {overview.totalAiPrompts.toLocaleString('pt-BR')}
                            </span>
                            <span className="admin-dash-kpi-badge admin-dash-kpi-badge--neutral">
                                {aiMetrics.modeLabel}
                            </span>
                        </div>
                        <p className="admin-dash-kpi-sub">Histórico salvo no servidor</p>
                    </div>
                </div>

                <div className="admin-dash-kpi-card">
                    <div className="admin-dash-kpi-top">
                        <span className="admin-dash-kpi-label">Catálogo de trilhas</span>
                        <div className="admin-dash-kpi-icon">
                            <RiBookOpenLine size={19} aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="admin-dash-kpi-value-row">
                            <span className="admin-dash-kpi-value tabular-nums">
                                {overview.publishedCoursesCount}
                            </span>
                            {overview.draftCoursesCount > 0 && (
                                <span className="admin-dash-kpi-badge admin-dash-kpi-badge--neutral">
                                    {overview.draftCoursesCount} rascunho(s)
                                </span>
                            )}
                        </div>
                        <p className="admin-dash-kpi-sub">
                            {overview.totalLessonsCount} aulas publicadas
                        </p>
                    </div>
                </div>
            </section>

            <section className="admin-dash-analytics-row" aria-label="Uso da Huari IA e transparência">
                <div className="admin-dash-card">
                    <div className="admin-dash-card-header">
                        <div className="admin-dash-card-title-group">
                            <span className="admin-dash-card-tag">Huari IA</span>
                            <h2 className="admin-dash-card-title">Perguntas registradas nos últimos 7 dias</h2>
                            <p className="admin-dash-card-subtitle">
                                Volume diário persistido no histórico de atendimento cívico.
                            </p>
                        </div>
                        <span className="admin-dash-kpi-badge admin-dash-kpi-badge--positive" style={{ padding: '4px 10px' }}>
                            {systemHealth.aiApiStatus === 'OPERATIONAL' ? 'Gemini ativo' : 'Modo contingência'}
                        </span>
                    </div>

                    <div className="admin-ai-chart-section">
                        <div className="admin-ai-chart-header">
                            <span>Consultas por dia da semana</span>
                            <span className="tabular-nums">Total no histórico: {aiMetrics.totalPrompts}</span>
                        </div>
                        <div className="admin-ai-chart-bars">
                            {aiMetrics.dailyPromptVolume.map((item) => {
                                const heightPercent = item.count > 0 ? Math.max(8, Math.round((item.count / maxDailyCount) * 100)) : 4;
                                return (
                                    <div key={item.isoDate || item.day} className="admin-ai-bar-col">
                                        <div
                                            className="admin-ai-bar-fill"
                                            style={{ height: `${heightPercent}%` }}
                                            title={`${item.day}: ${item.count} perguntas`}
                                        />
                                        <span className="admin-ai-bar-day">{item.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="admin-ai-metric-tiles">
                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Parlamentares</span>
                            <span className="admin-ai-tile-value tabular-nums">
                                {overview.totalParliamentarians.toLocaleString('pt-BR')}
                            </span>
                            <span className="admin-ai-tile-hint">
                                {overview.deputiesCount} dep. · {overview.senatorsCount} sen.
                            </span>
                        </div>

                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Projetos de Lei</span>
                            <span className="admin-ai-tile-value tabular-nums">
                                {overview.totalBillsCount.toLocaleString('pt-BR')}
                            </span>
                            <span className="admin-ai-tile-hint">Indexados para RAG</span>
                        </div>

                        <div className="admin-ai-tile" style={{ gridColumn: 'span 2' }}>
                            <span className="admin-ai-tile-label">Despesas CEAP na base</span>
                            <span className="admin-ai-tile-value tabular-nums">
                                {overview.totalExpensesFormatted}
                            </span>
                            <span className="admin-ai-tile-hint">
                                <RiGovernmentLine size={12} /> Soma consolidada no MySQL
                            </span>
                        </div>
                    </div>
                </div>

                <div className="admin-dash-card">
                    <div className="admin-dash-card-header">
                        <div className="admin-dash-card-title-group">
                            <span className="admin-dash-card-tag">Histórico recente</span>
                            <h2 className="admin-dash-card-title">Últimas perguntas enviadas à IA</h2>
                            <p className="admin-dash-card-subtitle">
                                Registros mais recentes de consultas realizadas na plataforma.
                            </p>
                        </div>
                        <RiRobotLine size={20} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                    </div>

                    {aiMetrics.recentTopics.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                            Nenhuma pergunta registrada no histórico autenticado ainda.
                        </p>
                    ) : (
                        <div className="admin-topics-list">
                            {aiMetrics.recentTopics.map((topic, idx) => (
                                <div key={topic.id} className="admin-topic-item">
                                    <div className="admin-topic-meta">
                                        <span className="admin-topic-title">
                                            <span className="admin-topic-badge">{idx + 1}</span>
                                            <span>{topic.topic}</span>
                                        </span>
                                        {topic.createdAt && (
                                            <span className="admin-topic-count tabular-nums">
                                                {new Date(topic.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="admin-dash-analytics-row" aria-label="Cursos e status de integrações">
                <div className="admin-dash-card">
                    <div className="admin-dash-card-header">
                        <div className="admin-dash-card-title-group">
                            <span className="admin-dash-card-tag">Academia Cívica</span>
                            <h2 className="admin-dash-card-title">Trilhas no catálogo</h2>
                            <p className="admin-dash-card-subtitle">
                                Ordenado pelo volume real de matrículas no banco.
                            </p>
                        </div>
                        <Link
                            to="/admin/courses"
                            className="admin-dash-action-btn admin-dash-action-btn--secondary"
                            style={{
                                color: 'var(--color-primary)',
                                backgroundColor: 'var(--color-scale-primary-50)',
                                borderColor: 'var(--color-scale-primary-200)',
                                padding: '0.45rem 0.85rem',
                                fontSize: '0.8rem',
                            }}
                        >
                            <span>Ver todas</span>
                            <RiArrowRightLine size={14} />
                        </Link>
                    </div>

                    {courseEngagement.topCourses.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                            Nenhum curso cadastrado no momento.
                        </p>
                    ) : (
                        <div className="admin-courses-ranked-list">
                            {courseEngagement.topCourses.map((course, idx) => (
                                <div key={course.id} className="admin-course-rank-item">
                                    <div className="admin-course-rank-left">
                                        <span className="admin-course-rank-number">#{idx + 1}</span>
                                        <div className="admin-course-rank-details">
                                            <span className="admin-course-rank-title">{course.title}</span>
                                            <div className="admin-course-rank-stats">
                                                <span>{course.category}</span>
                                                <span>·</span>
                                                <span className="tabular-nums">{course.lessonsCount} aulas</span>
                                                <span>·</span>
                                                <span className="tabular-nums">{course.enrolledStudents} matrículas</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="admin-course-rank-actions">
                                        <Link
                                            to={`/admin/courses/${course.id}/edit`}
                                            className="admin-mini-edit-btn"
                                            title={`Editar ${course.title}`}
                                        >
                                            <RiFileEditLine size={13} />
                                            <span>Editar</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-dash-card" style={{ justifyContent: 'space-between' }}>
                    <div className="admin-dash-card-header">
                        <div className="admin-dash-card-title-group">
                            <span className="admin-dash-card-tag">Integrações oficiais</span>
                            <h2 className="admin-dash-card-title">Status das APIs conectadas</h2>
                            <p className="admin-dash-card-subtitle">
                                Monitoramento retornado pelo endpoint de saúde do backend.
                            </p>
                        </div>
                        <RiDatabase2Line size={20} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                    </div>

                    {integrations.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                            Não foi possível consultar o status das integrações externas agora.
                        </p>
                    ) : (
                        <div className="admin-topics-list">
                            {integrations.map((item) => (
                                <div key={item.id || item.name} className="admin-topic-item">
                                    <div className="admin-topic-meta">
                                        <span className="admin-topic-title">
                                            <span>{item.name}</span>
                                        </span>
                                        <span
                                            className={`admin-dash-kpi-badge ${
                                                item.status === 'ONLINE'
                                                    ? 'admin-dash-kpi-badge--positive'
                                                    : 'admin-dash-kpi-badge--neutral'
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {overview.draftCoursesCount > 0 && (
                        <div className="admin-draft-alert-banner">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <RiAlertLine size={22} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                <div className="admin-draft-alert-text">
                                    <h4 className="admin-draft-alert-title">
                                        {overview.draftCoursesCount} trilha(s) em rascunho
                                    </h4>
                                    <p className="admin-draft-alert-desc">
                                        Revise antes de publicar para todos os cidadãos.
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/admin/courses"
                                className="admin-dash-action-btn admin-dash-action-btn--primary"
                                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                            >
                                Revisar
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}
