import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { RiSearchLine, RiAddLine, RiSettings4Line, RiShieldStarLine } from 'react-icons/ri';
import { PageTransition, StaggerGrid, StaggerItem } from '../../components/motion/MotionPrimitives';
import PageHeader from '../../components/page-header';
import EmptyState from '../../components/empty-state';
import CourseCard from '../../components/course-card';
import { CourseCardSkeleton } from '../../components/skeleton';
import { useApp } from '../../context/AppContext';
import { coursesService } from '../../services/coursesService';
import './style.css';

/**
 * LearnCatalog - Civic Academy Learning Portal (/learn)
 * Elevated course catalog with animated category pills, skeletons, and contextual admin shortcuts.
 */
export default function LearnCatalog() {
    const { isAdmin = false } = useApp() || {};
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([
        'All',
        'Beginners',
        'Legislative',
        'Budget & Auditing',
        'Civic Action',
    ]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            coursesService.getCourses(),
            coursesService.getCategories(),
        ])
            .then(([fetchedCourses, fetchedCategories]) => {
                if (isMounted) {
                    if (Array.isArray(fetchedCourses)) {
                        setCourses(fetchedCourses);
                    }
                    if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
                        setCategories(fetchedCategories);
                    }
                }
            })
            .catch((err) => {
                console.error('Failed to load courses from service', err);
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesCategory =
                selectedCategory === 'All' || course.category === selectedCategory;
            const matchesSearch =
                (course.title && course.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [courses, selectedCategory, searchQuery]);

    return (
        <PageTransition className="learn-page-container">
            <PageHeader
                badgeText="Huari Civic Academy"
                title="Citizen Education & Oversight Tracks"
                description="Free, non-partisan, and structured learning tracks designed to empower citizens to understand, audit, and navigate government institutions."
            />

            {isAdmin && (
                <div className="learn-admin-bar" role="region" aria-label="Administrator course shortcuts">
                    <div className="learn-admin-bar-label">
                        <RiShieldStarLine size={16} aria-hidden="true" />
                        <span>Admin Quick Actions</span>
                    </div>
                    <div className="learn-admin-bar-actions">
                        <Link to="/admin/courses" className="learn-admin-secondary-link">
                            <RiSettings4Line size={15} aria-hidden="true" />
                            <span>Manage All Courses</span>
                        </Link>
                        <Link to="/admin/courses/new" className="learn-admin-primary-link">
                            <RiAddLine size={16} aria-hidden="true" />
                            <span>New Course</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Filter and Search Bar */}
            <div className="learn-filters-bar">
                <div className="learn-search-box">
                    <RiSearchLine className="learn-search-icon" size={18} aria-hidden="true" />
                    <input
                        type="text"
                        className="learn-search-input"
                        placeholder="Search civic tracks, modules, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search civic tracks"
                    />
                </div>

                <div className="learn-category-pills" role="tablist" aria-label="Course Categories">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                className={`category-pill-btn ${isActive ? 'is-active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="learnCategoryPill"
                                        className="category-pill-active-bg"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Courses Grid */}
            <section className="learn-courses-grid-section" aria-label="Course Tracks Catalog">
                {loading ? (
                    <div className="learn-courses-grid" role="status" aria-label="Loading civic tracks">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <CourseCardSkeleton key={idx} />
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <EmptyState
                        title="No learning tracks found"
                        description="Try searching with a different term or select 'All' to browse every course."
                        actionText="View All Tracks"
                        onAction={() => {
                            setSelectedCategory('All');
                            setSearchQuery('');
                        }}
                    />
                ) : (
                    <StaggerGrid className="learn-courses-grid">
                        {filteredCourses.map((course) => (
                            <StaggerItem key={course.id}>
                                <CourseCard course={course} />
                            </StaggerItem>
                        ))}
                    </StaggerGrid>
                )}
            </section>
        </PageTransition>
    );
}
