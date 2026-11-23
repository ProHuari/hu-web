import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    RiArrowLeftLine,
    RiCheckboxCircleFill,
    RiShareForwardLine,
    RiDownloadLine,
    RiEditLine,
} from 'react-icons/ri';
import { PageTransition } from '../../components/motion/MotionPrimitives';
import { CourseOverviewSkeleton } from '../../components/skeleton';
import VideoPlayer from '../../components/video-player';
import LessonAccordion from '../../components/lesson-accordion';
import ProgressBar from '../../components/progress-bar';
import EmptyState from '../../components/empty-state';
import { coursesService } from '../../services/courses-service';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/useToast';
import './style.css';

export default function LessonPage() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const { isAdmin = false, isLessonCompleted, toggleLessonCompleted } = useApp() || {};
    const toast = useToast();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let isMounted = true;

        coursesService
            .getCourseById(courseId)
            .then((data) => {
                if (isMounted) {
                    if (data) {
                        setCourse(data);
                        setNotFound(false);
                    } else {
                        setCourse(null);
                        setNotFound(true);
                    }
                }
            })
            .catch((err) => {
                console.error('Falha ao carregar aula', err);
                if (isMounted) {
                    setNotFound(true);
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
    }, [courseId]);

    if (loading) {
        return (
            <div className="lesson-page-container">
                <div className="lesson-nav-top-bar">
                    <Link to="/learn" className="lesson-back-btn">
                        <RiArrowLeftLine size={18} aria-hidden="true" />
                        <span>Voltar para as trilhas</span>
                    </Link>
                </div>
                <CourseOverviewSkeleton />
            </div>
        );
    }

    if (notFound || !course) {
        return (
            <div className="lesson-page-container">
                <div className="lesson-nav-top-bar">
                    <Link to="/learn" className="lesson-back-btn">
                        <RiArrowLeftLine size={18} aria-hidden="true" />
                        <span>Voltar para as trilhas</span>
                    </Link>
                </div>
                <EmptyState
                    title="Aula não encontrada"
                    description="Não localizamos esta aula ou módulo no momento. Volte ao catálogo para escolher outra trilha."
                    actionText="Ir para o catálogo"
                    onAction={() => navigate('/learn')}
                />
            </div>
        );
    }

    let activeLesson = null;
    let totalLessons = 0;
    let completedLessonsCount = 0;

    course.modules?.forEach((moduleItem) => {
        moduleItem.lessons?.forEach((l) => {
            totalLessons += 1;
            const completed = isLessonCompleted
                ? isLessonCompleted(course.id, l.id)
                : Boolean(l.completed);
            if (completed) completedLessonsCount += 1;
            if (String(l.id) === String(lessonId)) activeLesson = l;
        });
    });

    if (!activeLesson && course.modules?.[0]?.lessons?.[0]) {
        activeLesson = course.modules[0].lessons[0];
    }

    const isCurrentCompleted = isLessonCompleted
        ? isLessonCompleted(course.id, activeLesson?.id)
        : Boolean(activeLesson?.completed);

    const toggleCompletion = () => {
        if (activeLesson?.id && toggleLessonCompleted) {
            toggleLessonCompleted(course.id, activeLesson.id);
            toast.success(
                isCurrentCompleted
                    ? 'Aula marcada como pendente.'
                    : 'Aula concluída e progresso atualizado.'
            );
        }
    };

    const handleCopyShareLink = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link da aula copiado.');
            } else {
                toast.info('Copie o endereço pela barra do navegador para compartilhar.');
            }
        } catch {
            toast.error('Não foi possível copiar o link.');
        }
    };

    const overallProgress =
        totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

    const lessonResources = Array.isArray(activeLesson?.resources)
        ? activeLesson.resources.filter((res) => res?.url)
        : [];

    return (
        <PageTransition className="lesson-page-container">
            <div className="lesson-nav-top-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to={`/learn/${course.id}/overview`} className="lesson-back-btn">
                        <RiArrowLeftLine size={18} aria-hidden="true" />
                        <span>Voltar à trilha</span>
                    </Link>

                    {isAdmin && (
                        <Link
                            to={`/admin/courses/${course.id}/edit`}
                            className="lesson-admin-edit-link"
                        >
                            <RiEditLine size={15} aria-hidden="true" />
                            <span>Editar trilha</span>
                        </Link>
                    )}
                </div>

                <div className="lesson-progress-chip">
                    <span>Progresso:</span>
                    <div className="chip-progress-bar">
                        <ProgressBar progress={overallProgress} showLabel={false} height="6px" />
                    </div>
                    <strong className="tabular-nums">{overallProgress}%</strong>
                </div>
            </div>

            <div className="lesson-content-split">
                <section className="lesson-primary-col" aria-label="Vídeo e anotações da aula">
                    <VideoPlayer
                        key={activeLesson?.id}
                        title={activeLesson?.title || 'Vídeo da aula'}
                        videoUrl={activeLesson?.videoUrl}
                        thumbnail={course.image || undefined}
                        autoPlay={false}
                    />

                    <div className="lesson-info-card">
                        <div className="lesson-header-action-row">
                            <div>
                                <span className="lesson-course-name">{course.title}</span>
                                <h1 className="lesson-main-title">{activeLesson?.title}</h1>
                                <p className="lesson-instructor">Instrutor: {course.instructor}</p>
                            </div>

                            <button
                                type="button"
                                className={`btn-complete-lesson ${isCurrentCompleted ? 'is-completed' : ''}`}
                                onClick={toggleCompletion}
                                aria-pressed={isCurrentCompleted}
                            >
                                <RiCheckboxCircleFill size={18} aria-hidden="true" />
                                <span>{isCurrentCompleted ? 'Aula concluída' : 'Marcar como concluída'}</span>
                            </button>
                        </div>

                        <div className="lesson-summary-box">
                            <h3>Resumo da aula</h3>
                            <p>
                                {activeLesson?.summary ||
                                    'Assista ao vídeo acima para acompanhar os conceitos práticos abordados nesta aula.'}
                            </p>
                        </div>

                        <div className="lesson-resources-row">
                            {lessonResources.length > 0 &&
                                lessonResources.map((res) => (
                                    <a
                                        key={res.id || res.url}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-resource"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <RiDownloadLine size={16} aria-hidden="true" />
                                        <span>{res.title || 'Material complementar'}</span>
                                    </a>
                                ))}

                            <button
                                type="button"
                                className="btn-resource"
                                onClick={handleCopyShareLink}
                            >
                                <RiShareForwardLine size={16} aria-hidden="true" />
                                <span>Compartilhar aula</span>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="lesson-sidebar-col" aria-label="Conteúdo da trilha">
                    <LessonAccordion
                        modules={course.modules || []}
                        currentCourseId={course.id}
                        currentLessonId={activeLesson?.id}
                    />
                </section>
            </div>
        </PageTransition>
    );
}
