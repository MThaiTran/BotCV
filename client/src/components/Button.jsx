// src/components/Button/Button.jsx
import React from 'react';
import '../assets/css/Components/Button.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${fullWidth ? 'btn--full-width' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
