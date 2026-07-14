import React from 'react';
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
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const option = options.find(opt => String(opt.value) === selectedValue);
    if (option) {
      onChange(option.value);
    }
  };

  const selectClassName = `${styles.select} ${className}`.trim();

  return (
    <select
      id={id}
      name={name}
      value={value !== undefined ? String(value) : ''}
      onChange={handleChange}
      disabled={disabled}
      className={selectClassName}
      aria-label={placeholder || 'Select an option'}
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
  );
};

export default Select;

