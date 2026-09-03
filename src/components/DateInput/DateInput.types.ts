export interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  min?: string;
  max?: string;
  value?: string;
  onChange?: (value: string) => void;
}

