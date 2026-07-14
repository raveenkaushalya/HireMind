import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/candidate/common/PageHeader';
import PipelineTrack from '../../components/candidate/tracker/PipelineTrack';
import { useCandidate } from '../../context/CandidateContext';

const QUICK_LINKS = [
  { to: '/candidate/profile', title: 'Build your profile', desc: 'Personal info, education, work history, skills.' },
  { to: '/candidate/jobs', title: 'Search jobs', desc: 'Filter by location, salary, role, and skill tags.' },
  { to: '/candidate/recommended', title: 'Recommended for you', desc: 'AI-scored matches based on your profile.' },
  { to: '/candidate/interviews', title: 'Interview schedule', desc: 'View and confirm upcoming interviews.' },
];

export default function CandidateDashboard() {
  const { profile, applications, interviews, completion, loading } = useCandidate();
  const firstName = profile.personal?.fullName?.split(' ')[0];

  const pendingInterviews = interviews.filter((iv) => iv.status === 'pending_confirmation').length;
  const offers = applications.filter((a) => a.stage === 'offer').length;

  return (
    <div>
      <PageHeader
        eyebrow="Candidate Portal"
        title={firstName ? `Welcome back, ${firstName}` : 'Welcome to HireMind'}
        subtitle="Here's where things stand across your job search."
      />

      <div className="cp-grid-3 cp-section">
        <div className="cp-card cp-stat-card">
          <p className="cp-stat-value">{completion}%</p>
          <p className="cp-stat-label">Profile complete</p>
        </div>
        <div className="cp-card cp-stat-card">
          <p className="cp-stat-value">{applications.length}</p>
          <p className="cp-stat-label">Active applications</p>
        </div>
        <div className="cp-card cp-stat-card">
          <p className="cp-stat-value">{offers}</p>
          <p className="cp-stat-label">Offers on the table</p>
        </div>
      </div>

      {!loading && applications.length > 0 && (
        <div className="cp-section">
          <h2 className="cp-dashboard-section-title">Your pipeline</h2>
          <div className="cp-card" style={{ padding: 'var(--cp-space-5)' }}>
            <PipelineTrack applications={applications} />
            <Link to="/candidate/applications" className="cp-btn cp-btn-ghost cp-btn-sm">
              Open full tracker
            </Link>
          </div>
        </div>
      )}

      {pendingInterviews > 0 && (
        <div
          className="cp-recommend-banner cp-section"
          style={{ background: 'var(--cp-flag-100)', borderColor: 'var(--cp-flag-500)', color: 'var(--cp-flag-700)' }}
        >
          <strong>{pendingInterviews}</strong>
          <span>
            interview{pendingInterviews > 1 ? 's' : ''} waiting on your confirmation —{' '}
            <Link to="/candidate/interviews" style={{ color: 'inherit', fontWeight: 600 }}>
              respond now
            </Link>
            .
          </span>
        </div>
      )}

      <div className="cp-section">
        <h2 className="cp-dashboard-section-title">Jump back in</h2>
        <div className="cp-quick-links">
          {QUICK_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="cp-card cp-quick-link">
              <p className="cp-quick-link-title">{link.title}</p>
              <p className="cp-quick-link-desc">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
