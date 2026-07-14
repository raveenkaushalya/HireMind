import React from 'react';

export default function ProfileCompletionMeter({ completion, initials, headline }) {
  return (
    <div className="cp-profile-summary cp-card">
      <div className="cp-profile-summary-avatar" aria-hidden="true">
        {initials}
      </div>
      <div className="cp-profile-summary-body">
        <div className="cp-profile-summary-top">
          <h2>Profile strength</h2>
          <span className="cp-profile-summary-pct">{completion}% complete</span>
        </div>
        <div className="cp-meter-track">
          <div className="cp-meter-fill" style={{ width: `${completion}%` }} />
        </div>
        <p className="cp-panel-desc" style={{ margin: 'var(--cp-space-2) 0 0' }}>
          {headline || 'Add a headline, skills, and a resume to unlock stronger job matches.'}
        </p>
      </div>
    </div>
  );
}
