export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  maxSize?: number;
  onFileSelect?: (files: File[]) => void;
  showFileList?: boolean;
  className?: string;
}

