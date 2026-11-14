import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'motion/react';
import './style.css';

/**
 * ProgressBar - Atomic horizontal progress bar with spring-animated fill.
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
                <motion.div
                    className="huari-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${clampedProgress}%` }}
                    transition={{ type: 'spring', stiffness: 180, damping: 24 }}
                />
            </div>
            {showLabel && (
                <span className="huari-progress-label tabular-nums">
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
