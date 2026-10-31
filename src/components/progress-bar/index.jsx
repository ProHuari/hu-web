import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './style.css';

/**
 * ProgressBar - Átomo para exibir a barra de progresso horizontal em porcentagem.
 *
 * @param {number} progress - Progresso de 0 a 100
 * @param {boolean} showLabel - Se exibe o rótulo textual de porcentagem
 * @param {string} height - Altura customizada da barra
 * @param {string} className - Classes extras
 */
export default function ProgressBar({
    progress = 0,
    showLabel = true,
    height = '8px',
    className = '',
}) {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className={`huari-progress-container ${className}`}>
            <div
                className="huari-progress-track"
                style={{ height }}
                role="progressbar"
                aria-valuenow={clampedProgress}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className="huari-progress-fill"
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
            {showLabel && (
                <span className="huari-progress-label">
                    {clampedProgress}% concluído
                </span>
            )}
        </div>
    );
}

ProgressBar.propTypes = {
    progress: PropTypes.number,
    showLabel: PropTypes.bool,
    height: PropTypes.string,
    className: PropTypes.string,
};
