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
  leftIcon,
  rightIcon,
  showCharCount = false,
  maxLength,
  validationPattern,
  validationMessage,
  onValidate,
  value,
  onChange,
  onBlur,
  ...inputProps
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const charCountId = `${inputId}-charcount`;

  const [internalValue, setInternalValue] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [isTouched, setIsTouched] = useState(false);

  const currentValue = (value !== undefined ? value : internalValue) as string;
  const charCount = currentValue?.length || 0;
  const isApproachingLimit = maxLength && charCount >= maxLength * 0.9;

  const validateInput = useCallback((inputValue: string): boolean => {
    if (!validationPattern || !inputValue) {
      return true;
    }

    let isValid = false;
    if (typeof validationPattern === 'string') {
      const pattern = VALIDATION_PATTERNS[validationPattern];
      isValid = pattern.test(inputValue);
    } else {
      isValid = validationPattern.test(inputValue);
    }

    return isValid;
  }, [validationPattern]);

  const handleValidation = useCallback((inputValue: string) => {
    if (!validationPattern) return;

    const isValid = validateInput(inputValue);
    
    if (!isValid && isTouched && inputValue) {
      const errorMsg = validationMessage || 
        (typeof validationPattern === 'string' 
          ? DEFAULT_VALIDATION_MESSAGES[validationPattern] 
          : 'Invalid input');
      setValidationError(errorMsg);
    } else {
      setValidationError('');
    }

    if (onValidate) {
      onValidate(isValid, inputValue);
    }
  }, [validationPattern, validationMessage, onValidate, validateInput, isTouched]);

  useEffect(() => {
    if (isTouched) {
      handleValidation(currentValue);
    }
  }, [currentValue, handleValidation, isTouched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    
    if (onChange) {
      onChange(e);
    }

    if (isTouched) {
      handleValidation(newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    handleValidation(e.target.value);
    
    if (onBlur) {
      onBlur(e);
    }
  };

  const hasError = !!error || !!validationError;
  const displayError = error || validationError;
  const hasHelperText = !!helperText && !hasError;
  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon;

  const inputClassName = [
    styles.input,
    hasError ? styles.error : '',
    hasLeftIcon ? styles.inputWithLeftIcon : '',
    hasRightIcon ? styles.inputWithRightIcon : '',
    className
  ].filter(Boolean).join(' ').trim();

  const containerClassName = styles.container;

  const ariaDescribedBy = [
    hasError ? errorId : null,
    hasHelperText ? helperId : null,
    showCharCount ? charCountId : null,
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {hasLeftIcon && (
          <div className={styles.leftIconWrapper}>
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={inputClassName}
          disabled={disabled}
          aria-label={label || inputProps['aria-label']}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={maxLength}
          {...inputProps}
        />
        {hasRightIcon && (
          <div className={styles.rightIconWrapper}>
            {rightIcon}
          </div>
        )}
      </div>
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
      {showCharCount && maxLength && (
        <span 
          id={charCountId} 
          className={`${styles.charCount} ${isApproachingLimit ? styles.charCountWarning : ''}`}
        >
          {charCount} / {maxLength}
        </span>
      )}
    </div>
  );
};

