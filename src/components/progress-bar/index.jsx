import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

/**
 * ProgressBar - Atomic horizontal progress bar indicator with percentage.
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
                aria-label={`${clampedProgress}% completed`}
            >
                <div
                    className="huari-progress-fill"
                    style={{ width: `${clampedProgress}%` }}
                />
            </div>
            {showLabel && (
                <span className="huari-progress-label">
                    {clampedProgress}% completed
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
