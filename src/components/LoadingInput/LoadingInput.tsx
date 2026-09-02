import React, { useId } from 'react';
import { LoadingInputProps } from './LoadingInput.types';
import styles from './LoadingInput.module.css';

export const LoadingInput: React.FC<LoadingInputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  loading = false,
  id,
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = !!error;
  const hasHelperText = !!helperText && !hasError;

  const isInputDisabled = disabled || loading;

  const inputClassName = `${styles.input} ${hasError ? styles.error : ''} ${loading ? styles.loading : ''} ${className}`.trim();
  const containerClassName = styles.container;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          className={inputClassName}
          disabled={isInputDisabled}
          aria-label={label || inputProps['aria-label']}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : hasHelperText ? helperId : undefined
          }
          aria-required={required}
          aria-busy={loading}
          {...inputProps}
        />
        {loading && (
          <div className={styles.spinner} role="status" aria-label="Loading">
            <span className={styles.spinnerVisuallyHidden}>Loading...</span>
          </div>
        )}
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

export default LoadingInput;

