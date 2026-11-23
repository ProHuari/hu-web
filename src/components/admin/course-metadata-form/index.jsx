import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FiPlus, FiTrash2, FiUploadCloud, FiEye } from 'react-icons/fi';
import CourseCard from '../../course-card';
import { AVAILABLE_CATEGORIES, COURSE_LEVELS } from '../../../schemas/course-validation';
import { coursesService } from '../../../services/courses-service';
import './style.css';

export default function CourseMetadataForm({
    course,
    errors = {},
    onFieldChange,
    onAddObjective,
    onUpdateObjective,
    onRemoveObjective,
}) {
    const [categories, setCategories] = useState(
        AVAILABLE_CATEGORIES.map((name, idx) => ({ id: idx + 1, name }))
    );

    useEffect(() => {
        let active = true;
        coursesService
            .getCategoriesDetailed()
            .then((list) => {
                if (active && Array.isArray(list) && list.length > 0) {
                    setCategories(list);
                }
            })
            .catch(() => {});
        return () => {
            active = false;
        };
    }, []);

    const categoryNames = Array.from(
        new Set([...categories.map((c) => c.name), course.category].filter(Boolean))
    );

    const previewCourse = {
        ...course,
        id: course.id || 'preview',
        title: course.title || 'Título do seu curso',
        description:
            course.description ||
            'Resumo claro dos conceitos e habilidades práticas abordados nesta trilha.',
        category: course.category || categoryNames[0] || 'Educação Cívica',
        level: course.level || 'Introdutório',
        duration: course.duration || 'Livre',
        lessonsCount: (course.modules || []).reduce(
            (sum, m) => sum + (m.lessons?.length || 0),
            0
        ),
        progress: 0,
    };

    const handleCategoryChange = (selectedName) => {
        onFieldChange('category', selectedName);
        const match = categories.find(
            (c) => String(c.name).toLowerCase() === String(selectedName).toLowerCase()
        );
        if (match?.id) {
            onFieldChange('categoryId', match.id);
        }
    };

    return (
        <div className="admin-metadata-layout">
            <div className="admin-form-card">
                <h2 className="admin-form-card-title">Detalhes e mídia do curso</h2>

                <div className="admin-field-group">
                    <label htmlFor="course-title" className="admin-field-label">
                        Título do curso *
                    </label>
                    <input
                        id="course-title"
                        type="text"
                        className={`admin-field-input ${errors.title ? 'admin-field-input--error' : ''}`}
                        placeholder="Ex.: Orçamento Municipal e Fiscalização Cidadã"
                        value={course.title || ''}
                        onChange={(e) => onFieldChange('title', e.target.value)}
                    />
                    {errors.title && <span className="admin-field-error">{errors.title}</span>}
                </div>

                <div className="admin-field-group">
                    <label htmlFor="course-description" className="admin-field-label">
                        Descrição do curso *
                    </label>
                    <textarea
                        id="course-description"
                        rows={4}
                        className={`admin-field-textarea ${
                            errors.description ? 'admin-field-textarea--error' : ''
                        }`}
                        placeholder="Explique o que o estudante aprenderá nesta trilha..."
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
                            Categoria
                        </label>
                        <select
                            id="course-category"
                            className="admin-field-select"
                            value={course.category || categoryNames[0] || ''}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                            {categoryNames.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-field-group">
                        <label htmlFor="course-level" className="admin-field-label">
                            Nível
                        </label>
                        <select
                            id="course-level"
                            className="admin-field-select"
                            value={course.level || 'Introdutório'}
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
                            Instrutor / Autoria
                        </label>
                        <input
                            id="course-instructor"
                            type="text"
                            className="admin-field-input"
                            placeholder="Ex.: Equipe Pedagógica Huari"
                            value={course.instructor || ''}
                            onChange={(e) => onFieldChange('instructor', e.target.value)}
                        />
                    </div>

                    <div className="admin-field-group">
                        <label htmlFor="course-duration" className="admin-field-label">
                            Carga horária estimada
                        </label>
                        <input
                            id="course-duration"
                            type="text"
                            className="admin-field-input"
                            placeholder="Ex.: 2h 30min"
                            value={course.duration || ''}
                            onChange={(e) => onFieldChange('duration', e.target.value)}
                        />
                    </div>
                </div>

                <div className="admin-field-group">
                    <label htmlFor="course-image" className="admin-field-label">
                        URL da imagem de capa
                    </label>
                    <input
                        id="course-image"
                        type="url"
                        className={`admin-field-input ${errors.image ? 'admin-field-input--error' : ''}`}
                        placeholder="https://..."
                        value={course.image || ''}
                        onChange={(e) => onFieldChange('image', e.target.value)}
                    />
                    {errors.image && <span className="admin-field-error">{errors.image}</span>}
                    <span className="admin-field-hint">
                        <FiUploadCloud size={14} /> Informe um endereço http/https válido para exibir uma imagem de capa.
                    </span>
                </div>

                <div className="admin-field-group">
                    <label className="admin-field-label">Objetivos de aprendizagem</label>
                    <div className="admin-objectives-list">
                        {(course.objectives || ['']).map((objective, idx) => (
                            <div key={idx} className="admin-objective-row">
                                <input
                                    type="text"
                                    className="admin-field-input"
                                    placeholder={`Objetivo ${idx + 1} (ex.: Ler demonstrativos da LOA municipal)`}
                                    value={objective}
                                    onChange={(e) => onUpdateObjective(idx, e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="admin-remove-btn"
                                    onClick={() => onRemoveObjective(idx)}
                                    aria-label={`Remover objetivo ${idx + 1}`}
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
                            <FiPlus size={14} /> Adicionar objetivo
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-preview-sticky">
                <div className="admin-preview-label">
                    <FiEye size={14} /> Prévia no catálogo
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
