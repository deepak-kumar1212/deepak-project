export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Existing props
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  
  // Visual style variants
  variant?: 'default' | 'outlined' | 'filled' | 'underlined';
  
  // Size options
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

