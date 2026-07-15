import React, { useState, FormEvent } from 'react';
import { LoginProps } from './Login.types';
import styles from './Login.module.css';

export const Login: React.FC<LoginProps> = ({
  onSubmit,
  isLoading = false,
  error,
  showRememberMe = true,
  showForgotPassword = true,
  onForgotPassword,
  disabled = false,
  className = '',
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      errors.username = 'Username or email is required';
    } else if (username.includes('@') && !validateEmail(username)) {
      errors.username = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const credentials = {
      username: username.trim(),
      password,
      ...(showRememberMe && { rememberMe }),
    };

    await onSubmit(credentials);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (validationErrors.username) {
      setValidationErrors((prev) => ({ ...prev, username: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isFormDisabled = disabled || isLoading;
  const containerClassName = `${styles.loginContainer} ${className}`.trim();

  return (
    <div className={containerClassName}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="login-username" className={styles.label}>
            Email or Username
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            disabled={isFormDisabled}
            className={`${styles.input} ${
              validationErrors.username ? styles.error : ''
            }`}
            aria-label="Email or Username"
            aria-invalid={!!validationErrors.username}
            aria-describedby={
              validationErrors.username ? 'username-error' : undefined
            }
            autoComplete="username"
          />
          {validationErrors.username && (
            <span
              id="username-error"
              className={styles.errorMessage}
              role="alert"
            >
              {validationErrors.username}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="login-password" className={styles.label}>
            Password
          </label>
          <div className={styles.passwordWrapper}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              disabled={isFormDisabled}
              className={`${styles.input} ${styles.passwordInput} ${
                validationErrors.password ? styles.error : ''
              }`}
              aria-label="Password"
              aria-invalid={!!validationErrors.password}
              aria-describedby={
                validationErrors.password ? 'password-error' : undefined
              }
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={isFormDisabled}
              className={styles.toggleButton}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {validationErrors.password && (
            <span
              id="password-error"
              className={styles.errorMessage}
              role="alert"
            >
              {validationErrors.password}
            </span>
          )}
        </div>

        {(showRememberMe || showForgotPassword) && (
          <div className={styles.optionsRow}>
            {showRememberMe && (
              <div className={styles.checkboxGroup}>
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isFormDisabled}
                  className={styles.checkbox}
                  aria-label="Remember me"
                />
                <label
                  htmlFor="login-remember"
                  className={styles.checkboxLabel}
                >
                  Remember me
                </label>
              </div>
            )}
            {showForgotPassword && onForgotPassword && (
              <button
                type="button"
                onClick={onForgotPassword}
                disabled={isFormDisabled}
                className={styles.forgotPassword}
                aria-label="Forgot password"
              >
                Forgot password?
              </button>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isFormDisabled}
          className={`${styles.submitButton} ${
            isLoading ? styles.loading : ''
          }`}
          aria-label="Sign in"
        >
          {isLoading && <span className={styles.spinner} aria-hidden="true" />}
          {!isLoading && 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;

