import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import './style.css';

/**
 * SearchInput - Componente atômico para campo de busca com debounce integrado.
 * Evita emissões excessivas de eventos para requisições assíncronas / filtros.
 *
 * @param {string} value - Valor controlado inicial ou externo
 * @param {function} onChange - Callback acionado após o término do debounce (termo digitado)
 * @param {string} placeholder - Texto de placeholder do input
 * @param {number} delay - Tempo em milissegundos para o debounce (default: 350ms)
 * @param {string} className - Classes CSS adicionais
 */
export default function SearchInput({
    value = '',
    onChange,
    placeholder = 'Buscar por nome do parlamentar...',
    delay = 350,
    className = '',
    ...props
}) {
    const [searchTerm, setSearchTerm] = useState(value);

    // Sincroniza se o valor externo mudar
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    // Aplica o debounce disparando o callback apenas após a inatividade
    useEffect(() => {
        const handler = setTimeout(() => {
            if (onChange && searchTerm !== value) {
                onChange(searchTerm);
            }
        }, delay);

        return () => clearTimeout(handler);
    }, [searchTerm, delay, onChange, value]);

    const handleClear = () => {
        setSearchTerm('');
        onChange?.('');
    };

    return (
        <div className={`huari-search-input-wrapper ${className}`}>
            <RiSearchLine className="huari-search-icon-search" size={18} aria-hidden="true" />
            <input
                type="text"
                className="huari-search-field"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={placeholder}
                {...props}
            />
            {searchTerm && (
                <button
                    type="button"
                    className="huari-search-clear-btn"
                    onClick={handleClear}
                    aria-label="Limpar campo de busca"
                >
                    <RiCloseLine size={16} />
                </button>
            )}
        </div>
    );
}

SearchInput.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    delay: PropTypes.number,
    className: PropTypes.string,
};

