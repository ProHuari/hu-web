import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import './style.css';

/**
 * SearchInput - Atomic search field with integrated debounce.
 */
export default function SearchInput({
    value = '',
    onChange,
    placeholder = 'Search by name, state, or topic...',
    delay = 350,
    className = '',
    ...props
}) {
    const [searchTerm, setSearchTerm] = useState(value);

    // Synchronize searchTerm when value changes externally
    const [prevValue, setPrevValue] = useState(value);
    if (value !== prevValue) {
        setPrevValue(value);
        setSearchTerm(value);
    }

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
                    aria-label="Clear search input"
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
