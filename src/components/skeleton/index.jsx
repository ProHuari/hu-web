import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

export function SkeletonBlock({ width = '100%', height = '1rem', className = '', style = {} }) {
    return (
        <div
            className={`huari-skeleton-block ${className}`}
            style={{ width, height, ...style }}
            aria-hidden="true"
        />
    );
}

SkeletonBlock.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    style: PropTypes.object,
};

export function CourseCardSkeleton() {
    return (
        <div className="huari-skeleton-card" aria-hidden="true">
            <div className="huari-skeleton-block huari-skeleton-thumb" />
            <div className="huari-skeleton-body">
                <div className="huari-skeleton-row">
                    <SkeletonBlock width="84px" height="22px" />
                    <SkeletonBlock width="68px" height="16px" />
                </div>
                <SkeletonBlock width="88%" height="22px" />
                <SkeletonBlock width="100%" height="14px" />
                <SkeletonBlock width="72%" height="14px" />
                <div className="huari-skeleton-row" style={{ marginTop: '0.5rem' }}>
                    <SkeletonBlock width="45%" height="12px" />
                    <SkeletonBlock width="32px" height="12px" />
                </div>
                <SkeletonBlock width="100%" height="8px" />
                <SkeletonBlock width="100%" height="40px" style={{ marginTop: '0.25rem' }} />
            </div>
        </div>
    );
}

export function CourseOverviewSkeleton() {
    return (
        <div className="huari-skeleton-overview" aria-label="Loading course overview" role="status">
            <div className="huari-skeleton-hero">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <SkeletonBlock width="130px" height="26px" />
                    <SkeletonBlock width="85%" height="36px" />
                    <SkeletonBlock width="100%" height="16px" />
                    <SkeletonBlock width="90%" height="16px" />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <SkeletonBlock width="110px" height="20px" />
                        <SkeletonBlock width="110px" height="20px" />
                        <SkeletonBlock width="130px" height="20px" />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <SkeletonBlock width="100%" height="190px" />
                    <SkeletonBlock width="100%" height="44px" />
                </div>
            </div>
            <div className="huari-skeleton-table">
                <SkeletonBlock width="220px" height="24px" />
                <SkeletonBlock width="100%" height="58px" />
                <SkeletonBlock width="100%" height="58px" />
                <SkeletonBlock width="100%" height="58px" />
            </div>
        </div>
    );
}

export function AdminTableSkeleton({ rows = 4 }) {
    return (
        <div className="huari-skeleton-table" aria-label="Loading courses table" role="status">
            {Array.from({ length: rows }).map((_, idx) => (
                <div key={idx} className="huari-skeleton-table-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <SkeletonBlock width="56px" height="40px" />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <SkeletonBlock width="70%" height="15px" />
                            <SkeletonBlock width="45%" height="12px" />
                        </div>
                    </div>
                    <SkeletonBlock width="88px" height="24px" />
                    <SkeletonBlock width="52px" height="16px" />
                    <SkeletonBlock width="52px" height="16px" />
                    <SkeletonBlock width="130px" height="32px" />
                </div>
            ))}
        </div>
    );
}

AdminTableSkeleton.propTypes = {
    rows: PropTypes.number,
};

export function PageLoader({ label = 'Loading view...' }) {
    return (
        <div className="huari-page-loader" role="status" aria-live="polite">
            <div className="huari-page-loader-spinner" aria-hidden="true" />
            <span>{label}</span>
        </div>
    );
}

PageLoader.propTypes = {
    label: PropTypes.string,
};

