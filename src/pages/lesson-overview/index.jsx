import React from 'react';
import { useParams, NavLink, Link } from 'react-router-dom';
import {
    RiArrowLeftLine,
    RiArrowRightLine,
    RiBookOpenLine,
    RiTimeLine,
    RiGraduationCapLine,
    RiPlayCircleLine,
    RiFileTextLine,
    RiQuestionnaireLine,
    RiCheckboxCircleLine,
    RiUserLine,
} from 'react-icons/ri';
import { getCourseById, MOCK_COURSES } from '../../data/courses';
import './style.css';

export default function LessonOverview() {
    const { courseId } = useParams();

    const course = getCourseById(courseId) || MOCK_COURSES[0];

    const lessons = course.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({
            ...lesson,
            moduleTitle: module.title,
        }))
    );

    const firstLesson = lessons[0] || { id: 'lesson-1', title: 'Course Introduction', duration: '15 min' };
    const totalLessons = lessons.length;

    return (
        <div className="lesson-overview-page-container">
            <Link to="/learn" className="overview-back-link">
                <RiArrowLeftLine size={18} aria-hidden="true" />
                <span>Back to Course Catalog</span>
            </Link>

            {/* Hero banner */}
            <section className="overview-hero" aria-label="Course Track Overview">
                <div className="overview-hero-content">
                    <div className="overview-badges">
                        <span>{course.category}</span>
                        <span>{course.level}</span>
                    </div>

                    <span className="overview-eyebrow">HUARI CIVIC ACADEMY</span>

                    <h1>{course.title}</h1>

                    <p className="overview-hero-description">
                        {course.description}
                    </p>

                    <div className="overview-hero-meta">
                        <span>
                            <RiTimeLine size={17} aria-hidden="true" />
                            {course.duration}
                        </span>

                        <span>
                            <RiBookOpenLine size={17} aria-hidden="true" />
                            {totalLessons} lessons in track
                        </span>

                        <span>
                            <RiUserLine size={17} aria-hidden="true" />
                            {course.instructor}
                        </span>
                    </div>

                    <NavLink
                        to={`/learn/${course.id}/${firstLesson.id}`}
                        className="overview-start-button"
                    >
                        <span>Start Learning Track</span>
                        <RiArrowRightLine size={19} aria-hidden="true" />
                    </NavLink>
                </div>

                <div className="overview-hero-image" aria-hidden="true">
                    <div className="overview-image-overlay" />
                    <div className="overview-image-icon">
                        <RiGraduationCapLine size={58} />
                    </div>
                </div>
            </section>

            {/* Learning objectives */}
            <section className="overview-section" aria-label="Learning Objectives">
                <div className="overview-section-heading">
                    <span className="overview-section-label">ABOUT THIS TRACK</span>
                    <h2>What will you master?</h2>
                    <p>
                        Key competencies and oversight skills acquired throughout this curriculum.
                    </p>
                </div>

                <div className="overview-objectives-grid">
                    {course.objectives?.map((objective, index) => (
                        <div className="overview-objective-card" key={index}>
                            <RiCheckboxCircleLine size={22} aria-hidden="true" />
                            <span>{objective}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Learning methodology */}
            <section className="overview-section" aria-label="Course Methodology">
                <div className="overview-section-heading">
                    <span className="overview-section-label">METHODOLOGY</span>
                    <h2>How you will learn</h2>
                    <p>
                        Multi-format pedagogy designed for accessible, self-paced civic mastery.
                    </p>
                </div>

                <div className="overview-formats-grid">
                    <article className="overview-format-card">
                        <div className="overview-format-icon" aria-hidden="true">
                            <RiPlayCircleLine size={25} />
                        </div>
                        <h3>Video Masterclasses</h3>
                        <p>
                            Concise, high-definition video walkthroughs explaining constitutional mechanisms.
                        </p>
                    </article>

                    <article className="overview-format-card">
                        <div className="overview-format-icon" aria-hidden="true">
                            <RiFileTextLine size={25} />
                        </div>
                        <h3>Supporting Guides</h3>
                        <p>
                            Curated infographics, legislation references, and open data schema downloads.
                        </p>
                    </article>

                    <article className="overview-format-card">
                        <div className="overview-format-icon" aria-hidden="true">
                            <RiQuestionnaireLine size={25} />
                        </div>
                        <h3>Practical Case Audits</h3>
                        <p>
                            Real-world exercises analyzing actual congressional expense claims and floor votes.
                        </p>
                    </article>
                </div>
            </section>

            {/* Curriculum syllabus */}
            <section className="overview-section overview-curriculum" aria-label="Curriculum Modules">
                <div className="overview-section-heading">
                    <span className="overview-section-label">CURRICULUM SYLLABUS</span>
                    <h2>Course Modules &amp; Lessons</h2>
                    <p>
                        Structured progression through topics. Click any lesson to begin studying.
                    </p>
                </div>

                <div className="overview-modules-list">
                    {course.modules?.map((module, index) => (
                        <article className="overview-module-card" key={module.id || index}>
                            <div className="overview-module-header">
                                <div>
                                    <span>MODULE {index + 1}</span>
                                    <h3>{module.title}</h3>
                                </div>

                                <span className="overview-module-count">
                                    {module.lessons.length} lessons
                                </span>
                            </div>

                            <div className="overview-module-lessons">
                                {module.lessons.map((lesson) => (
                                    <NavLink
                                        to={`/learn/${course.id}/${lesson.id}`}
                                        className="overview-lesson-item"
                                        key={lesson.id}
                                    >
                                        <RiPlayCircleLine size={19} aria-hidden="true" />
                                        <span>{lesson.title}</span>
                                        <small>{lesson.duration}</small>
                                    </NavLink>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="overview-bottom-cta">
                <div>
                    <h2>Ready to start your civic journey?</h2>
                    <p>
                        Access lesson materials, video walkthroughs, and practical tools completely free.
                    </p>
                </div>

                <NavLink
                    to={`/learn/${course.id}/${firstLesson.id}`}
                    className="overview-start-button"
                >
                    <span>Begin Lesson 1</span>
                    <RiArrowRightLine size={19} aria-hidden="true" />
                </NavLink>
            </section>
        </div>
    );
}
