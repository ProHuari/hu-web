import React, { useState } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import {
    RiArrowLeftLine,
    RiCheckboxCircleFill,
    RiTimeLine,
    RiBookOpenLine,
    RiShareForwardLine,
    RiDownloadLine,
} from 'react-icons/ri';

import SideBar from '../../components/sidebar';
import Footer from '../../components/footer';
import VideoPlayer from '../../components/video-player';
import LessonAccordion from '../../components/lesson-accordion';
import ProgressBar from '../../components/progress-bar';
import './style.css';

// Base de dados curricular da trilha selecionada
const COURSE_CURRICULUM = {
    'introducao-politica': {
        title: 'Introdução ao Sistema Político Brasileiro',
        category: 'Iniciantes',
        instructor: 'Dr. Marcos Albuquerque (Cientista Político)',
        modules: [
            {
                id: 'mod-1',
                title: 'Estrutura Republicana e os Três Poderes',
                lessons: [
                    {
                        id: 'aula-1',
                        title: 'A Divisão de Poderes na Constituição de 1988',
                        duration: '18 min',
                        completed: true,
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        summary:
                            'Nesta aula examinamos como os Poderes Executivo, Legislativo e Judiciário atuam segundo o princípio de freios e contrapesos (checks and balances), garantindo estabilidade e equilíbrio institucional.',
                    },
                    {
                        id: 'aula-2',
                        title: 'O Pacto Federativo: União, Estados e Municípios',
                        duration: '22 min',
                        completed: true,
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        summary:
                            'Entenda a repartição de competências tributárias, administrativas e legislativas entre os entes da federação brasileira.',
                    },
                    {
                        id: 'aula-3',
                        title: 'O Papel do Deputado Federal e do Senador',
                        duration: '25 min',
                        completed: false,
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        summary:
                            'Diferenças fundamentais entre o mandato representativo da população (Câmara dos Deputados) e da federação (Senado Federal).',
                    },
                ],
            },
            {
                id: 'mod-2',
                title: 'Mecanismos de Controle e Cidadania',
                lessons: [
                    {
                        id: 'aula-4',
                        title: 'Tribunais de Contas e Fiscalização Externa',
                        duration: '20 min',
                        completed: false,
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        summary:
                            'Como o TCU e TCEs auditam licitações, convênios e prestações de contas governamentais.',
                    },
                    {
                        id: 'aula-5',
                        title: 'Iniciativa Popular de Leis e Plebiscitos',
                        duration: '15 min',
                        completed: false,
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        summary:
                            'Aprenda como cidadãos podem propor leis e participar ativamente de decisões de soberania popular.',
                    },
                ],
            },
        ],
    },
};

/**
 * LessonPage - Página de exibição de aula (/learn/:courseId/:lessonId)
 * Layout split: 70% VideoPlayer e conteúdos à esquerda, 30% LessonAccordion à direita.
 */
export default function LessonPage() {
    const { courseId = 'introducao-politica', lessonId = 'aula-1' } = useParams();
    const navigate = useNavigate();

    // Obtém o curso ou usa o fallback
    const courseData =
        COURSE_CURRICULUM[courseId] || COURSE_CURRICULUM['introducao-politica'];

    // Encontra a aula ativa
    let activeLesson = null;
    let totalLessons = 0;
    let completedLessons = 0;

    courseData.modules.forEach((moduleItem) => {
        moduleItem.lessons.forEach((l) => {
            totalLessons += 1;
            if (l.completed) completedLessons += 1;
            if (l.id === lessonId) activeLesson = l;
        });
    });

    if (!activeLesson) {
        activeLesson = courseData.modules[0].lessons[0];
    }

    const [lessonCompleted, setLessonCompleted] = useState(activeLesson.completed);

    const toggleCompletion = () => {
        setLessonCompleted((prev) => !prev);
    };

    const overallProgress = Math.round((completedLessons / totalLessons) * 100);

    return (
        <div className="lesson-page-layout">
            <div className="lesson-sidebar-wrapper">
                <SideBar />
            </div>

            <main className="lesson-page-main">
                <div className="lesson-page-container">
                    {/* Top Bar de Navegação */}
                    <div className="lesson-nav-top-bar">
                        <NavLink to="/learn" className="lesson-back-btn">
                            <RiArrowLeftLine size={18} />
                            <span>Voltar ao Catálogo de Trilhas</span>
                        </NavLink>

                        <div className="lesson-progress-chip">
                            <span>Progresso da Trilha:</span>
                            <div className="chip-progress-bar">
                                <ProgressBar progress={overallProgress} showLabel={false} height="6px" />
                            </div>
                            <strong>{overallProgress}%</strong>
                        </div>
                    </div>

                    {/* Layout Dividido: 70% / 30% */}
                    <div className="lesson-content-split">
                        {/* Coluna Esquerda: 70% - Player de Vídeo e Resumo */}
                        <section className="lesson-primary-col">
                            <VideoPlayer
                                title={activeLesson.title}
                                videoUrl={activeLesson.videoUrl}
                                autoPlay={false}
                            />

                            <div className="lesson-info-card">
                                <div className="lesson-header-action-row">
                                    <div>
                                        <span className="lesson-course-name">{courseData.title}</span>
                                        <h1 className="lesson-main-title">{activeLesson.title}</h1>
                                        <p className="lesson-instructor">Instrutor: {courseData.instructor}</p>
                                    </div>

                                    <button
                                        type="button"
                                        className={`btn-complete-lesson ${lessonCompleted ? 'is-completed' : ''}`}
                                        onClick={toggleCompletion}
                                    >
                                        <RiCheckboxCircleFill size={18} />
                                        <span>{lessonCompleted ? 'Concluída' : 'Marcar como Concluída'}</span>
                                    </button>
                                </div>

                                <div className="lesson-summary-box">
                                    <h3>Resumo Didático da Aula</h3>
                                    <p>{activeLesson.summary}</p>
                                </div>

                                <div className="lesson-resources-row">
                                    <button type="button" className="btn-resource">
                                        <RiDownloadLine size={16} />
                                        <span>Material em PDF</span>
                                    </button>
                                    <button type="button" className="btn-resource">
                                        <RiShareForwardLine size={16} />
                                        <span>Compartilhar Aula</span>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Coluna Direita: 30% - LessonAccordion com lista de módulos */}
                        <section className="lesson-sidebar-col">
                            <LessonAccordion
                                modules={courseData.modules}
                                currentCourseId={courseId}
                                currentLessonId={lessonId}
                            />
                        </section>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
