import React from 'react';
import { TextFieldProps } from './TextField.types';
import styles from './TextField.module.css';

export const TextField: React.FC<TextFieldProps> = ({
  className = '',
  placeholder,
  disabled = false,
  value,
  onChange,
  ...restProps
}) => {
  const inputClassName = `${styles.input} ${className}`.trim();

  return (
    <input
      type="text"
      className={inputClassName}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
      {...restProps}
    />
  );
};

export default TextField;

