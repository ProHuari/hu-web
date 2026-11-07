import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import InputText from '../input-text';
import './style.css';

export default function PasswordInput({
    label = 'Password',
    labelAction,
    value,
    onChange,
    placeholder = 'Enter password...',
    required = false,
    identifier = 'input-default',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <InputText
            identifier={identifier}
            label={label}
            labelAction={labelAction}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            iconLeft={<RiLockLine size={18} />}
            iconRight={
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
            }
            required={required}
            {...props}
        />
    );
}

PasswordInput.propTypes = {
    label: PropTypes.node,
    labelAction: PropTypes.node,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    identifier: PropTypes.string,
};

