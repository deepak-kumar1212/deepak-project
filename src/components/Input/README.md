# Input Component

## Overview

The Input component is a fully accessible, reusable form input field built with React and TypeScript. It provides a consistent user experience with built-in support for labels, error handling, helper text, and various input states.

This component is designed to handle all common input scenarios while maintaining accessibility standards and providing a clean, modern interface.

## Key Features

- ✅ **Label Support** - Optional labels with required field indicators
- ✅ **Error Handling** - Built-in error state with error messages
- ✅ **Helper Text** - Contextual help text for user guidance
- ✅ **Full Accessibility** - WCAG compliant with proper ARIA attributes
- ✅ **Disabled State** - Visual and functional disabled state
- ✅ **Responsive Design** - Adapts to mobile and desktop screens
- ✅ **TypeScript Support** - Full type safety with TypeScript
- ✅ **CSS Modules** - Scoped styling to prevent conflicts
- ✅ **Native HTML Attributes** - Extends all standard input attributes

## Technology Stack

- **React** - Component framework
- **TypeScript** - Type safety and developer experience
- **CSS Modules** - Scoped component styling
- **React Hooks** - useId for accessibility

---


## Props API

### TypeScript Interface

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}
```

### Props Description

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Label text displayed above the input field |
| `error` | `string` | `undefined` | Error message displayed below the input. When set, the input enters error state |
| `helperText` | `string` | `undefined` | Helper text displayed below the input (hidden when error is present) |
| `required` | `boolean` | `false` | Marks the field as required and displays an asterisk (*) next to the label |
| `className` | `string` | `''` | Additional CSS classes to apply to the input element |
| `disabled` | `boolean` | `false` | Disables the input field |
| `id` | `string` | auto-generated | Custom ID for the input (auto-generated if not provided) |
| `...inputProps` | `React.InputHTMLAttributes<HTMLInputElement>` | - | All standard HTML input attributes (type, placeholder, value, onChange, etc.) |

### Inherited HTML Input Attributes

Since the component extends `React.InputHTMLAttributes<HTMLInputElement>`, you can use all native HTML input attributes:

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
- `pattern` - Validation pattern
- And many more...

---


## Usage Examples

### Basic Input

```tsx
import { Input } from './components/Input';

function MyForm() {
  return <Input placeholder="Enter text..." />;
}
```

### Input with Label

```tsx
<Input 
  label="Username" 
  placeholder="Enter your username" 
/>
```

### Required Input

The required prop adds an asterisk (*) indicator next to the label:

```tsx
<Input 
  label="Email Address" 
  type="email"
  placeholder="you@example.com"
  required 
/>
```

### Input with Error State

When an error is provided, the input displays in error state with the error message:

```tsx
<Input 
  label="Password" 
  type="password"
  error="Password must be at least 8 characters"
  value={password}
/>
```

### Input with Helper Text

Helper text provides additional context to users:

```tsx
<Input 
  label="Username" 
  helperText="Choose a unique username between 3-20 characters"
  placeholder="Enter username"
/>
```

**Note:** Helper text is automatically hidden when an error is present.

### Disabled Input

```tsx
<Input 
  label="Account ID" 
  value="12345"
  disabled 
/>
```

---


## Advanced Usage Examples

### Different Input Types

The component supports all HTML5 input types:

```tsx
// Text input (default)
<Input label="Full Name" type="text" />

// Email input
<Input label="Email" type="email" placeholder="you@example.com" />

// Password input
<Input label="Password" type="password" />

// Number input
<Input label="Age" type="number" min="0" max="120" />

// Telephone input
<Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" />

// URL input
<Input label="Website" type="url" placeholder="https://example.com" />

// Date input
<Input label="Birth Date" type="date" />

// Search input
<Input label="Search" type="search" placeholder="Search..." />
```

### Input with Custom ClassName

Add custom styling while preserving the component's base styles:

```tsx
<Input 
  label="Custom Styled Input" 
  className="my-custom-class"
  placeholder="Custom styling applied"
/>
```

### Controlled Input with State

```tsx
import { useState } from 'react';
import { Input } from './components/Input';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors = { email: '', password: '' };
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    
    if (!newErrors.email && !newErrors.password) {
      // Submit form
      console.log('Form submitted:', { email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        helperText="Must be at least 8 characters"
        required
      />
      
      <button type="submit">Login</button>
    </form>
  );
}
```

---


## Accessibility Features

The Input component is built with accessibility as a core principle, following WCAG guidelines:

### ARIA Attributes

- **`aria-label`** - Automatically set from the `label` prop, or can be manually provided
- **`aria-invalid`** - Set to `true` when an error is present
- **`aria-describedby`** - Links the input to error or helper text for screen readers
- **`aria-required`** - Set to `true` when the `required` prop is provided

### Auto-Generated IDs

The component uses React's `useId` hook to generate unique IDs for:
- Input element
- Error message element
- Helper text element

This ensures proper association between elements for assistive technologies.

### Error Announcements

Error messages use `role="alert"` to immediately announce errors to screen reader users when validation fails.

### Keyboard Navigation

- Full keyboard support for all input interactions
- Focus states are clearly visible with outline styling
- Tab navigation works seamlessly

### Screen Reader Support

- Labels are properly associated with inputs
- Error and helper text are announced when the input receives focus
- Required fields are announced to screen reader users

---


## Styling

### CSS Modules

The component uses CSS Modules for scoped styling, preventing style conflicts with other components. Styles are imported from `Input.module.css`.

### Visual States

The Input component includes distinct visual states:

#### Default State
- White background
- Gray border (`#d1d5db`)
- Smooth transitions

#### Hover State
- Darker border color (`#9ca3af`)
- Only active when not disabled

#### Focus State
- Blue outline (`#3b82f6`)
- Blue border
- 2px outline with offset for visibility

#### Error State
- Red border (`#ef4444`)
- Light red background (`#fef2f2`)
- Red outline on focus
- Error message displayed in red

#### Disabled State
- Reduced opacity (0.6)
- Gray background (`#f3f4f6`)
- Not-allowed cursor
- No hover effects

### Responsive Design

The component adapts to different screen sizes:

**Desktop (> 640px)**
- Font size: 1rem (16px)
- Padding: 0.625rem 0.75rem

**Mobile (≤ 640px)**
- Font size: 0.875rem (14px)
- Padding: 0.5rem 0.625rem
- Smaller label and helper text

### Custom Styling

You can extend the component's styling in two ways:

1. **Using the className prop:**
```tsx
<Input className="my-custom-input" />
```

2. **CSS Modules composition:**
```css
.myInput {
  composes: input from './Input.module.css';
  /* Your custom styles */
}
```

---

## Best Practices

### Form Validation

- Always provide clear, actionable error messages
- Validate on blur or submit, not on every keystroke (for better UX)
- Clear errors when the user starts correcting them

### Labels

- Always provide labels for accessibility
- Use descriptive labels that clearly indicate what input is expected
- Mark required fields with the `required` prop

### Helper Text

- Use helper text to provide context before errors occur
- Keep helper text concise and actionable
- Remember that helper text is hidden when errors are shown

### Performance

- Use controlled inputs only when necessary
- For simple forms, uncontrolled inputs with refs can be more performant
- Debounce validation for real-time validation scenarios

---

## License

This component is part of the project and follows the project's license.

