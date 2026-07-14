import React from 'react';

function makeEntry() {
  return {
    id: `work-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  };
}

export default function WorkHistoryForm({ workHistory, onChange }) {
  const update = (id, patch) => onChange(workHistory.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  const remove = (id) => onChange(workHistory.filter((w) => w.id !== id));
  const add = () => onChange([...workHistory, makeEntry()]);

  return (
    <div className="cp-panel cp-card">
      <h2 className="cp-panel-title">Work history</h2>
      <p className="cp-panel-desc">Your most recent role feeds directly into your AI-recommended jobs.</p>

      <div className="cp-entry-list">
        {workHistory.length === 0 && (
          <div className="cp-empty">
            <p className="cp-empty-title">No roles added yet</p>
            <p>Add your current or most recent position below.</p>
          </div>
        )}

        {workHistory.map((entry) => (
          <div className="cp-entry" key={entry.id}>
            <button
              type="button"
              className="cp-btn cp-btn-icon cp-entry-remove"
              onClick={() => remove(entry.id)}
              aria-label="Remove this role"
              title="Remove"
            >
              ×
            </button>

            <div className="cp-form-row">
              <div className="cp-field">
                <label htmlFor={`title-${entry.id}`}>Job title</label>
                <input
                  id={`title-${entry.id}`}
                  className="cp-input"
                  value={entry.title}
                  onChange={(e) => update(entry.id, { title: e.target.value })}
                  placeholder="Frontend Engineer"
                />
              </div>
              <div className="cp-field">
                <label htmlFor={`company-${entry.id}`}>Company</label>
                <input
                  id={`company-${entry.id}`}
                  className="cp-input"
                  value={entry.company}
                  onChange={(e) => update(entry.id, { company: e.target.value })}
                  placeholder="Northgale Systems"
                />
              </div>
            </div>

            <div className="cp-form-row">
              <div className="cp-field">
                <label htmlFor={`loc-${entry.id}`}>Location</label>
                <input
                  id={`loc-${entry.id}`}
                  className="cp-input"
                  value={entry.location}
                  onChange={(e) => update(entry.id, { location: e.target.value })}
                  placeholder="Colombo, Sri Lanka"
                />
              </div>
              <div className="cp-field">
                <label>Dates</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="month"
                    className="cp-input"
                    value={entry.startDate}
                    onChange={(e) => update(entry.id, { startDate: e.target.value })}
                    aria-label="Start date"
                  />
                  <input
                    type="month"
                    className="cp-input"
                    value={entry.current ? '' : entry.endDate}
                    onChange={(e) => update(entry.id, { endDate: e.target.value })}
                    disabled={entry.current}
                    aria-label="End date"
                  />
                </div>
              </div>
            </div>

            <label className="cp-entry-checkbox">
              <input
                type="checkbox"
                checked={entry.current}
                onChange={(e) => update(entry.id, { current: e.target.checked, endDate: '' })}
              />
              I currently work here
            </label>

            <div className="cp-field" style={{ marginTop: 'var(--cp-space-3)' }}>
              <label htmlFor={`desc-${entry.id}`}>What did you work on?</label>
              <textarea
                id={`desc-${entry.id}`}
                className="cp-textarea"
                rows={3}
                value={entry.description}
                onChange={(e) => update(entry.id, { description: e.target.value })}
                placeholder="Key responsibilities, projects, and impact."
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="cp-btn cp-btn-ghost" onClick={add}>
        + Add role
      </button>
    </div>
  );
}
