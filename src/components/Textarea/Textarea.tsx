import React, { useId, useState, ChangeEvent } from 'react';
import { TextareaProps } from './Textarea.types';
import styles from './Textarea.module.css';

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  disabled = false,
  id,
  rows = 4,
  maxLength,
  showCharCount = false,
  value,
  onChange,
  ...textareaProps
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;

  const [charCount, setCharCount] = useState<number>(
    typeof value === 'string' ? value.length : 0
  );

  const hasError = !!error;
  const hasHelperText = !!helperText && !hasError;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
    if (onChange) {
      onChange(e);
    }
  };

  const getCharCountClassName = () => {
    if (!maxLength) return styles.charCount;
    const percentage = (charCount / maxLength) * 100;
    if (percentage >= 100) return `${styles.charCount} ${styles.atLimit}`;
    if (percentage >= 90) return `${styles.charCount} ${styles.nearLimit}`;
    return styles.charCount;
  };

  const textareaClassName = `${styles.textarea} ${hasError ? styles.error : ''} ${className}`.trim();
  const containerClassName = styles.container;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={textareaClassName}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        aria-label={label || textareaProps['aria-label']}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? errorId : hasHelperText ? helperId : undefined
        }
        aria-required={required}
        {...textareaProps}
      />
      {hasError && (
        <span id={errorId} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      {hasHelperText && (
        <span id={helperId} className={styles.helperText}>
          {helperText}
        </span>
      )}
      {showCharCount && maxLength && (
        <div className={getCharCountClassName()}>
          {charCount} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default Textarea;

