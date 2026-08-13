import React, { useId } from 'react';
import { TextFieldProps } from './TextField.types';
import styles from './TextField.module.css';

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  className = '',
  id,
  type = 'text',
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = !!error;
  const hasHelperText = !!helperText && !hasError;

  const inputClassName = `${styles.input} ${hasError ? styles.inputError : ''} ${disabled ? styles.inputDisabled : ''} ${fullWidth ? styles.fullWidth : ''} ${className}`.trim();
  const containerClassName = `${styles.container} ${fullWidth ? styles.fullWidth : ''}`.trim();

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
        type={type}
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

