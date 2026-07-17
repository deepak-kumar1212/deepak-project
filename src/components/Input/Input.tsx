import React, { useId, useState, useCallback, useEffect } from 'react';
import { InputProps } from './Input.types';
import styles from './Input.module.css';

const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]+$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  number: /^\d+$/,
};

const DEFAULT_VALIDATION_MESSAGES = {
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  number: 'Please enter a valid number',
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  id,
  variant = 'default',
  size = 'medium',
  leftIcon,
  rightIcon,
  clearable = false,
  onClear,
  showCharCount = false,
  maxLength,
  validationPattern,
  validationMessage,
  value,
  onChange,
  onBlur,
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const validationId = `${inputId}-validation`;

  const [internalValue, setInternalValue] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');

  const currentValue = value !== undefined ? String(value) : internalValue;
  const charCount = currentValue.length;
  const isNearLimit = maxLength && charCount >= maxLength * 0.9;

  const validateInput = useCallback((inputValue: string): boolean => {
    if (!validationPattern || !inputValue) {
      setValidationError('');
      return true;
    }

    let pattern: RegExp;
    let defaultMessage: string;

    if (typeof validationPattern === 'string') {
      pattern = VALIDATION_PATTERNS[validationPattern as keyof typeof VALIDATION_PATTERNS];
      defaultMessage = DEFAULT_VALIDATION_MESSAGES[validationPattern as keyof typeof DEFAULT_VALIDATION_MESSAGES];
    } else {
      pattern = validationPattern;
      defaultMessage = 'Invalid input format';
    }

    const isValid = pattern.test(inputValue);
    
    if (!isValid) {
      setValidationError(validationMessage || defaultMessage);
    } else {
      setValidationError('');
    }

    return isValid;
  }, [validationPattern, validationMessage]);

  useEffect(() => {
    if (currentValue) {
      validateInput(currentValue);
    }
  }, [currentValue, validateInput]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    
    if (validationPattern && newValue) {
      validateInput(newValue);
    } else {
      setValidationError('');
    }
    
    onChange?.(e);
  }, [onChange, validationPattern, validateInput, value]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (validationPattern && e.target.value) {
      validateInput(e.target.value);
    }
    
    onBlur?.(e);
  }, [onBlur, validationPattern, validateInput]);

  const handleClear = useCallback(() => {
    if (value === undefined) {
      setInternalValue('');
    }
    setValidationError('');
    onClear?.();
  }, [onClear, value]);

  const hasError = !!error || !!validationError;
  const displayError = error || validationError;
  const hasHelperText = !!helperText && !hasError;
  const showClearButton = clearable && currentValue && !disabled;

  const inputClassName = [
    styles.input,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    hasError ? styles.error : '',
    disabled ? styles.disabled : '',
    leftIcon ? styles.hasLeftIcon : '',
    rightIcon || showClearButton ? styles.hasRightIcon : '',
    className
  ].filter(Boolean).join(' ').trim();

  const ariaDescribedBy = [
    hasError ? errorId : '',
    hasHelperText ? helperId : '',
    validationError ? validationId : ''
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {leftIcon && (
          <span className={styles.leftIcon}>
            {leftIcon}
          </span>
        )}
        
        <input
          id={inputId}
          className={inputClassName}
          disabled={disabled}
          value={currentValue}
          maxLength={maxLength}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label={label || inputProps['aria-label']}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          {...inputProps}
        />
        
        {rightIcon && !showClearButton && (
          <span className={styles.rightIcon}>
            {rightIcon}
          </span>
        )}
        
        {showClearButton && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Clear input"
            tabIndex={-1}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      
      {showCharCount && maxLength && (
        <div className={`${styles.charCount} ${isNearLimit ? styles.charCountWarning : ''}`}>
          {charCount} / {maxLength}
        </div>
      )}
      
      {hasError && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {displayError}
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

