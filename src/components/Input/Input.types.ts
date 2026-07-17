export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  // Existing props
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  
  // Visual style variants
  variant?: 'default' | 'outlined' | 'filled' | 'underlined';
  
  // Size options (renamed to avoid conflict with HTML input size attribute)
  size?: 'small' | 'medium' | 'large';
  
  // Icon support
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Clear functionality
  clearable?: boolean;
  onClear?: () => void;
  
  // Character counter
  showCharCount?: boolean;
  maxLength?: number;
  
  // Validation
  validationPattern?: 'email' | 'phone' | 'url' | 'number' | RegExp;
  validationMessage?: string;
}

