import React, { useState } from 'react';
import Input from './Input';

/**
 * InputExamples Component
 * 
 * This file demonstrates various usage patterns and real-world examples
 * of the Input component. Use these examples as a reference for implementing
 * inputs in your application.
 */

const InputExamples: React.FC = () => {
  // State for controlled inputs
  const [basicValue, setBasicValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [validatedValue, setValidatedValue] = useState('');
  const [validationError, setValidationError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Validation handler for real-time validation example
  const handleValidatedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValidatedValue(value);

    // Simple validation: must be at least 3 characters
    if (value.length > 0 && value.length < 3) {
      setValidationError('Must be at least 3 characters');
    } else {
      setValidationError('');
    }
  };

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }

    if (formData.age && (parseInt(formData.age) < 18 || parseInt(formData.age) > 120)) {
      errors.age = 'Age must be between 18 and 120';
    }

    return errors;
  };

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setFormSubmitted(true);
      console.log('Form submitted successfully:', formData);
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          age: '',
        });
        setFormSubmitted(false);
      }, 3000);
    }
  };

  // Form field change handler
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Input Component Examples</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>
        Explore various usage patterns and real-world examples of the Input component.
      </p>

      {/* Basic Examples Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Basic Examples
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Simple Input (No Label)</h3>
          <Input
            placeholder="Enter text here..."
            value={basicValue}
            onChange={(e) => setBasicValue(e.target.value)}
          />
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            Current value: "{basicValue}"
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Input with Label</h3>
          <Input
            label="Username"
            placeholder="Enter your username"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Required Input</h3>
          <Input
            label="Email Address"
            placeholder="you@example.com"
            required
          />
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            Notice the asterisk (*) indicating this field is required
          </p>
        </div>
      </section>

      {/* Validation Examples Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Validation Examples
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Input with Error State</h3>
          <Input
            label="Username"
            placeholder="Enter username"
            error="This username is already taken"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Input with Helper Text</h3>
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Real-time Validation</h3>
          <Input
            label="Display Name"
            placeholder="Enter at least 3 characters"
            value={validatedValue}
            onChange={handleValidatedChange}
            error={validationError}
            helperText={!validationError ? 'This will be your public display name' : undefined}
          />
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            Try typing less than 3 characters to see the error state
          </p>
        </div>
      </section>

      {/* State Examples Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          State Examples
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Controlled Input</h3>
          <Input
            label="Controlled Value"
            placeholder="Type something..."
            value={basicValue}
            onChange={(e) => setBasicValue(e.target.value)}
          />
          <button
            onClick={() => setBasicValue('')}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Clear Value
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Disabled Input</h3>
          <Input
            label="Disabled Field"
            placeholder="This field is disabled"
            value="Cannot edit this value"
            disabled
          />
        </div>
      </section>

      {/* Type Examples Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Input Type Examples
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Email Input</h3>
          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            helperText="We'll never share your email with anyone"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Password Input</h3>
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Number Input</h3>
          <Input
            type="number"
            label="Age"
            placeholder="Enter your age"
            min="0"
            max="120"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Telephone Input</h3>
          <Input
            type="tel"
            label="Phone Number"
            placeholder="(555) 123-4567"
            helperText="Format: (XXX) XXX-XXXX"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>URL Input</h3>
          <Input
            type="url"
            label="Website"
            placeholder="https://example.com"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Date Input</h3>
          <Input
            type="date"
            label="Date of Birth"
          />
        </div>
      </section>

      {/* Form Example Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Complete Form Example
        </h2>

        {formSubmitted && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              borderRadius: '4px',
              marginBottom: '1.5rem',
            }}
          >
            ✓ Form submitted successfully! Check the console for form data.
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              label="First Name"
              placeholder="John"
              value={formData.firstName}
              onChange={handleFormChange('firstName')}
              error={formErrors.firstName}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              label="Last Name"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleFormChange('lastName')}
              error={formErrors.lastName}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              type="email"
              label="Email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleFormChange('email')}
              error={formErrors.email}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              type="tel"
              label="Phone Number"
              placeholder="1234567890"
              value={formData.phone}
              onChange={handleFormChange('phone')}
              error={formErrors.phone}
              helperText="Optional: 10 digits"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              type="number"
              label="Age"
              placeholder="25"
              value={formData.age}
              onChange={handleFormChange('age')}
              error={formErrors.age}
              helperText="Must be 18 or older"
              min="18"
              max="120"
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Submit Form
          </button>
        </form>
      </section>

      {/* Custom Styling Example Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Custom Styling Example
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3>Input with Custom ClassName</h3>
          <Input
            label="Custom Styled Input"
            placeholder="This input has custom styling"
            className="custom-input-class"
            helperText="You can add custom CSS classes to override or extend default styles"
          />
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
            Add your custom styles in your CSS file targeting the className prop
          </p>
        </div>
      </section>

      {/* Usage Tips Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Usage Tips
        </h2>
        <ul style={{ lineHeight: '1.8', color: '#333' }}>
          <li>Always use the <code>label</code> prop for better accessibility</li>
          <li>Use <code>required</code> prop to indicate mandatory fields</li>
          <li>Provide helpful <code>helperText</code> to guide users</li>
          <li>Show <code>error</code> messages for validation feedback</li>
          <li>Use appropriate input <code>type</code> for better mobile experience</li>
          <li>Implement controlled inputs with <code>value</code> and <code>onChange</code> for form handling</li>
          <li>Clear error messages when users start correcting their input</li>
          <li>Use <code>placeholder</code> to show example values, not instructions</li>
        </ul>
      </section>
    </div>
  );
};

export default InputExamples;

