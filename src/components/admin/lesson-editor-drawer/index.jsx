import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'motion/react';
import { FiX, FiPlus, FiTrash2, FiUploadCloud, FiVideo } from 'react-icons/fi';
import Button from '../../button';
import VideoPlayer from '../../video-player';
import './style.css';

export default function LessonEditorDrawer({
    lesson,
    moduleIndex,
    lessonIndex,
    onClose,
    onChange,
}) {
    useEffect(() => {
        if (!lesson) return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [lesson, onClose]);

    const handleResourceChange = (resIdx, field, value) => {
        const nextResources = (lesson.resources || []).map((res, idx) =>
            idx === resIdx ? { ...res, [field]: value } : res
        );
        onChange({ resources: nextResources });
    };

    const handleAddResource = () => {
        const nextResources = [
            ...(lesson.resources || []),
            {
                id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
                title: 'Material complementar em PDF',
                url: '',
            },
        ];
        onChange({ resources: nextResources });
    };

    const handleRemoveResource = (resIdx) => {
        const nextResources = (lesson.resources || []).filter((_, idx) => idx !== resIdx);
        onChange({ resources: nextResources });
    };

    return (
        <AnimatePresence>
            {lesson && (
                <motion.div
                    className="lesson-drawer-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                >
                    <motion.aside
                        className="lesson-drawer-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Editar Aula ${lessonIndex + 1}`}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="lesson-drawer-header">
                            <div>
                                <span
                                    style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        color: 'var(--color-primary)',
                                    }}
                                >
                                    Módulo {moduleIndex + 1} · Aula {lessonIndex + 1}
                                </span>
                                <h3 className="lesson-drawer-title">Conteúdo da aula</h3>
                            </div>
                            <button
                                type="button"
                                className="lesson-drawer-close"
                                onClick={onClose}
                                aria-label="Fechar painel da aula"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div className="lesson-drawer-body">
                            <div className="admin-field-group">
                                <label htmlFor="lesson-title-input" className="admin-field-label">
                                    Título da aula *
                                </label>
                                <input
                                    id="lesson-title-input"
                                    type="text"
                                    className="admin-field-input"
                                    value={lesson.title || ''}
                                    onChange={(e) => onChange({ title: e.target.value })}
                                    placeholder="Ex.: Como ler a Lei Orçamentária Anual"
                                />
                            </div>

                            <div className="admin-field-row">
                                <div className="admin-field-group">
                                    <label htmlFor="lesson-duration-input" className="admin-field-label">
                                        Duração
                                    </label>
                                    <input
                                        id="lesson-duration-input"
                                        type="text"
                                        className="admin-field-input"
                                        value={lesson.duration || ''}
                                        onChange={(e) => onChange({ duration: e.target.value })}
                                        placeholder="Ex.: 15 min"
                                    />
                                </div>

                                <div className="admin-field-group">
                                    <label htmlFor="lesson-video-input" className="admin-field-label">
                                        URL do vídeo (YouTube / MP4)
                                    </label>
                                    <input
                                        id="lesson-video-input"
                                        type="url"
                                        className="admin-field-input"
                                        value={lesson.videoUrl || ''}
                                        onChange={(e) => onChange({ videoUrl: e.target.value })}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                    />
                                </div>
                            </div>

                            <div className="admin-field-group">
                                <span className="admin-field-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <FiVideo size={14} /> Prévia do vídeo
                                </span>
                                <div className="lesson-drawer-preview">
                                    <VideoPlayer
                                        videoUrl={lesson.videoUrl}
                                        title={lesson.title || 'Prévia da aula'}
                                    />
                                </div>
                            </div>

                            <div className="admin-field-group">
                                <label htmlFor="lesson-summary-input" className="admin-field-label">
                                    Resumo da aula
                                </label>
                                <textarea
                                    id="lesson-summary-input"
                                    rows={4}
                                    className="admin-field-textarea"
                                    value={lesson.summary || ''}
                                    onChange={(e) => onChange({ summary: e.target.value })}
                                    placeholder="Descreva os conceitos e documentos abordados nesta aula..."
                                />
                            </div>

                            <div className="admin-field-group">
                                <label className="admin-field-label">Materiais complementares (PDF)</label>
                                <div className="lesson-drawer-resources">
                                    {(lesson.resources || []).map((res, rIdx) => (
                                        <div key={res.id || rIdx} className="lesson-resource-item">
                                            <input
                                                type="text"
                                                className="admin-field-input"
                                                placeholder="Título (ex.: Guia em PDF)"
                                                value={res.title || ''}
                                                onChange={(e) =>
                                                    handleResourceChange(rIdx, 'title', e.target.value)
                                                }
                                            />
                                            <input
                                                type="url"
                                                className="admin-field-input"
                                                placeholder="https://.../material.pdf"
                                                value={res.url || ''}
                                                onChange={(e) =>
                                                    handleResourceChange(rIdx, 'url', e.target.value)
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="admin-remove-btn"
                                                onClick={() => handleRemoveResource(rIdx)}
                                                aria-label={`Remover material ${rIdx + 1}`}
                                            >
                                                <FiTrash2 size={15} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="admin-add-inline-btn"
                                        onClick={handleAddResource}
                                    >
                                        <FiPlus size={14} /> Adicionar link de material
                                    </button>
                                    <span className="admin-field-hint">
                                        <FiUploadCloud size={14} /> Cole links externos http/https de apostilas ou guias de apoio.
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lesson-drawer-footer">
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                As alterações entram no rascunho da trilha automaticamente.
                            </span>
                            <Button type="button" variant="primary" onClick={onClose}>
                                Concluir edição
                            </Button>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

LessonEditorDrawer.propTypes = {
    lesson: PropTypes.object,
    moduleIndex: PropTypes.number,
    lessonIndex: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};
