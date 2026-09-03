import React, { useId } from 'react';
import { SelectProps } from './Select.types';
import styles from './Select.module.css';

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  name,
  id,
  label,
  error,
  helperText,
  required = false,
  fullWidth = false,
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const hasError = !!error;
  const hasHelperText = !!helperText && !hasError;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const option = options.find(opt => String(opt.value) === selectedValue);
    if (option) {
      onChange(option.value);
    }
  };

  const selectClassName = `${styles.select} ${hasError ? styles.selectError : ''} ${disabled ? styles.selectDisabled : ''} ${fullWidth ? styles.fullWidth : ''} ${className}`.trim();
  const containerClassName = `${styles.container} ${fullWidth ? styles.fullWidth : ''}`.trim();

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value !== undefined ? String(value) : ''}
        onChange={handleChange}
        disabled={disabled}
        className={selectClassName}
        aria-label={label || placeholder || 'Select an option'}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? errorId : hasHelperText ? helperId : undefined
        }
        aria-required={required}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
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

export default Select;

