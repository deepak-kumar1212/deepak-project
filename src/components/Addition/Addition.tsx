import React, { useState } from 'react';
import { Input } from '../Input';
import { AdditionProps } from './Addition.types';
import styles from './Addition.module.css';

export const Addition: React.FC<AdditionProps> = ({
  onCalculate,
  className = '',
}) => {
  const [firstNumber, setFirstNumber] = useState<string>('');
  const [secondNumber, setSecondNumber] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    setError('');
    setResult(null);

    if (!firstNumber.trim() || !secondNumber.trim()) {
      setError('Please enter both numbers');
      return;
    }

    const num1 = parseFloat(firstNumber);
    const num2 = parseFloat(secondNumber);

    if (isNaN(num1) || isNaN(num2)) {
      setError('Please enter valid numbers');
      return;
    }

    const sum = num1 + num2;
    setResult(sum);

    if (onCalculate) {
      onCalculate(sum);
    }
  };

  const handleFirstNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstNumber(e.target.value);
    setError('');
    setResult(null);
  };

  const handleSecondNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondNumber(e.target.value);
    setError('');
    setResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  const containerClassName = `${styles.container} ${className}`.trim();

  return (
    <div className={containerClassName}>
      <h2 className={styles.title}>Addition Calculator</h2>
      
      <div className={styles.inputsWrapper}>
        <Input
          type="number"
          label="First Number"
          value={firstNumber}
          onChange={handleFirstNumberChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter first number"
          required
        />
        
        <Input
          type="number"
          label="Second Number"
          value={secondNumber}
          onChange={handleSecondNumberChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter second number"
          required
        />
      </div>

      <button
        type="button"
        className={styles.calculateButton}
        onClick={handleCalculate}
        disabled={!firstNumber.trim() || !secondNumber.trim()}
      >
        Calculate Sum
      </button>

      {result !== null && !error && (
        <div className={styles.resultContainer}>
          <div className={styles.resultLabel}>Result:</div>
          <div className={styles.resultValue}>{result}</div>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <div className={styles.errorText}>{error}</div>
        </div>
      )}
    </div>
  );
};

export default Addition;

