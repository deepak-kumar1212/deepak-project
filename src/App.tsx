import React, { useState } from 'react';
import { Input } from './components/Input';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Enhanced Input Component Demo</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Email with Validation</h2>
        <Input
          label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          validationPattern="email"
          validationMessage="Please enter a valid email"
          onValidate={(isValid, value) => console.log('Email valid:', isValid, value)}
          leftIcon={<span>📧</span>}
          required
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Phone with Icon</h2>
        <Input
          label="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          validationPattern="phone"
          leftIcon={<span>📱</span>}
          helperText="Enter your phone number"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Message with Character Count</h2>
        <Input
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          showCharCount
          maxLength={100}
          helperText="Maximum 100 characters"
          rightIcon={<span>✍️</span>}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>URL Validation</h2>
        <Input
          label="Website URL"
          validationPattern="url"
          leftIcon={<span>🌐</span>}
          placeholder="https://example.com"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Custom Regex Validation</h2>
        <Input
          label="Username (alphanumeric only)"
          validationPattern={/^[a-zA-Z0-9]*$/}
          validationMessage="Username can only contain letters and numbers"
          leftIcon={<span>👤</span>}
          helperText="Only letters and numbers allowed"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Disabled with Icons</h2>
        <Input
          label="Disabled Input"
          value="Cannot edit this"
          disabled
          leftIcon={<span>🔒</span>}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>Error State</h2>
        <Input
          label="Input with Error"
          error="This field has an error"
          leftIcon={<span>⚠️</span>}
        />
      </div>
    </div>
  );
};

export default App;

