import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
    FiEdit2,
    FiEye,
    FiTrash2,
    FiSend,
    FiArchive,
    FiBookOpen,
} from 'react-icons/fi';
import './style.css';

export default function AdminCourseTable({ courses, onToggleStatus, onDeleteRequest }) {
    return (
        <div className="admin-courses-table-wrapper">
            <div className="admin-table-scroll">
                <table className="admin-courses-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Category</th>
                            <th>Curriculum</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => {
                            const isPublished = course.status === 'PUBLISHED';
                            const modulesCount = course.modules?.length || 0;
                            const lessonsCount = course.lessonsCount || 0;

                            return (
                                <tr key={course.id}>
                                    <td>
                                        <div className="admin-course-cell">
                                            <div className="admin-course-thumb">
                                                {course.image ? (
                                                    <img
                                                        src={course.image}
                                                        alt={course.title}
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ) : (
                                                    <FiBookOpen aria-hidden="true" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="admin-course-title">{course.title}</div>
                                                <div className="admin-course-meta">
                                                    <span>{course.level}</span>
                                                    <span>•</span>
                                                    <span>{course.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{course.category}</td>
                                    <td className="tabular-nums">
                                        {modulesCount} {modulesCount === 1 ? 'module' : 'modules'} •{' '}
                                        {lessonsCount} {lessonsCount === 1 ? 'lesson' : 'lessons'}
                                    </td>
                                    <td>
                                        <span
                                            className={`admin-status-pill ${
                                                isPublished
                                                    ? 'admin-status-pill--published'
                                                    : 'admin-status-pill--draft'
                                            }`}
                                        >
                                            <span className="admin-status-dot" aria-hidden="true" />
                                            {isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-actions-cell">
                                            <Link
                                                to={`/admin/courses/${course.id}/edit`}
                                                className="admin-icon-btn admin-icon-btn--edit"
                                                title={`Edit ${course.title}`}
                                            >
                                                <FiEdit2 size={14} />
                                                <span>Edit</span>
                                            </Link>

                                            <button
                                                type="button"
                                                className="admin-icon-btn"
                                                onClick={() => onToggleStatus(course)}
                                                title={isPublished ? 'Move to Draft' : 'Publish Course'}
                                            >
                                                {isPublished ? <FiArchive size={14} /> : <FiSend size={14} />}
                                                <span>{isPublished ? 'Unpublish' : 'Publish'}</span>
                                            </button>

                                            <Link
                                                to={`/learn/${course.id}/overview`}
                                                className="admin-icon-btn"
                                                title="Preview Student View"
                                                aria-label={`Preview ${course.title}`}
                                            >
                                                <FiEye size={14} />
                                            </Link>

                                            <button
                                                type="button"
                                                className="admin-icon-btn admin-icon-btn--danger"
                                                onClick={() => onDeleteRequest(course)}
                                                title={`Delete ${course.title}`}
                                                aria-label={`Delete ${course.title}`}
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

AdminCourseTable.propTypes = {
    courses: PropTypes.array.isRequired,
    onToggleStatus: PropTypes.func.isRequired,
    onDeleteRequest: PropTypes.func.isRequired,
};

