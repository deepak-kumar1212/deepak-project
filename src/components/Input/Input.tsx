import React, { useId } from 'react';
import { InputProps } from './Input.types';
import styles from './Input.module.css';

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  id,
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = !!error;
  const hasHelperText = !!helperText && !hasError;

  const inputClassName = `${styles.input} ${hasError ? styles.error : ''} ${className}`.trim();
  const containerClassName = styles.container;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <input
        id={inputId}
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

export default Input;

