import React from 'react';
import PropTypes from 'prop-types';
import { FiPlus, FiTrash2, FiUploadCloud, FiEye } from 'react-icons/fi';
import CourseCard from '../../course-card';
import { AVAILABLE_CATEGORIES, COURSE_LEVELS } from '../../../schemas/courseValidation';
import './style.css';

export default function CourseMetadataForm({
    course,
    errors = {},
    onFieldChange,
    onAddObjective,
    onUpdateObjective,
    onRemoveObjective,
}) {
    const previewCourse = {
        ...course,
        id: course.id || 'preview',
        title: course.title || 'Your Course Title',
        description:
            course.description ||
            'A concise overview of what citizens and analysts will master in this civic track.',
        category: course.category || AVAILABLE_CATEGORIES[0],
        level: course.level || 'Beginner',
        duration: course.duration || '2h 00m',
        lessonsCount: (course.modules || []).reduce(
            (sum, m) => sum + (m.lessons?.length || 0),
            0
        ),
        progress: 0,
    };

    return (
        <div className="admin-metadata-layout">
            <div className="admin-form-card">
                <h2 className="admin-form-card-title">Course Details & Media</h2>

                <div className="admin-field-group">
                    <label htmlFor="course-title" className="admin-field-label">
                        Course Title *
                    </label>
                    <input
                        id="course-title"
                        type="text"
                        className={`admin-field-input ${errors.title ? 'admin-field-input--error' : ''}`}
                        placeholder="e.g. Municipal Budget & Participatory Oversight"
                        value={course.title || ''}
                        onChange={(e) => onFieldChange('title', e.target.value)}
                    />
                    {errors.title && <span className="admin-field-error">{errors.title}</span>}
                </div>

                <div className="admin-field-group">
                    <label htmlFor="course-description" className="admin-field-label">
                        Course Description *
                    </label>
                    <textarea
                        id="course-description"
                        rows={4}
                        className={`admin-field-textarea ${
                            errors.description ? 'admin-field-textarea--error' : ''
                        }`}
                        placeholder="Summarize the civic impact, analytical skills, and target outcomes..."
                        value={course.description || ''}
                        onChange={(e) => onFieldChange('description', e.target.value)}
                    />
                    {errors.description && (
                        <span className="admin-field-error">{errors.description}</span>
                    )}
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-group">
                        <label htmlFor="course-category" className="admin-field-label">
                            Category
                        </label>
                        <select
                            id="course-category"
                            className="admin-field-select"
                            value={course.category || AVAILABLE_CATEGORIES[0]}
                            onChange={(e) => onFieldChange('category', e.target.value)}
                        >
                            {AVAILABLE_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-field-group">
                        <label htmlFor="course-level" className="admin-field-label">
                            Level
                        </label>
                        <select
                            id="course-level"
                            className="admin-field-select"
                            value={course.level || 'Beginner'}
                            onChange={(e) => onFieldChange('level', e.target.value)}
                        >
                            {COURSE_LEVELS.map((lvl) => (
                                <option key={lvl} value={lvl}>
                                    {lvl}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="admin-field-row">
                    <div className="admin-field-group">
                        <label htmlFor="course-instructor" className="admin-field-label">
                            Instructor / Author
                        </label>
                        <input
                            id="course-instructor"
                            type="text"
                            className="admin-field-input"
                            placeholder="e.g. Prof. Elena Rostova"
                            value={course.instructor || ''}
                            onChange={(e) => onFieldChange('instructor', e.target.value)}
                        />
                    </div>

                    <div className="admin-field-group">
                        <label htmlFor="course-duration" className="admin-field-label">
                            Estimated Total Duration
                        </label>
                        <input
                            id="course-duration"
                            type="text"
                            className="admin-field-input"
                            placeholder="e.g. 2h 30m"
                            value={course.duration || ''}
                            onChange={(e) => onFieldChange('duration', e.target.value)}
                        />
                    </div>
                </div>

                <div className="admin-field-group">
                    <label htmlFor="course-image" className="admin-field-label">
                        Cover Thumbnail URL
                    </label>
                    <input
                        id="course-image"
                        type="url"
                        className={`admin-field-input ${errors.image ? 'admin-field-input--error' : ''}`}
                        placeholder="https://images.unsplash.com/..."
                        value={course.image || ''}
                        onChange={(e) => onFieldChange('image', e.target.value)}
                    />
                    {errors.image && <span className="admin-field-error">{errors.image}</span>}
                    <span className="admin-field-hint">
                        <FiUploadCloud size={14} /> External image URL supported today; direct S3/file upload slot ready for backend storage.
                    </span>
                </div>

                <div className="admin-field-group">
                    <label className="admin-field-label">Learning Objectives</label>
                    <div className="admin-objectives-list">
                        {(course.objectives || ['']).map((objective, idx) => (
                            <div key={idx} className="admin-objective-row">
                                <input
                                    type="text"
                                    className="admin-field-input"
                                    placeholder={`Objective ${idx + 1} (e.g. Interpret municipal revenue statements)`}
                                    value={objective}
                                    onChange={(e) => onUpdateObjective(idx, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="admin-remove-btn"
                                    onClick={() => onRemoveObjective(idx)}
                                    aria-label={`Remove objective ${idx + 1}`}
                                >
                                    <FiTrash2 size={15} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="admin-add-inline-btn"
                            onClick={onAddObjective}
                        >
                            <FiPlus size={14} /> Add Objective
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-preview-sticky">
                <div className="admin-preview-label">
                    <FiEye size={14} /> Live Student Card Preview
                </div>
                <CourseCard course={previewCourse} isPreview />
            </div>
        </div>
    );
}

CourseMetadataForm.propTypes = {
    course: PropTypes.object.isRequired,
    errors: PropTypes.object,
    onFieldChange: PropTypes.func.isRequired,
    onAddObjective: PropTypes.func.isRequired,
    onUpdateObjective: PropTypes.func.isRequired,
    onRemoveObjective: PropTypes.func.isRequired,
};

