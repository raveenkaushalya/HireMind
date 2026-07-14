import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCandidate } from '../../../context/CandidateContext';

const NAV_ITEMS = [
  { to: '/candidate', label: 'Dashboard', end: true },
  { to: '/candidate/profile', label: 'Profile' },
  { to: '/candidate/jobs', label: 'Job Search' },
  { to: '/candidate/recommended', label: 'Recommended for You' },
  { to: '/candidate/applications', label: 'Application Tracker' },
  { to: '/candidate/interviews', label: 'Interview Schedule' },
];

export default function CandidateSidebar() {
  const { profile } = useCandidate();
  const name = profile.personal?.fullName?.trim();
  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'YOU';

  return (
    <aside className="cp-sidebar" aria-label="Candidate portal navigation">
      <div className="cp-brand">
        <span className="cp-brand-mark">HireMind</span>
        <span className="cp-brand-tag">Candidate</span>
      </div>

      <nav className="cp-sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `cp-nav-link${isActive ? ' is-active' : ''}`}
          >
            <span className="cp-nav-dot" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="cp-sidebar-foot">
        <div className="cp-avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <div className="cp-sidebar-foot-name">{name || 'Complete your profile'}</div>
          <div className="cp-sidebar-foot-meta">{profile.personal?.headline || 'No headline yet'}</div>
        </div>
      </div>
    </aside>
  );
}
