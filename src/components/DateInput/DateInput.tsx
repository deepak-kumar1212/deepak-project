import React, { useId } from 'react';
import { DateInputProps } from './DateInput.types';
import styles from './DateInput.module.css';

export const DateInput: React.FC<DateInputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  id,
  min,
  max,
  value,
  onChange,
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const hasError = !!error;
  const hasHelperText = !!helperText && !hasError;

  const inputClassName = `${styles.input} ${hasError ? styles.inputError : ''} ${disabled ? styles.inputDisabled : ''} ${className}`.trim();
  const containerClassName = styles.container;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <input
        type="date"
        id={inputId}
        className={inputClassName}
        disabled={disabled}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
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

export default DateInput;

