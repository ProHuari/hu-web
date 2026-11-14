import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    RiShieldStarLine,
    RiUser3Line,
    RiGraduationCapLine,
    RiSparklingLine,
    RiBookOpenLine,
    RiTimeLine,
    RiArrowRightUpLine,
    RiArrowRightLine,
    RiAddLine,
    RiFileEditLine,
    RiRobotLine,
    RiCheckboxCircleLine,
    RiDatabase2Line,
    RiAlertLine,
} from 'react-icons/ri';
import { adminAnalyticsService } from '../../../services/adminAnalyticsService';
import { SkeletonBlock } from '../../skeleton';
import './style.css';

function AdminDashboardSkeleton() {
    return (
        <div className="admin-dash-skeleton" aria-label="Carregando métricas executivas" role="status">
            <SkeletonBlock width="100%" height="160px" style={{ borderRadius: '16px' }} />
            <div className="admin-dash-kpis-grid">
                <SkeletonBlock width="100%" height="130px" style={{ borderRadius: '14px' }} />
                <SkeletonBlock width="100%" height="130px" style={{ borderRadius: '14px' }} />
                <SkeletonBlock width="100%" height="130px" style={{ borderRadius: '14px' }} />
                <SkeletonBlock width="100%" height="130px" style={{ borderRadius: '14px' }} />
            </div>
            <div className="admin-dash-analytics-row">
                <SkeletonBlock width="100%" height="340px" style={{ borderRadius: '16px' }} />
                <SkeletonBlock width="100%" height="340px" style={{ borderRadius: '16px' }} />
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

    const { overview, aiMetrics, courseEngagement, systemHealth } = data;

    // Calculate maximum prompt count for bar chart scaling
    const maxDailyCount = Math.max(...aiMetrics.dailyPromptVolume.map((d) => d.count), 1);

    return (
        <motion.div
            className="admin-dash"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Header Executivo com Ações Rápidas */}
            <header className="admin-dash-header">
                <div className="admin-dash-header-left">
                    <span className="admin-dash-kicker">
                        <span className="admin-dash-status-dot" aria-hidden="true" />
                        <RiShieldStarLine size={14} /> Huari Admin Studio • Gestão Cívica
                    </span>
                    <h1 className="admin-dash-title">Painel de Controle da Plataforma</h1>
                    <p className="admin-dash-subtitle">
                        Visão consolidada de engajamento dos cidadãos, performance e volume da Huari AI, e status de produção da Academia Cívica.
                    </p>
                </div>

                <div className="admin-dash-header-actions">
                    <Link
                        to="/admin/courses"
                        className="admin-dash-action-btn admin-dash-action-btn--secondary"
                    >
                        <RiFileEditLine size={16} aria-hidden="true" />
                        <span>Gerenciar Cursos</span>
                    </Link>
                    <Link
                        to="/admin/courses/new"
                        className="admin-dash-action-btn admin-dash-action-btn--primary"
                    >
                        <RiAddLine size={17} aria-hidden="true" />
                        <span>Novo Curso</span>
                    </Link>
                </div>
            </header>

            {/* Grid 1: KPIs Principais de Plataforma */}
            <section className="admin-dash-kpis-grid" aria-label="Métricas Principais da Plataforma">
                {/* Total de Usuários */}
                <div className="admin-dash-kpi-card">
                    <div className="admin-dash-kpi-top">
                        <span className="admin-dash-kpi-label">Usuários Cadastrados</span>
                        <div className="admin-dash-kpi-icon">
                            <RiUser3Line size={19} aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="admin-dash-kpi-value-row">
                            <span className="admin-dash-kpi-value tabular-nums">
                                {overview.totalUsers.toLocaleString('pt-BR')}
                            </span>
                            <span className="admin-dash-kpi-badge admin-dash-kpi-badge--positive">
                                <RiArrowRightUpLine size={13} /> {overview.usersGrowth}
                            </span>
                        </div>
                        <p className="admin-dash-kpi-sub">Cidadãos e analistas ativos</p>
                    </div>
                </div>

                {/* Alunos Ativos */}
                <div className="admin-dash-kpi-card">
                    <div className="admin-dash-kpi-top">
                        <span className="admin-dash-kpi-label">Alunos em Aprendizado</span>
                        <div className="admin-dash-kpi-icon">
                            <RiGraduationCapLine size={20} aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="admin-dash-kpi-value-row">
                            <span className="admin-dash-kpi-value tabular-nums">
                                {overview.activeLearners.toLocaleString('pt-BR')}
                            </span>
                            <span className="admin-dash-kpi-badge admin-dash-kpi-badge--positive">
                                <RiArrowRightUpLine size={13} /> {overview.learnersGrowth}
                            </span>
                        </div>
                        <p className="admin-dash-kpi-sub">Com progresso em ao menos 1 trilha</p>
                    </div>
                </div>

                {/* Prompts IA */}
                <div className="admin-dash-kpi-card">
                    <div className="admin-dash-kpi-top">
                        <span className="admin-dash-kpi-label">Consultas Huari AI</span>
                        <div className="admin-dash-kpi-icon">
                            <RiSparklingLine size={19} aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="admin-dash-kpi-value-row">
                            <span className="admin-dash-kpi-value tabular-nums">
                                {overview.totalAiPrompts.toLocaleString('pt-BR')}
                            </span>
                            <span className="admin-dash-kpi-badge admin-dash-kpi-badge--positive">
                                <RiArrowRightUpLine size={13} /> {overview.aiPromptsGrowth}
                            </span>
                        </div>
                        <p className="admin-dash-kpi-sub">Perguntas cívicas respondidas</p>
                    </div>
                </div>

                {/* Cursos: Publicados vs Rascunhos */}
                <div className="admin-dash-kpi-card">
                    <div className="admin-dash-kpi-top">
                        <span className="admin-dash-kpi-label">Catálogo de Cursos</span>
                        <div className="admin-dash-kpi-icon">
                            <RiBookOpenLine size={19} aria-hidden="true" />
                        </div>
                    </div>
                    <div>
                        <div className="admin-dash-kpi-value-row">
                            <span className="admin-dash-kpi-value tabular-nums">
                                {overview.publishedCoursesCount}
                            </span>
                            <span className="admin-dash-kpi-badge admin-dash-kpi-badge--neutral">
                                {overview.draftCoursesCount} em rascunho
                            </span>
                        </div>
                        <p className="admin-dash-kpi-sub">Trilhas disponíveis para cidadãos</p>
                    </div>
                </div>
            </section>

            {/* Grid 2: Inteligência Artificial (Uso, Performance e Tópicos) */}
            <section className="admin-dash-analytics-row" aria-label="Métricas de Uso da Huari AI">
                {/* Métricas de Uso e Gráfico da IA */}
                <div className="admin-dash-card">
                    <div className="admin-dash-card-header">
                        <div className="admin-dash-card-title-group">
                            <span className="admin-dash-card-tag">Huari Civic AI</span>
                            <h2 className="admin-dash-card-title">Performance e Volume de Consultas</h2>
                            <p className="admin-dash-card-subtitle">
                                Monitoramento de latência, uptime e assertividade do modelo de auditoria cívica.
                            </p>
                        </div>
                        <span
                            className="admin-dash-kpi-badge admin-dash-kpi-badge--positive"
                            style={{ padding: '4px 10px' }}
                        >
                            {systemHealth.aiApiStatus === 'OPERATIONAL' ? '● API Online' : 'Alerta'}
                        </span>
                    </div>

                    <div className="admin-ai-metric-tiles">
                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Tempo Resposta</span>
                            <span className="admin-ai-tile-value tabular-nums">{aiMetrics.avgResponseTime}</span>
                            <span className="admin-ai-tile-hint">Meta &lt; 2.0s</span>
                        </div>

                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Satisfação</span>
                            <span className="admin-ai-tile-value tabular-nums">{aiMetrics.modelSatisfaction}</span>
                            <span className="admin-ai-tile-hint">Avaliações positivas</span>
                        </div>

                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Sessões Hoje</span>
                            <span className="admin-ai-tile-value tabular-nums">{aiMetrics.activeSessionsToday}</span>
                            <span className="admin-ai-tile-hint">Em tempo real</span>
                        </div>

                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Tokens</span>
                            <span className="admin-ai-tile-value tabular-nums">{aiMetrics.tokensProcessed}</span>
                            <span className="admin-ai-tile-hint">Processados / mês</span>
                        </div>
                    </div>

                    {/* Gráfico Simulado de Volume Diário */}
                    <div className="admin-ai-chart-section">
                        <div className="admin-ai-chart-header">
                            <span>Volume Diário de Consultas (Últimos 7 dias)</span>
                            <span className="tabular-nums">Média: ~2.150/dia</span>
                        </div>
                        <div className="admin-ai-chart-bars">
                            {aiMetrics.dailyPromptVolume.map((item) => {
                                const heightPercent = Math.round((item.count / maxDailyCount) * 100);
                                return (
                                    <div key={item.day} className="admin-ai-bar-col">
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
                </div>

                {/* Tópicos Mais Perguntados à IA */}
                <div className="admin-dash-card">
                    <div className="admin-dash-card-header">
                        <div className="admin-dash-card-title-group">
                            <span className="admin-dash-card-tag">Interesse Cidadão</span>
                            <h2 className="admin-dash-card-title">Tópicos Mais Perguntados</h2>
                            <p className="admin-dash-card-subtitle">
                                Assuntos de maior procura entre cidadãos que interagem com o Chat Huari.
                            </p>
                        </div>
                        <RiRobotLine size={20} style={{ color: 'var(--color-primary)' }} aria-hidden="true" />
                    </div>

                    <div className="admin-topics-list">
                        {aiMetrics.topTopics.map((topic) => (
                            <div key={topic.id} className="admin-topic-item">
                                <div className="admin-topic-meta">
                                    <span className="admin-topic-title">
                                        <span className="admin-topic-badge">{topic.id}</span>
                                        <span>{topic.topic}</span>
                                    </span>
                                    <span className="admin-topic-count tabular-nums">
                                        {topic.count.toLocaleString('pt-BR')} ({topic.percentage}%)
                                    </span>
                                </div>
                                <div className="admin-topic-bar-bg">
                                    <div
                                        className="admin-topic-bar-fill"
                                        style={{ width: `${topic.percentage * 3}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid 3: Engajamento Acadêmico e Cursos Mais Acessados */}
            <section className="admin-dash-analytics-row" aria-label="Engajamento com Cursos e Eficiência">
                {/* Ranking de Cursos Mais Acessados */}
                <div className="admin-dash-card">
                    <div className="admin-dash-card-header">
                        <div className="admin-dash-card-title-group">
                            <span className="admin-dash-card-tag">Academia Cívica</span>
                            <h2 className="admin-dash-card-title">Cursos Mais Acessados</h2>
                            <p className="admin-dash-card-subtitle">
                                Trilhas com maior volume de matrículas e taxa de conclusão de aulas.
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
                            <span>Ver Todos</span>
                            <RiArrowRightLine size={14} />
                        </Link>
                    </div>

                    <div className="admin-courses-ranked-list">
                        {courseEngagement.topCourses.map((course, idx) => (
                            <div key={course.id} className="admin-course-rank-item">
                                <div className="admin-course-rank-left">
                                    <span className="admin-course-rank-number">#{idx + 1}</span>
                                    <div className="admin-course-rank-details">
                                        <span className="admin-course-rank-title">{course.title}</span>
                                        <div className="admin-course-rank-stats">
                                            <span>{course.category}</span>
                                            <span>•</span>
                                            <span className="tabular-nums">
                                                {course.enrolledStudents} alunos
                                            </span>
                                            <span>•</span>
                                            <span className="tabular-nums">
                                                {course.completionRate}% conclusão
                                            </span>
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
                </div>

                {/* Eficiência da Academia & Alertas Rápidos */}
                <div className="admin-dash-card" style={{ justifyContent: 'space-between' }}>
                    <div className="admin-dash-card-header">
                        <div className="admin-dash-card-title-group">
                            <span className="admin-dash-card-tag">Métricas Pedagógicas</span>
                            <h2 className="admin-dash-card-title">Retenção e Conclusões</h2>
                            <p className="admin-dash-card-subtitle">
                                Indicadores de eficácia didática nas trilhas de capacitação cidadã.
                            </p>
                        </div>
                    </div>

                    <div className="admin-ai-metric-tiles" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Taxa Conclusão Média</span>
                            <span className="admin-ai-tile-value tabular-nums" style={{ color: 'var(--color-success)' }}>
                                {courseEngagement.completionRate}
                            </span>
                            <span className="admin-ai-tile-hint">
                                <RiCheckboxCircleLine size={12} /> Alta retenção
                            </span>
                        </div>

                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Certificados Emitidos</span>
                            <span className="admin-ai-tile-value tabular-nums">
                                {courseEngagement.totalCertificatesIssued}
                            </span>
                            <span className="admin-ai-tile-hint">Total acumulado</span>
                        </div>

                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Tempo Médio / Trilha</span>
                            <span className="admin-ai-tile-value tabular-nums">
                                {courseEngagement.avgTimePerTrack}
                            </span>
                            <span className="admin-ai-tile-hint">
                                <RiTimeLine size={12} /> Ritmo ideal
                            </span>
                        </div>

                        <div className="admin-ai-tile">
                            <span className="admin-ai-tile-label">Sincronização</span>
                            <span className="admin-ai-tile-value" style={{ fontSize: '1rem', marginTop: '0.2rem' }}>
                                {systemHealth.lastDataSync}
                            </span>
                            <span className="admin-ai-tile-hint">
                                <RiDatabase2Line size={12} /> Base atualizada
                            </span>
                        </div>
                    </div>

                    {/* Alerta de Cursos em Rascunho */}
                    {overview.draftCoursesCount > 0 && (
                        <div className="admin-draft-alert-banner">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <RiAlertLine size={24} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                                <div className="admin-draft-alert-text">
                                    <h4 className="admin-draft-alert-title">
                                        {overview.draftCoursesCount} curso(s) em rascunho
                                    </h4>
                                    <p className="admin-draft-alert-desc">
                                        Existem cursos não publicados aguardando revisão final para disponibilização aos cidadãos.
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/admin/courses"
                                className="admin-dash-action-btn admin-dash-action-btn--primary"
                                style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                            >
                                Revisar Agora
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}
