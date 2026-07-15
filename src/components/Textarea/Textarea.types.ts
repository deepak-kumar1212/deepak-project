export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

