/**
 * Admin Analytics Service for Huari Platform.
 * Aggregates real metrics directly from Spring Boot MySQL endpoints:
 * /cursos, /transparencia/resumo, /transparencia/integracoes/status,
 * /usuarios, /matriculas, and /historico-ia.
 */

import { apiClient } from './api';
import { coursesService } from './courses-service';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

function buildDailyVolume(historyItems = []) {
    const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();
    const buckets = [];

    for (let offset = 6; offset >= 0; offset--) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        const isoDate = date.toISOString().slice(0, 10);
        buckets.push({
            isoDate,
            day: dayLabels[date.getDay()],
            count: 0,
        });
    }

    const indexByDate = new Map(buckets.map((b, idx) => [b.isoDate, idx]));
    historyItems.forEach((item) => {
        const dateStr = item?.createdAt ? String(item.createdAt).slice(0, 10) : null;
        if (dateStr && indexByDate.has(dateStr)) {
            buckets[indexByDate.get(dateStr)].count += 1;
        }
    });

    return buckets;
}

function buildTopTopics(historyItems = []) {
    if (!Array.isArray(historyItems) || historyItems.length === 0) {
        return [];
    }

    const total = historyItems.length;
    return historyItems.slice(0, 5).map((item, idx) => ({
        id: item.id || idx + 1,
        topic: item.question || 'Consulta cívica registrada',
        createdAt: item.createdAt || null,
        count: 1,
        percentage: Math.max(10, Math.round(100 / Math.min(total, 5))),
    }));
}

export const adminAnalyticsService = {
    async getDashboardMetrics() {
        const [
            coursesRes,
            transparencyRes,
            integrationsRes,
            usersRes,
            enrollmentsRes,
            aiHistoryRes,
        ] = await Promise.allSettled([
            coursesService.getAdminCourses(),
            apiClient('/transparencia/resumo'),
            apiClient('/transparencia/integracoes/status'),
            apiClient('/usuarios', { params: { page: 0, size: 100 } }),
            apiClient('/matriculas', { params: { page: 0, size: 200 } }),
            apiClient('/historico-ia', { params: { page: 0, size: 100 } }),
        ]);

        const adminCourses = coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value)
            ? coursesRes.value
            : [];
        const publishedCoursesCount = adminCourses.filter((c) => c.status !== 'DRAFT').length;
        const draftCoursesCount = adminCourses.filter((c) => c.status === 'DRAFT').length;
        const totalLessonsCount = adminCourses.reduce(
            (sum, c) => sum + (c.lessonsCount || 0),
            0
        );

        const transparency = transparencyRes.status === 'fulfilled' ? transparencyRes.value || {} : {};
        const integrationsData = integrationsRes.status === 'fulfilled' ? integrationsRes.value || {} : {};
        const integrationItems = Array.isArray(integrationsData.items) ? integrationsData.items : [];

        const usersPage = usersRes.status === 'fulfilled' ? usersRes.value : null;
        const usersList = usersPage?.content ?? (Array.isArray(usersPage) ? usersPage : []);
        const totalUsers = Number(usersPage?.page?.totalElements ?? usersPage?.totalElements ?? usersList.length);

        const enrollmentsPage = enrollmentsRes.status === 'fulfilled' ? enrollmentsRes.value : null;
        const enrollmentsList = enrollmentsPage?.content ?? (Array.isArray(enrollmentsPage) ? enrollmentsPage : []);
        const totalEnrollments = Number(
            enrollmentsPage?.page?.totalElements ?? enrollmentsPage?.totalElements ?? enrollmentsList.length
        );
        const completedEnrollments = enrollmentsList.filter((e) => e?.status === 'COMPLETED').length;
        const completionRate = totalEnrollments > 0
            ? `${Math.round((completedEnrollments / totalEnrollments) * 100)}%`
            : '0%';

        const enrollmentCountByCourse = enrollmentsList.reduce((acc, enr) => {
            const cId = enr?.courseId ?? enr?.course?.id;
            if (cId != null) {
                acc[cId] = (acc[cId] || 0) + 1;
            }
            return acc;
        }, {});

        const topCourses = adminCourses
            .map((course) => {
                const enrolled = enrollmentCountByCourse[course.id] || 0;
                return {
                    id: course.id,
                    title: course.title,
                    category: course.category,
                    lessonsCount: course.lessonsCount || 0,
                    enrolledStudents: enrolled,
                    status: course.status || 'PUBLISHED',
                };
            })
            .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
            .slice(0, 5);

        const aiPage = aiHistoryRes.status === 'fulfilled' ? aiHistoryRes.value : null;
        const aiItems = aiPage?.content ?? (Array.isArray(aiPage) ? aiPage : []);
        const totalAiPrompts = Number(aiPage?.page?.totalElements ?? aiPage?.totalElements ?? aiItems.length);

        const geminiIntegration = integrationItems.find((i) => i.id === 'gemini');
        const geminiOnline = geminiIntegration?.status === 'ONLINE';

        return {
            overview: {
                totalUsers,
                totalEnrollments,
                totalAiPrompts,
                publishedCoursesCount,
                draftCoursesCount,
                totalLessonsCount,
                totalParliamentarians: Number(transparency.totalParliamentarians || 0),
                deputiesCount: Number(transparency.deputiesCount || 0),
                senatorsCount: Number(transparency.senatorsCount || 0),
                totalBillsCount: Number(transparency.totalBillsCount || 0),
                totalExpensesAmount: Number(transparency.totalExpensesAmount || 0),
                totalExpensesFormatted: currencyFormatter.format(Number(transparency.totalExpensesAmount || 0)),
            },
            aiMetrics: {
                totalPrompts: totalAiPrompts,
                recentCount: aiItems.length,
                geminiConfigured: geminiOnline,
                modeLabel: integrationsData.geminiMode || (geminiOnline ? 'Gemini ativo' : 'Modo contingência'),
                recentTopics: buildTopTopics(aiItems),
                dailyPromptVolume: buildDailyVolume(aiItems),
            },
            courseEngagement: {
                totalEnrollments,
                completionRate,
                completedEnrollments,
                topCourses,
            },
            integrations: integrationItems,
            systemHealth: {
                aiApiStatus: geminiOnline ? 'OPERATIONAL' : 'FALLBACK',
                aiStatusLabel: integrationsData.geminiMode || 'Conectado',
                integrationsCount: integrationItems.length,
                checkedAt: integrationsData.timestamp || new Date().toISOString(),
            },
        };
    },
};
