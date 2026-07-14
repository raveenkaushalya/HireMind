import React from 'react';
import { formatDate, formatSalary } from '../common/stageMeta';

export default function JobCard({ job, applied, onApply, matchScore, matchedSkills = [] }) {
  return (
    <article className="cp-card cp-job-card">
      <div style={{ minWidth: 0 }}>
        <h3 className="cp-job-card-title">{job.title}</h3>
        <p className="cp-job-card-company">{job.company}</p>

        <div className="cp-job-card-meta">
          <span>{job.remote ? 'Remote' : job.location}</span>
          <span aria-hidden="true">·</span>
          <span>{job.role}</span>
          <span aria-hidden="true">·</span>
          <span>Posted {formatDate(job.postedAt)}</span>
        </div>

        <div className="cp-job-card-tags">
          {job.skills.map((skill) => (
            <span
              className={`cp-tag${matchedSkills.includes(skill) ? ' cp-matched-skill' : ''}`}
              key={skill}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="cp-job-card-side">
        {typeof matchScore === 'number' && (
          <div className="cp-match-score">
            <div
              className="cp-match-score-ring"
              style={{ '--pct': matchScore }}
              data-pct={matchScore}
              role="img"
              aria-label={`${matchScore} percent match`}
            />
            <span className="cp-match-score-label">AI match</span>
          </div>
        )}
        <div className="cp-job-card-salary">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</div>
        <button
          type="button"
          className={`cp-btn cp-btn-sm ${applied ? 'cp-btn-ghost' : 'cp-btn-signal'}`}
          disabled={applied}
          onClick={() => onApply?.(job.id)}
        >
          {applied ? 'Applied ✓' : 'Apply now'}
        </button>
      </div>
    </article>
  );
}
