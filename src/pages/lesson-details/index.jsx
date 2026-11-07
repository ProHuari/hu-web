import { useParams, Link } from 'react-router-dom';
import {
    RiArrowLeftLine,
    RiCheckboxCircleFill,
    RiShareForwardLine,
    RiDownloadLine,
} from 'react-icons/ri';
import VideoPlayer from '../../components/video-player';
import LessonAccordion from '../../components/lesson-accordion';
import ProgressBar from '../../components/progress-bar';
import { getCourseById } from '../../data/courses';
import { useApp } from '../../context/AppContext';
import './style.css';

/**
 * LessonPage - Interactive video player and syllabus screen (/learn/:courseId/:lessonId)
 */
export default function LessonPage() {
    const { courseId, lessonId } = useParams();
    const { isLessonCompleted, toggleLessonCompleted } = useApp() || {};

    const course = getCourseById(courseId);

    // Find active lesson
    let activeLesson = null;
    let totalLessons = 0;
    let completedLessonsCount = 0;

    course.modules?.forEach((moduleItem) => {
        moduleItem.lessons?.forEach((l) => {
            totalLessons += 1;
            const completed = isLessonCompleted ? isLessonCompleted(l.id) : Boolean(l.completed);
            if (completed) completedLessonsCount += 1;
            if (l.id === lessonId) activeLesson = l;
        });
    });

    if (!activeLesson && course.modules?.[0]?.lessons?.[0]) {
        activeLesson = course.modules[0].lessons[0];
    }

    const isCurrentCompleted = isLessonCompleted
        ? isLessonCompleted(activeLesson?.id)
        : Boolean(activeLesson?.completed);

    const toggleCompletion = () => {
        if (activeLesson?.id && toggleLessonCompleted) {
            toggleLessonCompleted(activeLesson.id);
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
