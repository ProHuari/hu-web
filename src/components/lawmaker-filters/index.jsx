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
import './style.css';

const UF_OPTIONS = [
    { value: '', label: 'Todos os Estados' },
    { value: 'AC', label: 'Acre (AC)' },
    { value: 'AL', label: 'Alagoas (AL)' },
    { value: 'AP', label: 'Amapá (AP)' },
    { value: 'AM', label: 'Amazonas (AM)' },
    { value: 'BA', label: 'Bahia (BA)' },
    { value: 'CE', label: 'Ceará (CE)' },
    { value: 'DF', label: 'Distrito Federal (DF)' },
    { value: 'ES', label: 'Espírito Santo (ES)' },
    { value: 'GO', label: 'Goiás (GO)' },
    { value: 'MA', label: 'Maranhão (MA)' },
    { value: 'MT', label: 'Mato Grosso (MT)' },
    { value: 'MS', label: 'Mato Grosso do Sul (MS)' },
    { value: 'MG', label: 'Minas Gerais (MG)' },
    { value: 'PA', label: 'Pará (PA)' },
    { value: 'PB', label: 'Paraíba (PB)' },
    { value: 'PR', label: 'Paraná (PR)' },
    { value: 'PE', label: 'Pernambuco (PE)' },
    { value: 'PI', label: 'Piauí (PI)' },
    { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
    { value: 'RN', label: 'Rio Grande do Norte (RN)' },
    { value: 'RS', label: 'Rio Grande do Sul (RS)' },
    { value: 'RO', label: 'Rondônia (RO)' },
    { value: 'RR', label: 'Roraima (RR)' },
    { value: 'SC', label: 'Santa Catarina (SC)' },
    { value: 'SP', label: 'São Paulo (SP)' },
    { value: 'SE', label: 'Sergipe (SE)' },
    { value: 'TO', label: 'Tocantins (TO)' },
];

const PARTY_OPTIONS = [
    { value: '', label: 'Todos os Partidos' },
    { value: 'PL', label: 'PL - Partido Liberal' },
    { value: 'PT', label: 'PT - Partido dos Trabalhadores' },
    { value: 'UNIÃO', label: 'UNIÃO - União Brasil' },
    { value: 'PP', label: 'PP - Progressistas' },
    { value: 'MDB', label: 'MDB - Movimento Democrático Brasileiro' },
    { value: 'PSD', label: 'PSD - Partido Social Democrático' },
    { value: 'REPUBLICANOS', label: 'REPUBLICANOS' },
    { value: 'PSB', label: 'PSB - Partido Socialista Brasileiro' },
    { value: 'PSOL', label: 'PSOL - Partido Socialismo e Liberdade' },
    { value: 'PODEMOS', label: 'PODEMOS' },
    { value: 'PDT', label: 'PDT - Partido Democrático Trabalhista' },
    { value: 'NOVO', label: 'NOVO' },
];

const SORT_OPTIONS = [
    { value: 'name_asc', label: 'Nome (A - Z)' },
    { value: 'name_desc', label: 'Nome (Z - A)' },
    { value: 'attendance_desc', label: 'Maior Presença' },
    { value: 'bills_desc', label: 'Mais Projetos' },
    { value: 'expenses_asc', label: 'Menor Gasto (CEAP)' },
    { value: 'expenses_desc', label: 'Maior Gasto (CEAP)' },
];

/**
 * LawmakerFilters - Molécula que agrupa busca por texto e múltiplos filtros dropdown.
 *
 * @param {Object} filters - Objeto com os estados dos filtros atuais { search, state, party, sort }
 * @param {function} onFilterChange - Callback acionado com (field, value)
 * @param {function} onResetFilters - Callback para resetar todos os filtros
 * @param {number} totalResults - Total de parlamentares encontrados
 * @param {string} className - Classes CSS extras
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
            aria-label="Filtros e ordenação de parlamentares"
        >
            <div className="filters-top-row">
                {/* Search com Debounce integrado */}
                <div className="search-container">
                    <SearchInput
                        value={filters.search}
                        onChange={(val) => onFilterChange('search', val)}
                        placeholder="Buscar por nome do parlamentar..."
                    />
                </div>

                {/* Dropdowns de Filtro */}
                <div className="dropdowns-group">
                    <SelectFilter
                        label="Estado"
                        icon={RiMapPinLine}
                        options={UF_OPTIONS}
                        value={filters.state}
                        onChange={(val) => onFilterChange('state', val)}
                        placeholder="Todos os Estados"
                    />

                    <SelectFilter
                        label="Partido"
                        icon={RiFlagLine}
                        options={PARTY_OPTIONS}
                        value={filters.party}
                        onChange={(val) => onFilterChange('party', val)}
                        placeholder="Todos os Partidos"
                    />

                    <SelectFilter
                        label="Ordenar por"
                        icon={RiSortDesc}
                        options={SORT_OPTIONS}
                        value={filters.sort}
                        onChange={(val) => onFilterChange('sort', val)}
                        placeholder="Nome (A - Z)"
                    />
                </div>
            </div>

            {/* Barra de Status e Limpeza de Filtros */}
            <div className="filters-bottom-row">
                <div className="results-count">
                    {totalResults !== undefined && (
                        <span>
                            Mostrando <strong>{totalResults}</strong> parlamentar
                            {totalResults === 1 ? '' : 'es'}
                        </span>
                    )}
                </div>

                {hasActiveFilters && (
                    <button
                        type="button"
                        className="btn-clear-filters"
                        onClick={onResetFilters}
                        aria-label="Limpar todos os filtros selecionados"
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
        state: PropTypes.string,
        party: PropTypes.string,
        sort: PropTypes.string,
    }).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onResetFilters: PropTypes.func.isRequired,
    totalResults: PropTypes.number,
    className: PropTypes.string,
};
