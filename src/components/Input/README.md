# Input Component

A fully accessible, reusable input field component built with React and TypeScript. This component provides comprehensive form input functionality with built-in error handling, helper text, and WCAG-compliant accessibility features.

## Overview

The Input component is a flexible, production-ready form input that extends native HTML input functionality with enhanced features including:

- ✅ Full TypeScript support with type-safe props
- ✅ Built-in accessibility (ARIA attributes, screen reader support)
- ✅ Error state management with visual feedback
- ✅ Helper text for user guidance
- ✅ Required field indicators
- ✅ Responsive design optimized for mobile and desktop
- ✅ Customizable styling via CSS modules
- ✅ Support for all standard HTML input attributes

---

## Installation & Import

```tsx
import { Input } from '@/components/Input';
// or
import Input from '@/components/Input';
```

---

## Props API

The `Input` component accepts all standard HTML input attributes plus the following custom props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Optional label text displayed above the input field |
| `error` | `string` | `undefined` | Error message to display below the input. When set, the input enters error state with red styling |
| `helperText` | `string` | `undefined` | Helper text displayed below the input (hidden when error is present) |
| `required` | `boolean` | `false` | Marks the field as required, displays a red asterisk (*) next to the label, and sets `aria-required` |
| `className` | `string` | `''` | Additional CSS classes to apply to the input element |
| `disabled` | `boolean` | `false` | Disables the input field |
| `id` | `string` | auto-generated | Custom ID for the input element. If not provided, a unique ID is auto-generated using React's `useId()` hook |

### Standard HTML Input Attributes

The component also supports all standard HTML input attributes through prop spreading:

- `type` - Input type (text, email, password, number, tel, url, etc.)
- `placeholder` - Placeholder text
- `value` - Controlled input value
- `defaultValue` - Uncontrolled input default value
- `onChange` - Change event handler
- `onBlur` - Blur event handler
- `onFocus` - Focus event handler
- `name` - Input name for form submission
- `autoComplete` - Autocomplete behavior
- `maxLength` - Maximum character length
- `minLength` - Minimum character length
- `pattern` - Validation pattern (regex)
- `readOnly` - Makes input read-only
- And all other standard input attributes...

---

## Accessibility Features

The Input component is built with accessibility as a core principle, implementing WCAG 2.1 guidelines:

### Auto-Generated IDs
- Uses React's `useId()` hook to generate unique IDs automatically
- Ensures proper association between labels, inputs, and helper text
- Prevents ID collisions in applications with multiple instances

### ARIA Attributes
- **`aria-label`**: Automatically set from the `label` prop, or can be manually provided
- **`aria-invalid`**: Set to `true` when an error is present
- **`aria-describedby`**: Links the input to error messages or helper text for screen readers
- **`aria-required`**: Set to `true` when the `required` prop is enabled

### Error Handling
- Error messages use `role="alert"` to announce changes to screen readers
- Visual error state with red border and background tint
- Error messages are properly associated with the input via `aria-describedby`

### Label Association
- Labels are properly associated with inputs using `htmlFor` and `id` attributes
- Required fields display a visual asterisk (*) indicator
- Labels maintain proper contrast ratios for readability

### Keyboard Navigation
- Full keyboard support (Tab, Shift+Tab, Enter)
- Focus states clearly visible with blue outline
- Disabled state prevents interaction and is visually distinct

---

## Styling

The component uses **CSS Modules** for scoped styling, preventing style conflicts and ensuring maintainability.

### Available States

| State | Description | Visual Feedback |
|-------|-------------|-----------------|
| **Default** | Normal input state | Gray border (#d1d5db), white background |
| **Hover** | Mouse hover (not disabled) | Darker gray border (#9ca3af) |
| **Focus** | Input has focus | Blue outline (#3b82f6), blue border |
| **Disabled** | Input is disabled | Reduced opacity (0.6), gray background, cursor not-allowed |
| **Error** | Error message present | Red border (#ef4444), light red background (#fef2f2) |
| **Error + Focus** | Error state with focus | Red outline and border (#ef4444) |

### Color Scheme

- **Primary (Focus)**: `#3b82f6` (Blue)
- **Error**: `#ef4444` (Red)
- **Error Background**: `#fef2f2` (Light Red)
- **Error Text**: `#dc2626` (Dark Red)
- **Border Default**: `#d1d5db` (Gray)
- **Border Hover**: `#9ca3af` (Dark Gray)
- **Text**: `#333` (Dark Gray)
- **Label**: `#374151` (Slate)
- **Helper Text**: `#6b7280` (Gray)

### Responsive Design

The component includes a mobile breakpoint at **640px**:

**Desktop (> 640px)**:
- Input font size: `1rem` (16px)
- Input padding: `0.625rem 0.75rem` (10px 12px)
- Label/helper text: `0.875rem` (14px)

**Mobile (≤ 640px)**:
- Input font size: `0.875rem` (14px)
- Input padding: `0.5rem 0.625rem` (8px 10px)
- Label/helper text: `0.8125rem` (13px)

### Custom Styling

You can extend or override styles using the `className` prop:

```tsx
<Input
  label="Custom Styled Input"
  className="my-custom-class"
/>
```

---

## Usage Examples

For comprehensive usage examples including basic inputs, validation, forms, and advanced patterns, see the **[Input.examples.tsx](./Input.examples.tsx)** file.

### Quick Example

```tsx
import { Input } from '@/components/Input';
import { useState } from 'react';

function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(''); // Clear error on change
  };

  const handleBlur = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
    }
  };

  return (
    <Input
      label="Email Address"
      type="email"
      value={email}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      required
      placeholder="you@example.com"
    />
  );
}
```

---

## Best Practices

1. **Always provide labels** for better accessibility and user experience
2. **Use the `required` prop** instead of manually adding asterisks
3. **Provide clear error messages** that explain how to fix the issue
4. **Use helper text** to guide users before they make mistakes
5. **Choose appropriate input types** (email, tel, url, etc.) for better mobile keyboards
6. **Implement proper validation** on both client and server side
7. **Clear errors on user input** to provide immediate feedback

---

## TypeScript Support

The component is fully typed with TypeScript. The `InputProps` interface extends `React.InputHTMLAttributes<HTMLInputElement>`, providing full IntelliSense support for all props.

```tsx
import { InputProps } from '@/components/Input/Input.types';

// Custom wrapper example
const MyCustomInput: React.FC<InputProps> = (props) => {
  return <Input {...props} className="my-wrapper-class" />;
};
```

---

## Browser Support

The component uses modern CSS features and React hooks. Ensure your project supports:

- React 16.8+ (for hooks)
- Modern browsers with CSS custom properties support
- ES6+ JavaScript features

---

## License

This component is part of the project and follows the project's license.

