export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginProps {
  onSubmit: (credentials: LoginCredentials) => void | Promise<void>;
  isLoading?: boolean;
  error?: string;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  onForgotPassword?: () => void;
  disabled?: boolean;
  className?: string;
}

