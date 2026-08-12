import React, { useState, useId } from 'react';
import { PasswordInputProps } from './PasswordInput.types';
import styles from './PasswordInput.module.css';

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  id,
  ...inputProps
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = !!error;
  const hasHelperText = !!helperText && !hasError;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputClassName = `${styles.input} ${hasError ? styles.error : ''} ${className}`.trim();

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.passwordWrapper}>
        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className={inputClassName}
          disabled={disabled}
          aria-label={label || inputProps['aria-label']}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : hasHelperText ? helperId : undefined
          }
          aria-required={required}
          {...inputProps}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          className={styles.toggleButton}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {hasError && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
      {hasHelperText && (
        <span id={helperId} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default PasswordInput;

