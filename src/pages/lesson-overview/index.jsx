import { useState, useEffect } from 'react';
import { useParams, NavLink, Link, useNavigate } from 'react-router-dom';
import {
    RiArrowLeftLine,
    RiArrowRightLine,
    RiBookOpenLine,
    RiTimeLine,
    RiGraduationCapLine,
    RiPlayCircleLine,
    RiCheckboxCircleLine,
    RiCheckboxCircleFill,
    RiUserLine,
    RiEditLine,
} from 'react-icons/ri';
import { PageTransition } from '../../components/motion/MotionPrimitives';
import { CourseOverviewSkeleton } from '../../components/skeleton';
import ProgressBar from '../../components/progress-bar';
import EmptyState from '../../components/empty-state';
import { coursesService } from '../../services/courses-service';
import { useApp } from '../../context/AppContext';
import './style.css';

export default function LessonOverview() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { isAdmin = false, isLessonCompleted, getCourseProgress } = useApp() || {};

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
                console.error('Falha ao carregar detalhes da trilha', err);
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
            <div className="lesson-overview-page-container">
                <Link to="/learn" className="overview-back-link">
                    <RiArrowLeftLine size={18} aria-hidden="true" />
                    <span>Voltar para as trilhas</span>
                </Link>
                <CourseOverviewSkeleton />
            </div>
        );
    }

    if (notFound || !course) {
        return (
            <div className="lesson-overview-page-container">
                <Link to="/learn" className="overview-back-link">
                    <RiArrowLeftLine size={18} aria-hidden="true" />
                    <span>Voltar para as trilhas</span>
                </Link>
                <EmptyState
                    title="Trilha não encontrada"
                    description="Não encontramos o curso solicitado. Ele pode ter sido removido ou atualizado."
                    actionText="Ir para o catálogo"
                    onAction={() => navigate('/learn')}
                />
            </div>
        );
    }

    const lessons = (course.modules || []).flatMap((module) =>
        (module.lessons || []).map((lesson) => ({
            ...lesson,
            moduleTitle: module.title,
        }))
    );

    const nextUncompleted = lessons.find((lesson) =>
        isLessonCompleted ? !isLessonCompleted(course.id, lesson.id) : !lesson.completed
    );
    const targetLesson = nextUncompleted || lessons[0] || {
        id: '1',
        title: 'Introdução ao curso',
        duration: '15 min',
    };
    const totalLessons = lessons.length;
    const progress = getCourseProgress ? getCourseProgress(course) : course.progress || 0;

    return (
        <PageTransition className="lesson-overview-page-container">
            <div className="overview-topbar">
                <Link to="/learn" className="overview-back-link">
                    <RiArrowLeftLine size={18} aria-hidden="true" />
                    <span>Voltar para as trilhas</span>
                </Link>

                {isAdmin && (
                    <div className="overview-admin-controls">
                        <span className="overview-admin-status">
                            {course.status === 'DRAFT' ? 'Rascunho' : 'Publicada'}
                        </span>
                        <Link
                            to={`/admin/courses/${course.id}/edit`}
                            className="overview-admin-edit-btn"
                        >
                            <RiEditLine size={16} aria-hidden="true" />
                            <span>Editar trilha</span>
                        </Link>
                    </div>
                )}
            </div>

            <section className="overview-hero" aria-label="Apresentação da trilha">
                <div className="overview-hero-content">
                    <div className="overview-badges">
                        <span>{course.category}</span>
                        <span>{course.level}</span>
                    </div>

                    <h1>{course.title}</h1>

                    <p className="overview-hero-description">{course.description}</p>

                    <div className="overview-hero-meta">
                        <span>
                            <RiTimeLine size={17} aria-hidden="true" />
                            {course.duration}
                        </span>

                        <span className="tabular-nums">
                            <RiBookOpenLine size={17} aria-hidden="true" />
                            {totalLessons} {totalLessons === 1 ? 'aula' : 'aulas'}
                        </span>

                        <span>
                            <RiUserLine size={17} aria-hidden="true" />
                            {course.instructor}
                        </span>
                    </div>

                    {progress > 0 && (
                        <div className="overview-hero-progress">
                            <ProgressBar progress={progress} height="8px" />
                        </div>
                    )}

                    <NavLink
                        to={`/learn/${course.id}/${targetLesson.id}`}
                        className="overview-start-button"
                    >
                        <span>
                            {progress > 0 && progress < 100
                                ? 'Continuar trilha'
                                : progress === 100
                                  ? 'Rever aulas'
                                  : 'Iniciar trilha'}
                        </span>
                        <RiArrowRightLine size={19} aria-hidden="true" />
                    </NavLink>
                </div>

                <div
                    className="overview-hero-image"
                    style={
                        course.image
                            ? {
                                  backgroundImage: `url(${course.image})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                              }
                            : {}
                    }
                    aria-hidden="true"
                >
                    <div className="overview-image-overlay" />
                    {!course.image && (
                        <div className="overview-image-icon">
                            <RiGraduationCapLine size={58} />
                        </div>
                    )}
                </div>
            </section>

            {course.objectives && course.objectives.length > 0 && (
                <section className="overview-section" aria-label="Objetivos de aprendizagem">
                    <div className="overview-section-heading">
                        <h2>O que você vai aprender nesta trilha</h2>
                    </div>

                    <div className="overview-objectives-list">
                        {course.objectives.map((objective, index) => (
                            <div className="overview-objective-row" key={index}>
                                <RiCheckboxCircleLine size={19} aria-hidden="true" />
                                <span>{objective}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="overview-section overview-curriculum" aria-label="Conteúdo programático">
                <div className="overview-section-heading">
                    <h2>Módulos e aulas</h2>
                    <p>
                        Escolha qualquer aula abaixo para abrir o vídeo e acompanhar seu progresso.
                    </p>
                </div>

                {(!course.modules || course.modules.length === 0) ? (
                    <EmptyState
                        title="Nenhum módulo publicado ainda"
                        description="O conteúdo desta trilha está sendo organizado e aparecerá aqui em breve."
                    />
                ) : (
                    <div className="overview-modules-list">
                        {course.modules.map((module, index) => (
                            <article className="overview-module-card" key={module.id || index}>
                                <div className="overview-module-header">
                                    <div>
                                        <span>Módulo {index + 1}</span>
                                        <h3>{module.title}</h3>
                                    </div>

                                    <span className="overview-module-count tabular-nums">
                                        {(module.lessons || []).length}{' '}
                                        {(module.lessons || []).length === 1 ? 'aula' : 'aulas'}
                                    </span>
                                </div>

                                <div className="overview-module-lessons">
                                    {(module.lessons || []).map((lesson) => {
                                        const done = isLessonCompleted
                                            ? isLessonCompleted(course.id, lesson.id)
                                            : Boolean(lesson.completed);

                                        return (
                                            <NavLink
                                                to={`/learn/${course.id}/${lesson.id}`}
                                                className="overview-lesson-item"
                                                key={lesson.id}
                                            >
                                                {done ? (
                                                    <RiCheckboxCircleFill
                                                        size={19}
                                                        style={{ color: '#16a34a' }}
                                                        aria-label="Concluída"
                                                    />
                                                ) : (
                                                    <RiPlayCircleLine size={19} aria-hidden="true" />
                                                )}
                                                <span>{lesson.title}</span>
                                                <small className="tabular-nums">{lesson.duration}</small>
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="overview-bottom-cta">
                <div>
                    <h2>Pronto para começar os estudos?</h2>
                    <p>
                        Acompanhe todas as aulas gratuitamente e salve seu progresso na conta.
                    </p>
                </div>

                <NavLink
                    to={`/learn/${course.id}/${targetLesson.id}`}
                    className="overview-start-button"
                >
                    <span>{progress > 0 ? 'Continuar de onde parou' : 'Abrir primeira aula'}</span>
                    <RiArrowRightLine size={19} aria-hidden="true" />
                </NavLink>
            </section>
        </PageTransition>
    );
}
