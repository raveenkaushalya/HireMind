import React from 'react';

function makeEntry() {
  return {
    id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    school: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    current: false,
  };
}

export default function EducationForm({ education, onChange }) {
  const update = (id, patch) => onChange(education.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id) => onChange(education.filter((e) => e.id !== id));
  const add = () => onChange([...education, makeEntry()]);

  return (
    <div className="cp-panel cp-card">
      <h2 className="cp-panel-title">Education</h2>
      <p className="cp-panel-desc">Add your most recent qualifications first.</p>

      <div className="cp-entry-list">
        {education.length === 0 && (
          <div className="cp-empty">
            <p className="cp-empty-title">No education added yet</p>
            <p>Add a school below to get started.</p>
          </div>
        )}

        {education.map((entry) => (
          <div className="cp-entry" key={entry.id}>
            <button
              type="button"
              className="cp-btn cp-btn-icon cp-entry-remove"
              onClick={() => remove(entry.id)}
              aria-label="Remove this education entry"
              title="Remove"
            >
              ×
            </button>

            <div className="cp-form-row">
              <div className="cp-field">
                <label htmlFor={`school-${entry.id}`}>School / University</label>
                <input
                  id={`school-${entry.id}`}
                  className="cp-input"
                  value={entry.school}
                  onChange={(e) => update(entry.id, { school: e.target.value })}
                  placeholder="University of Colombo"
                />
              </div>
              <div className="cp-field">
                <label htmlFor={`degree-${entry.id}`}>Degree</label>
                <input
                  id={`degree-${entry.id}`}
                  className="cp-input"
                  value={entry.degree}
                  onChange={(e) => update(entry.id, { degree: e.target.value })}
                  placeholder="BSc (Hons) Computer Science"
                />
              </div>
            </div>

            <div className="cp-form-row">
              <div className="cp-field">
                <label htmlFor={`field-${entry.id}`}>Field of study</label>
                <input
                  id={`field-${entry.id}`}
                  className="cp-input"
                  value={entry.fieldOfStudy}
                  onChange={(e) => update(entry.id, { fieldOfStudy: e.target.value })}
                  placeholder="Software Engineering"
                />
              </div>
              <div className="cp-field">
                <label>Years</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="cp-input"
                    value={entry.startYear}
                    onChange={(e) => update(entry.id, { startYear: e.target.value })}
                    placeholder="2019"
                    inputMode="numeric"
                    aria-label="Start year"
                  />
                  <input
                    className="cp-input"
                    value={entry.current ? '' : entry.endYear}
                    onChange={(e) => update(entry.id, { endYear: e.target.value })}
                    placeholder={entry.current ? 'Present' : '2023'}
                    inputMode="numeric"
                    disabled={entry.current}
                    aria-label="End year"
                  />
                </div>
              </div>
            </div>

            <label className="cp-entry-checkbox">
              <input
                type="checkbox"
                checked={entry.current}
                onChange={(e) => update(entry.id, { current: e.target.checked, endYear: '' })}
              />
              I&apos;m currently studying here
            </label>
          </div>
        ))}
      </div>

      <button type="button" className="cp-btn cp-btn-ghost" onClick={add}>
        + Add education
      </button>
    </div>
  );
}
