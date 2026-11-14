/**
 * Admin Analytics Service for Huari Platform.
 * Provides aggregated platform KPIs, AI usage analytics, and course engagement metrics.
 * Designed with a structured mock schema that easily hooks into future backend telemetry endpoints.
 */

import { coursesService } from './coursesService';

export const INITIAL_ADMIN_METRICS = {
    overview: {
        totalUsers: 2840,
        usersGrowth: '+14.2%',
        activeLearners: 1420,
        learnersGrowth: '+8.6%',
        totalAiPrompts: 14920,
        aiPromptsGrowth: '+26.8%',
        publishedCoursesCount: 8,
        draftCoursesCount: 3,
    },
    aiMetrics: {
        totalPrompts: 14920,
        avgResponseTime: '1.18s',
        modelSatisfaction: '98.6%',
        activeSessionsToday: 342,
        tokensProcessed: '18.4M',
        topTopics: [
            { id: 1, topic: 'Auditoria de Cota Parlamentar (CEAP)', count: 4820, percentage: 32 },
            { id: 2, topic: 'Tramitação da Reforma Tributária (PECs)', count: 3240, percentage: 22 },
            { id: 3, topic: 'Presença e Votações em Plenário', count: 2680, percentage: 18 },
            { id: 4, topic: 'Destinação de Emendas Individuais', count: 2150, percentage: 14 },
            { id: 5, topic: 'Processo Orçamentário Municipal (LOA/LDO)', count: 2030, percentage: 14 },
        ],
        dailyPromptVolume: [
            { day: 'Seg', count: 1840 },
            { day: 'Ter', count: 2210 },
            { day: 'Qua', count: 2480 },
            { day: 'Qui', count: 2650 },
            { day: 'Sex', count: 2310 },
            { day: 'Sáb', count: 1680 },
            { day: 'Dom', count: 1750 },
        ],
    },
    courseEngagement: {
        activeLearners: 1420,
        completionRate: '68.4%',
        totalCertificatesIssued: 412,
        avgTimePerTrack: '2h 15m',
        topCourses: [
            {
                id: 'orcamento-municipal',
                title: 'Orçamento Municipal e Fiscalização Cidadã',
                category: 'Budget & Auditing',
                enrolledStudents: 684,
                completionRate: 74,
                status: 'PUBLISHED',
            },
            {
                id: 'processo-legislativo',
                title: 'Anatomia do Processo Legislativo Brasileiro',
                category: 'Legislative',
                enrolledStudents: 512,
                completionRate: 69,
                status: 'PUBLISHED',
            },
            {
                id: 'auditoria-ceap',
                title: 'Auditoria Cidadã de Cota Parlamentar (CEAP)',
                category: 'Civic Action',
                enrolledStudents: 430,
                completionRate: 62,
                status: 'PUBLISHED',
            },
        ],
    },
    systemHealth: {
        aiApiStatus: 'OPERATIONAL',
        aiLatencyMs: 142,
        databaseUptime: '99.98%',
        lastDataSync: 'Hoje, há 12 minutos',
    },
};

export const adminAnalyticsService = {
    /**
     * Fetch complete dashboard analytics combining real course store stats and platform telemetry.
     */
    async getDashboardMetrics() {
        // Simulate realistic network roundtrip for skeleton demonstration
        await new Promise((resolve) => setTimeout(resolve, 260));

        let publishedCount = INITIAL_ADMIN_METRICS.overview.publishedCoursesCount;
        let draftCount = INITIAL_ADMIN_METRICS.overview.draftCoursesCount;

        try {
            const adminCourses = await coursesService.getAdminCourses();
            if (Array.isArray(adminCourses) && adminCourses.length > 0) {
                publishedCount = adminCourses.filter((c) => c.status === 'PUBLISHED').length;
                draftCount = adminCourses.filter((c) => c.status !== 'PUBLISHED').length;
            }
        } catch (err) {
            console.warn('Could not read courses store for admin overview stats', err);
        }

        return {
            ...INITIAL_ADMIN_METRICS,
            overview: {
                ...INITIAL_ADMIN_METRICS.overview,
                publishedCoursesCount: publishedCount,
                draftCoursesCount: draftCount,
            },
        };
    },
};
