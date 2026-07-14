import React from 'react';
import TagInput from '../common/TagInput';
import { SKILL_SUGGESTIONS } from '../../../services/mockData/candidateMockData';

export default function SkillsForm({ skills, onChange }) {
  return (
    <div className="cp-panel cp-card">
      <h2 className="cp-panel-title">Skills</h2>
      <p className="cp-panel-desc">
        Add at least 3 skills — these drive your match score on the Recommended Jobs feed and can be used as
        search filters.
      </p>
      <TagInput value={skills} onChange={onChange} suggestions={SKILL_SUGGESTIONS} placeholder="e.g. React, SQL, Figma…" />
    </div>
  );
}
