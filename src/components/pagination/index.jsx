import React from 'react';
import PropTypes from 'prop-types';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import './style.css';

/**
 * Pagination - Componente atômico para navegação de páginas paginadas.
 * Gera números de página com elipses inteligentes (...) e controles de anterior/próximo.
 *
 * @param {number} currentPage - Página ativa atual (base 1)
 * @param {number} totalPages - Total de páginas disponíveis
 * @param {function} onPageChange - Callback acionado com o novo número de página
 * @param {number} siblingCount - Quantidade de páginas adjacentes a mostrar (default: 1)
 * @param {string} className - Classes CSS adicionais
 */
export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    siblingCount = 1,
    className = '',
}) {
    if (totalPages <= 1) return null;

    // Algoritmo para gerar o intervalo de páginas com reticências
    const generatePaginationRange = () => {
        const totalPageNumbers = siblingCount * 2 + 5; // 1 + siblings + currentPage + siblings + lastPage + 2 dots

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
            aria-label="Navegação de páginas"
        >
            <button
                type="button"
                className="huari-pagination-nav-btn"
                onClick={handlePrev}
                disabled={currentPage === 1}
                aria-label="Página anterior"
            >
                <RiArrowLeftSLine size={18} />
                <span>Anterior</span>
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
                            aria-label={`Ir para a página ${page}`}
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
                aria-label="Próxima página"
            >
                <span>Próximo</span>
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

