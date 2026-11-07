import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    RiArrowLeftLine,
    RiCheckboxCircleFill,
    RiShareForwardLine,
    RiDownloadLine,
} from 'react-icons/ri';
import VideoPlayer from '../../components/video-player';
import LessonAccordion from '../../components/lesson-accordion';
import ProgressBar from '../../components/progress-bar';
import EmptyState from '../../components/empty-state';
import { coursesService } from '../../services/coursesService';
import { useApp } from '../../context/AppContext';
import './style.css';

/**
 * LessonPage - Interactive video player and syllabus screen (/learn/:courseId/:lessonId)
 */
export default function LessonPage() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const { isLessonCompleted, toggleLessonCompleted } = useApp() || {};

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setNotFound(false);

        coursesService.getCourseById(courseId)
            .then((data) => {
                if (isMounted) {
                    if (data) {
                        setCourse(data);
                    } else {
                        setCourse(null);
                        setNotFound(true);
                    }
                }
            })
            .catch((err) => {
                console.error('Failed to load lesson course', err);
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
                        <span>Back to Course Catalog</span>
                    </Link>
                </div>
                <div
                    className="lesson-loading-state"
                    style={{
                        padding: '4rem 1rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <div className="loading-spinner" />
                    <p style={{ color: 'var(--color-text-muted)' }}>Loading lesson curriculum...</p>
                </div>
            </div>
        );
    }

    if (notFound || !course) {
        return (
            <div className="lesson-page-container">
                <div className="lesson-nav-top-bar">
                    <Link to="/learn" className="lesson-back-btn">
                        <RiArrowLeftLine size={18} aria-hidden="true" />
                        <span>Back to Course Catalog</span>
                    </Link>
                </div>
                <EmptyState
                    title="Lesson Not Found"
                    description="We could not locate this lesson or course module. Please verify the URL or return to the course catalog."
                    actionText="Browse Courses"
                    onAction={() => navigate('/learn')}
                />
            </div>
        );
    }

    // Find active lesson
    let activeLesson = null;
    let totalLessons = 0;
    let completedLessonsCount = 0;

    course.modules?.forEach((moduleItem) => {
        moduleItem.lessons?.forEach((l) => {
            totalLessons += 1;
            const completed = isLessonCompleted ? isLessonCompleted(course.id, l.id) : Boolean(l.completed);
            if (completed) completedLessonsCount += 1;
            if (l.id === lessonId) activeLesson = l;
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
        }
    };

    const overallProgress = totalLessons > 0
        ? Math.round((completedLessonsCount / totalLessons) * 100)
        : 0;

    return (
        <div className="lesson-page-container">
            {/* Top Navigation Bar */}
            <div className="lesson-nav-top-bar">
                <Link to="/learn" className="lesson-back-btn">
                    <RiArrowLeftLine size={18} aria-hidden="true" />
                    <span>Back to Course Catalog</span>
                </Link>

                <div className="lesson-progress-chip">
                    <span>Track Progress:</span>
                    <div className="chip-progress-bar">
                        <ProgressBar progress={overallProgress} showLabel={false} height="6px" />
                    </div>
                    <strong>{overallProgress}%</strong>
                </div>
            </div>

            {/* Split Content: Video & Overview (70%) + Syllabus Accordion (30%) */}
            <div className="lesson-content-split">
                <section className="lesson-primary-col" aria-label="Lesson Video and Notes">
                    <VideoPlayer
                        key={activeLesson?.id}
                        title={activeLesson?.title || 'Lesson Video'}
                        videoUrl={activeLesson?.videoUrl}
                        autoPlay={false}
                    />

                    <div className="lesson-info-card">
                        <div className="lesson-header-action-row">
                            <div>
                                <span className="lesson-course-name">{course.title}</span>
                                <h1 className="lesson-main-title">{activeLesson?.title}</h1>
                                <p className="lesson-instructor">Instructor: {course.instructor}</p>
                            </div>

                            <button
                                type="button"
                                className={`btn-complete-lesson ${isCurrentCompleted ? 'is-completed' : ''}`}
                                onClick={toggleCompletion}
                                aria-pressed={isCurrentCompleted}
                            >
                                <RiCheckboxCircleFill size={18} aria-hidden="true" />
                                <span>{isCurrentCompleted ? 'Completed' : 'Mark as Completed'}</span>
                            </button>
                        </div>

                        <div className="lesson-summary-box">
                            <h3>Lesson Summary &amp; Key Takeaways</h3>
                            <p>{activeLesson?.summary || 'Follow along with the video masterclass above to review the constitutional and statutory foundations covered in this lesson.'}</p>
                        </div>

                        <div className="lesson-resources-row">
                            <button
                                type="button"
                                className="btn-resource"
                                onClick={() => alert('Downloading official lesson curriculum PDF...')}
                            >
                                <RiDownloadLine size={16} aria-hidden="true" />
                                <span>PDF Study Guide</span>
                            </button>
                            <button
                                type="button"
                                className="btn-resource"
                                onClick={() => {
                                    if (navigator.clipboard) {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Lesson link copied to clipboard!');
                                    }
                                }}
                            >
                                <RiShareForwardLine size={16} aria-hidden="true" />
                                <span>Share Lesson</span>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="lesson-sidebar-col" aria-label="Course Syllabus Sidebar">
                    <LessonAccordion
                        modules={course.modules || []}
                        currentCourseId={course.id}
                        currentLessonId={activeLesson?.id}
                    />
                </section>
            </div>
        </div>
    );
}
