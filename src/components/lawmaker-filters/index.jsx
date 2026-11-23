import React from 'react';
import PropTypes from 'prop-types';
import {
    RiMapPinLine,
    RiFlagLine,
    RiGovernmentLine,
    RiSortDesc,
    RiFilterOffLine,
} from 'react-icons/ri';
import SearchInput from '../search-input';
import SelectFilter from '../select-filter';
import {
    UF_OPTIONS,
    PARTY_OPTIONS,
    CHAMBER_OPTIONS,
    SORT_OPTIONS,
} from '../../data/lawmakers';
import './style.css';

export default function LawmakerFilters({
    filters = { search: '', chamber: '', state: '', party: '', sort: 'name_asc' },
    onFilterChange,
    onResetFilters,
    totalResults,
    className = '',
}) {
    const hasActiveFilters = Boolean(
        filters.search ||
            filters.chamber ||
            filters.state ||
            filters.party ||
            filters.sort !== 'name_asc'
    );

    return (
        <section
            className={`huari-lawmaker-filters-wrapper ${className}`}
            aria-label="Filtros e ordenação de parlamentares"
        >
            <div className="filters-top-row">
                <div className="search-container">
                    <SearchInput
                        value={filters.search}
                        onChange={(val) => onFilterChange('search', val)}
                        placeholder="Buscar por nome, partido ou UF..."
                    />
                </div>

                <div className="dropdowns-group">
                    <SelectFilter
                        label="Casa"
                        icon={RiGovernmentLine}
                        options={CHAMBER_OPTIONS}
                        value={filters.chamber || ''}
                        onChange={(val) => onFilterChange('chamber', val)}
                        placeholder="Câmara e Senado"
                    />

                    <SelectFilter
                        label="Estado"
                        icon={RiMapPinLine}
                        options={UF_OPTIONS.map((opt) =>
                            opt.value === '' ? { value: '', label: 'Todos os estados' } : opt
                        )}
                        value={filters.state}
                        onChange={(val) => onFilterChange('state', val)}
                        placeholder="Todos os estados"
                    />

                    <SelectFilter
                        label="Partido"
                        icon={RiFlagLine}
                        options={PARTY_OPTIONS}
                        value={filters.party}
                        onChange={(val) => onFilterChange('party', val)}
                        placeholder="Todos os partidos"
                    />

                    <SelectFilter
                        label="Ordenar"
                        icon={RiSortDesc}
                        options={SORT_OPTIONS}
                        value={filters.sort}
                        onChange={(val) => onFilterChange('sort', val)}
                        placeholder="Nome (A – Z)"
                    />
                </div>
            </div>

            <div className="filters-bottom-row">
                <div className="results-count">
                    {totalResults !== undefined && (
                        <span>
                            <strong>{totalResults}</strong>{' '}
                            {totalResults === 1 ? 'parlamentar encontrado' : 'parlamentares encontrados'}
                        </span>
                    )}
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="btn-clear-filters"
                        onClick={onResetFilters}
                        aria-label="Limpar todos os filtros ativos"
                    >
                        <RiFilterOffLine size={16} />
                        <span>Limpar filtros</span>
                    </button>
                )}
            </div>
        </section>
    );
}

LawmakerFilters.propTypes = {
    filters: PropTypes.shape({
        search: PropTypes.string,
        chamber: PropTypes.string,
        state: PropTypes.string,
        party: PropTypes.string,
        sort: PropTypes.string,
    }),
    onFilterChange: PropTypes.func.isRequired,
    onResetFilters: PropTypes.func.isRequired,
    totalResults: PropTypes.number,
    className: PropTypes.string,
};
