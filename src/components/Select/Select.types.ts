export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  id?: string;
}

