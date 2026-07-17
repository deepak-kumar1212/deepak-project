export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Existing props
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  
  // Icon support
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Character count feature
  showCharCount?: boolean;
  maxLength?: number;
  
  // Validation features
  validationPattern?: 'email' | 'phone' | 'url' | 'number' | RegExp;
  validationMessage?: string;
  onValidate?: (isValid: boolean, value: string) => void;
}

