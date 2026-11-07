import { useState, useEffect, useMemo } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import PageHeader from '../../components/page-header';
import EmptyState from '../../components/empty-state';
import CourseCard from '../../components/course-card';
import { coursesService } from '../../services/coursesService';
import './style.css';

/**
 * LearnCatalog - Civic Academy Learning Portal (/learn)
 * Course catalog with category tabs and real-time search.
 */
export default function LearnCatalog() {
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
        <div className="learn-page-container">
            <PageHeader
                badgeText="Huari Civic Academy"
                title="Citizen Education &amp; Oversight Tracks"
                description="Free, non-partisan, and structured learning tracks designed to empower citizens to understand, audit, and navigate government institutions."
            />

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
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            role="tab"
                            aria-selected={selectedCategory === cat}
                            className={`category-pill-btn ${selectedCategory === cat ? 'is-active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Courses Grid */}
            <section className="learn-courses-grid-section" aria-label="Course Tracks Catalog">
                {loading ? (
                    <div className="courses-loading-state" style={{ padding: '4rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div className="loading-spinner" />
                        <p style={{ color: 'var(--color-text-muted)' }}>Loading civic academy tracks...</p>
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
                    <div className="learn-courses-grid">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
