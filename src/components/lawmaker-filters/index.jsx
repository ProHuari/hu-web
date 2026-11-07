import React from 'react';
import PropTypes from 'prop-types';
import {
    RiMapPinLine,
    RiFlagLine,
    RiSortDesc,
    RiFilterOffLine,
} from 'react-icons/ri';
import SearchInput from '../search-input';
import SelectFilter from '../select-filter';
import { UF_OPTIONS, PARTY_OPTIONS, SORT_OPTIONS } from '../../data/lawmakers';
import './style.css';

/**
 * LawmakerFilters - Filters and sorting toolbar for lawmakers directory.
 */
export default function LawmakerFilters({
    filters = { search: '', state: '', party: '', sort: 'name_asc' },
    onFilterChange,
    onResetFilters,
    totalResults,
    className = '',
}) {
    const hasActiveFilters = Boolean(
        filters.search || filters.state || filters.party || filters.sort !== 'name_asc'
    );

    return (
        <section
            className={`huari-lawmaker-filters-wrapper ${className}`}
            aria-label="Lawmaker filters and sorting toolbar"
        >
            <div className="filters-top-row">
                <div className="search-container">
                    <SearchInput
                        value={filters.search}
                        onChange={(val) => onFilterChange('search', val)}
                        placeholder="Search by lawmaker name..."
                    />
                </div>

                <div className="dropdowns-group">
                    <SelectFilter
                        label="State"
                        icon={RiMapPinLine}
                        options={UF_OPTIONS}
                        value={filters.state}
                        onChange={(val) => onFilterChange('state', val)}
                        placeholder="All States"
                    />

                    <SelectFilter
                        label="Party"
                        icon={RiFlagLine}
                        options={PARTY_OPTIONS}
                        value={filters.party}
                        onChange={(val) => onFilterChange('party', val)}
                        placeholder="All Parties"
                    />

                    <SelectFilter
                        label="Sort by"
                        icon={RiSortDesc}
                        options={SORT_OPTIONS}
                        value={filters.sort}
                        onChange={(val) => onFilterChange('sort', val)}
                        placeholder="Name (A - Z)"
                    />
                </div>
            </div>

            <div className="filters-bottom-row">
                <div className="results-count">
                    {totalResults !== undefined && (
                        <span>
                            Showing <strong>{totalResults}</strong> lawmaker
                            {totalResults === 1 ? '' : 's'}
                        </span>
                    )}
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="btn-clear-filters"
                        onClick={onResetFilters}
                        aria-label="Clear all active filters"
                    >
                        <RiFilterOffLine size={16} />
                        <span>Clear filters</span>
                    </button>
                )}
            </div>
        </section>
    );
}

LawmakerFilters.propTypes = {
    filters: PropTypes.shape({
        search: PropTypes.string,
        state: PropTypes.string,
        party: PropTypes.string,
        sort: PropTypes.string,
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onResetFilters: PropTypes.func.isRequired,
    totalResults: PropTypes.number,
    className: PropTypes.string,
};
