import React, { useState } from 'react';
import { Input } from './index';

/**
 * InputExamples Component
 * 
 * Comprehensive examples demonstrating all features of the Input component.
 * This file serves as both documentation and a testing playground.
 */
export const InputExamples: React.FC = () => {
  // State for controlled input example
  const [controlledValue, setControlledValue] = useState('');

  // State for complete form example
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form validation logic
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    return errors;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setFormSubmitted(true);
      console.log('Form submitted successfully:', formData);
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
        });
      }, 3000);
    }
  };

  const handleFormChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Input Component Examples</h1>
      <p style={styles.description}>
        Comprehensive examples demonstrating all features and use cases of the Input component.
      </p>



      {/* Basic Input */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>1. Basic Input</h2>
        <p style={styles.sectionDescription}>
          A simple input with no additional props. Uses default HTML input behavior.
        </p>
        <div style={styles.exampleBox}>
          <Input placeholder="Enter text..." />
        </div>
      </section>

      {/* Input with Label */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>2. Input with Label</h2>
        <p style={styles.sectionDescription}>
          Using the <code>label</code> prop to add a descriptive label above the input.
          The label is automatically associated with the input for accessibility.
        </p>
        <div style={styles.exampleBox}>
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
          />
        </div>
      </section>

      {/* Required Field */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>3. Required Field</h2>
        <p style={styles.sectionDescription}>
          Using <code>required={'{true}'}</code> adds a red asterisk (*) to the label and sets
          the <code>aria-required</code> attribute for screen readers.
        </p>
        <div style={styles.exampleBox}>
          <Input 
            label="Email Address" 
            type="email"
            placeholder="you@example.com" 
            required 
          />
        </div>
      </section>

      {/* Input with Helper Text */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>4. Input with Helper Text</h2>
        <p style={styles.sectionDescription}>
          Using the <code>helperText</code> prop to provide additional guidance or context.
          Helper text appears below the input in a muted color.
        </p>
        <div style={styles.exampleBox}>
          <Input 
            label="Username" 
            placeholder="johndoe123" 
            helperText="Choose a unique username with 3-20 characters" 
          />
        </div>
      </section>



      {/* Error State */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>5. Error State</h2>
        <p style={styles.sectionDescription}>
          Using the <code>error</code> prop to display validation errors. The input border
          turns red, and the error message appears below with <code>role="alert"</code> for
          screen readers. Error messages take precedence over helper text.
        </p>
        <div style={styles.exampleBox}>
          <Input 
            label="Password" 
            type="password"
            placeholder="Enter password" 
            error="Password must be at least 8 characters long" 
          />
        </div>
      </section>

      {/* Disabled State */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>6. Disabled State</h2>
        <p style={styles.sectionDescription}>
          Using the <code>disabled</code> prop to make the input non-interactive.
          The input appears grayed out and cannot receive focus.
        </p>
        <div style={styles.exampleBox}>
          <Input 
            label="Account Status" 
            value="Active" 
            disabled 
            helperText="This field cannot be edited"
          />
        </div>
      </section>

      {/* Different Input Types */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>7. Different Input Types</h2>
        <p style={styles.sectionDescription}>
          The Input component supports all standard HTML input types. Here are some common examples:
        </p>
        <div style={styles.exampleBox}>
          <div style={styles.inputGroup}>
            <Input 
              label="Email" 
              type="email"
              placeholder="you@example.com" 
              helperText="We'll never share your email"
            />
          </div>
          <div style={styles.inputGroup}>
            <Input 
              label="Password" 
              type="password"
              placeholder="Enter secure password" 
            />
          </div>
          <div style={styles.inputGroup}>
            <Input 
              label="Age" 
              type="number"
              placeholder="25" 
              min="0"
              max="120"
            />
          </div>
          <div style={styles.inputGroup}>
            <Input 
              label="Phone Number" 
              type="tel"
              placeholder="(555) 123-4567" 
            />
          </div>
          <div style={styles.inputGroup}>
            <Input 
              label="Website" 
              type="url"
              placeholder="https://example.com" 
            />
          </div>
          <div style={styles.inputGroup}>
            <Input 
              label="Date of Birth" 
              type="date"
            />
          </div>
        </div>
      </section>



      {/* Custom Styling */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>8. Custom Styling</h2>
        <p style={styles.sectionDescription}>
          Using the <code>className</code> prop to add custom CSS classes for additional styling.
          This example adds a custom border color and background.
        </p>
        <div style={styles.exampleBox}>
          <Input 
            label="Custom Styled Input" 
            placeholder="This input has custom styling" 
            className="custom-input-class"
            helperText="You can add custom CSS classes to override default styles"
          />
          <style>{`
            .custom-input-class {
              border: 2px solid #8b5cf6 !important;
              background-color: #faf5ff !important;
            }
            .custom-input-class:focus {
              border-color: #7c3aed !important;
              box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1) !important;
            }
          `}</style>
        </div>
      </section>

      {/* Controlled Input */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>9. Controlled Input with React State</h2>
        <p style={styles.sectionDescription}>
          Example of a controlled input using React's <code>useState</code> hook.
          The input value is managed by component state and updated via <code>onChange</code>.
        </p>
        <div style={styles.exampleBox}>
          <Input 
            label="Controlled Input" 
            value={controlledValue}
            onChange={(e) => setControlledValue(e.target.value)}
            placeholder="Type something..." 
            helperText={`Character count: ${controlledValue.length}`}
          />
          <div style={styles.stateDisplay}>
            <strong>Current value:</strong> {controlledValue || '(empty)'}
          </div>
          <button 
            onClick={() => setControlledValue('')}
            style={styles.clearButton}
          >
            Clear Input
          </button>
        </div>
      </section>



      {/* Complete Form Example */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>10. Complete Form Example</h2>
        <p style={styles.sectionDescription}>
          A realistic registration form demonstrating multiple inputs with validation,
          error handling, and form submission. Try submitting with empty or invalid values
          to see error states in action.
        </p>
        <div style={styles.exampleBox}>
          {formSubmitted && (
            <div style={styles.successMessage}>
              ✓ Form submitted successfully! Resetting in 3 seconds...
            </div>
          )}
          <form onSubmit={handleFormSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <Input 
                label="Username" 
                value={formData.username}
                onChange={handleFormChange('username')}
                error={formErrors.username}
                placeholder="johndoe123" 
                required
                helperText={!formErrors.username ? "Minimum 3 characters" : undefined}
              />
            </div>

            <div style={styles.inputGroup}>
              <Input 
                label="Email Address" 
                type="email"
                value={formData.email}
                onChange={handleFormChange('email')}
                error={formErrors.email}
                placeholder="you@example.com" 
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <Input 
                label="Password" 
                type="password"
                value={formData.password}
                onChange={handleFormChange('password')}
                error={formErrors.password}
                placeholder="Enter secure password" 
                required
                helperText={!formErrors.password ? "Minimum 8 characters" : undefined}
              />
            </div>

            <div style={styles.inputGroup}>
              <Input 
                label="Confirm Password" 
                type="password"
                value={formData.confirmPassword}
                onChange={handleFormChange('confirmPassword')}
                error={formErrors.confirmPassword}
                placeholder="Re-enter password" 
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <Input 
                label="Phone Number" 
                type="tel"
                value={formData.phone}
                onChange={handleFormChange('phone')}
                error={formErrors.phone}
                placeholder="(555) 123-4567" 
                helperText={!formErrors.phone ? "Optional - 10 digits" : undefined}
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              Register Account
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};



// Inline styles for the examples page
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    lineHeight: '1.6',
    color: '#1f2937',
  },
  mainTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '16px',
    color: '#111827',
  },
  description: {
    fontSize: '1.125rem',
    color: '#6b7280',
    marginBottom: '48px',
  },
  section: {
    marginBottom: '48px',
    paddingBottom: '48px',
    borderBottom: '1px solid #e5e7eb',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#111827',
  },
  sectionDescription: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '24px',
    lineHeight: '1.7',
  },
  exampleBox: {
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '32px',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  stateDisplay: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#374151',
  },
  clearButton: {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  form: {
    width: '100%',
  },
  submitButton: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '8px',
  },
  successMessage: {
    padding: '16px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: '1px solid #6ee7b7',
    borderRadius: '6px',
    marginBottom: '24px',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
} as const;

export default InputExamples;

