import React from 'react';
import TagInput from '../common/TagInput';
import { ROLE_OPTIONS, SKILL_SUGGESTIONS } from '../../../services/mockData/candidateMockData';

export default function JobFilters({ filters, onChange, onReset }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="cp-card cp-filters">
      <h2 className="cp-filters-title">Filters</h2>

      <div className="cp-filter-group">
        <label className="cp-filter-group-label" htmlFor="filter-query">
          Keyword
        </label>
        <input
          id="filter-query"
          className="cp-input"
          value={filters.query}
          onChange={(e) => set({ query: e.target.value })}
          placeholder="Title or company"
        />
      </div>

      <div className="cp-filter-group">
        <label className="cp-filter-group-label" htmlFor="filter-location">
          Location
        </label>
        <input
          id="filter-location"
          className="cp-input"
          value={filters.location}
          onChange={(e) => set({ location: e.target.value })}
          placeholder="City or 'Remote'"
        />
      </div>

      <div className="cp-filter-group">
        <label className="cp-filter-group-label" htmlFor="filter-role">
          Role
        </label>
        <select id="filter-role" className="cp-select" value={filters.role} onChange={(e) => set({ role: e.target.value })}>
          <option value="">Any role</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="cp-filter-group">
        <label className="cp-filter-group-label" htmlFor="filter-salary">
          Minimum salary ({filters.salaryMin.toLocaleString()} LKR)
        </label>
        <input
          id="filter-salary"
          type="range"
          min="0"
          max="300000"
          step="10000"
          value={filters.salaryMin}
          onChange={(e) => set({ salaryMin: Number(e.target.value) })}
          style={{ width: '100%' }}
        />
      </div>

      <div className="cp-filter-group">
        <span className="cp-filter-group-label">Skills</span>
        <TagInput value={filters.skills} onChange={(skills) => set({ skills })} suggestions={SKILL_SUGGESTIONS} placeholder="Filter by skill…" />
      </div>

      <div className="cp-filter-group">
        <label className="cp-filter-checkbox-row">
          <input
            type="checkbox"
            checked={filters.remoteOnly}
            onChange={(e) => set({ remoteOnly: e.target.checked })}
          />
          Remote only
        </label>
      </div>

      <button type="button" className="cp-btn cp-btn-ghost cp-btn-sm" onClick={onReset}>
        Clear filters
      </button>
    </div>
  );
}
