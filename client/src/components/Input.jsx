// src/components/Input/Input.jsx
import React, { useState } from 'react';
import '../assets/css/Components/Input.css';

const Input = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = '',
  label,
  error,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`input-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input-field"
          required={required}
        />
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Ẩn' : 'Hiện'}
          </button>
        )}
      </div>
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

export default Input;
