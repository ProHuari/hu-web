import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { RiArrowDownSLine, RiCheckLine } from 'react-icons/ri';
import './style.css';

/**
 * SelectFilter - Atomic custom dropdown filter for State (UF), Party, and Sorting.
 */
export default function SelectFilter({
    label,
    options = [],
    value = '',
    onChange,
    icon: Icon,
    placeholder = 'Select...',
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close menu on Escape
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleSelectOption = (optionValue) => {
        onChange?.(optionValue);
        setIsOpen(false);
    };

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div
            className={`huari-select-filter-container ${className}`}
            ref={dropdownRef}
            onKeyDown={handleKeyDown}
        >
            {label && <label className="huari-select-filter-label">{label}</label>}

            <button
                type="button"
                className={`huari-select-trigger ${isOpen ? 'is-open' : ''} ${value ? 'has-value' : ''}`}
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className="huari-select-trigger-content">
                    {Icon && <Icon className="huari-select-trigger-icon" size={17} />}
                    <span className="huari-select-selected-text">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <RiArrowDownSLine
                    className={`huari-select-arrow ${isOpen ? 'rotated' : ''}`}
                    size={18}
                />
            </button>

            {isOpen && (
                <ul className="huari-select-options-list" role="listbox">
                    {options.map((option) => {
                        const isSelected = option.value === value;
                        return (
                            <li
                                key={option.value}
                                className={`huari-select-option-item ${isSelected ? 'is-selected' : ''}`}
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => handleSelectOption(option.value)}
                            >
                                <span>{option.label}</span>
                                {isSelected && (
                                    <RiCheckLine
                                        className="huari-select-check-icon"
                                        size={16}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

SelectFilter.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    icon: PropTypes.elementType,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};
