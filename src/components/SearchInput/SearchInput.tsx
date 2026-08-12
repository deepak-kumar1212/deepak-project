import React, { useState, useId, useRef } from 'react';
import { SearchInputProps } from './SearchInput.types';
import styles from './SearchInput.module.css';

export const SearchInput: React.FC<SearchInputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  id,
  value: controlledValue,
  onChange,
  onClear,
  showClearButton,
  ...inputProps
}) => {
  const [internalValue, setInternalValue] = useState('');
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = !!error;
  const hasHelperText = !!helperText && !hasError;

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const hasValue = !!currentValue;

  const shouldShowClearButton = showClearButton !== undefined 
    ? showClearButton && hasValue 
    : hasValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    
    if (onChange) {
      const syntheticEvent = {
        target: { value: '' },
        currentTarget: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
    
    onClear?.();
    inputRef.current?.focus();
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
      <div className={styles.searchWrapper}>
        <svg
          className={styles.searchIcon}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          className={inputClassName}
          disabled={disabled}
          value={currentValue}
          onChange={handleChange}
          aria-label={label || inputProps['aria-label']}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? errorId : hasHelperText ? helperId : undefined
          }
          aria-required={required}
          {...inputProps}
        />
        {shouldShowClearButton && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
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

export default SearchInput;

