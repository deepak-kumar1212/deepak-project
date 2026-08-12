import { InputProps } from '../Input/Input.types';

export interface SearchInputProps extends Omit<InputProps, 'type'> {
  onClear?: () => void;
  showClearButton?: boolean;
}

