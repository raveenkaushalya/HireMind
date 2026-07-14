import React, { useState } from 'react';

const FIELD_LABELS = {
  fullName: 'Full name',
  email: 'Email address',
  phone: 'Phone number',
  location: 'Location',
  headline: 'Professional headline',
};

export default function PersonalInfoForm({ personal, onChange }) {
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    if (field === 'fullName' && !value.trim()) return 'Full name is required.';
    if (field === 'email') {
      if (!value.trim()) return 'Email is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
    }
    if (field === 'phone' && value && !/^[+\d][\d\s-()]{6,}$/.test(value)) {
      return 'Enter a valid phone number.';
    }
    return null;
  };

  const handleBlur = (field) => (e) => {
    const err = validateField(field, e.target.value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (field) => (e) => {
    onChange({ [field]: e.target.value });
  };

  return (
    <div className="cp-panel cp-card">
      <h2 className="cp-panel-title">Personal information</h2>
      <p className="cp-panel-desc">This appears at the top of your profile and is shared with recruiters when you apply.</p>

      <div className="cp-form-row">
        <div className="cp-field">
          <label htmlFor="cp-fullName">{FIELD_LABELS.fullName}</label>
          <input
            id="cp-fullName"
            className={`cp-input${errors.fullName ? ' has-error' : ''}`}
            value={personal.fullName}
            onChange={handleChange('fullName')}
            onBlur={handleBlur('fullName')}
            placeholder="e.g. Nadeesha Jayasuriya"
          />
          {errors.fullName && <span className="cp-error-text">{errors.fullName}</span>}
        </div>

        <div className="cp-field">
          <label htmlFor="cp-email">{FIELD_LABELS.email}</label>
          <input
            id="cp-email"
            type="email"
            className={`cp-input${errors.email ? ' has-error' : ''}`}
            value={personal.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="you@example.com"
          />
          {errors.email && <span className="cp-error-text">{errors.email}</span>}
        </div>
      </div>

      <div className="cp-form-row">
        <div className="cp-field">
          <label htmlFor="cp-phone">{FIELD_LABELS.phone}</label>
          <input
            id="cp-phone"
            className={`cp-input${errors.phone ? ' has-error' : ''}`}
            value={personal.phone}
            onChange={handleChange('phone')}
            onBlur={handleBlur('phone')}
            placeholder="+94 71 234 5678"
          />
          {errors.phone && <span className="cp-error-text">{errors.phone}</span>}
        </div>

        <div className="cp-field">
          <label htmlFor="cp-location">{FIELD_LABELS.location}</label>
          <input
            id="cp-location"
            className="cp-input"
            value={personal.location}
            onChange={handleChange('location')}
            placeholder="Colombo, Sri Lanka"
          />
        </div>
      </div>

      <div className="cp-field">
        <label htmlFor="cp-headline">{FIELD_LABELS.headline}</label>
        <input
          id="cp-headline"
          className="cp-input"
          value={personal.headline}
          onChange={handleChange('headline')}
          placeholder="e.g. Frontend Engineer specialising in design systems"
        />
        <span className="cp-hint">Shown right under your name on job applications.</span>
      </div>

      <div className="cp-field">
        <label htmlFor="cp-summary">Summary</label>
        <textarea
          id="cp-summary"
          className="cp-textarea"
          value={personal.summary}
          onChange={handleChange('summary')}
          placeholder="A few sentences on what you do and what you're looking for next."
          rows={4}
        />
      </div>
    </div>
  );
}
