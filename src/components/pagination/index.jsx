import React from 'react';
import PropTypes from 'prop-types';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import './style.css';

/**
 * Pagination - Atomic component for paginated navigation.
 */
export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    siblingCount = 1,
    className = '',
}) {
    if (totalPages <= 1) return null;

    const generatePaginationRange = () => {
        const totalPageNumbers = siblingCount * 2 + 5;

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, '...', totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = Array.from(
                { length: rightItemCount },
                (_, i) => totalPages - rightItemCount + i + 1
            );
            return [firstPageIndex, '...', ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = Array.from(
                { length: rightSiblingIndex - leftSiblingIndex + 1 },
                (_, i) => leftSiblingIndex + i
            );
            return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
        }

        return [];
    };

    const pages = generatePaginationRange();

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <nav
            className={`huari-pagination-container ${className}`}
            aria-label="Pagination Navigation"
        >
            <button
                type="button"
                className="huari-pagination-nav-btn"
                onClick={handlePrev}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <RiArrowLeftSLine size={18} />
                <span>Previous</span>
            </button>

            <div className="huari-pagination-numbers">
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`dots-${index}`}
                                className="huari-pagination-ellipsis"
                            >
                                &hellip;
                            </span>
                        );
                    }

                    const isCurrent = page === currentPage;

                    return (
                        <button
                            key={page}
                            type="button"
                            className={`huari-pagination-page-btn ${isCurrent ? 'is-active' : ''}`}
                            onClick={() => onPageChange(page)}
                            aria-current={isCurrent ? 'page' : undefined}
                            aria-label={`Go to page ${page}`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                className="huari-pagination-nav-btn"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <span>Next</span>
                <RiArrowRightSLine size={18} />
            </button>
        </nav>
    );
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    siblingCount: PropTypes.number,
    className: PropTypes.string,
};
