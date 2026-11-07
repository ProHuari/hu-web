import React, { useState, useMemo } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import PageHeader from '../../components/page-header';
import EmptyState from '../../components/empty-state';
import CourseCard from '../../components/course-card';
import { MOCK_COURSES, COURSE_CATEGORIES } from '../../data/courses';
import './style.css';

/**
 * LearnCatalog - Civic Academy Learning Portal (/learn)
 * Course catalog with category tabs and real-time search.
 */
export default function LearnCatalog() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = useMemo(() => {
        return MOCK_COURSES.filter((course) => {
            const matchesCategory =
                selectedCategory === 'All' || course.category === selectedCategory;
            const matchesSearch =
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <div className="learn-page-container">
            <PageHeader
                badge="Huari Civic Academy"
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
                    {COURSE_CATEGORIES.map((cat) => (
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
                {filteredCourses.length === 0 ? (
                    <EmptyState
                        title="No learning tracks found"
                        description="Try searching with a different term or select 'All' to browse every course."
                        actionLabel="View All Tracks"
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
