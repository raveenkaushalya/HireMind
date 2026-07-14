import React from 'react';
import { formatDateTime } from '../common/stageMeta';

const STATUS_META = {
  pending_confirmation: { label: 'Needs your response', badgeClass: 'cp-badge-flag' },
  confirmed: { label: 'Confirmed', badgeClass: 'cp-badge-signal' },
  reschedule_requested: { label: 'Reschedule requested', badgeClass: 'cp-badge-aura' },
};

export default function InterviewCard({ interview, job, onRespondClick }) {
  const date = new Date(interview.scheduledAt);
  const month = date.toLocaleDateString(undefined, { month: 'short' });
  const day = date.getDate();
  const status = STATUS_META[interview.status] ?? STATUS_META.pending_confirmation;

  return (
    <div className="cp-card cp-interview-card">
      <div className="cp-interview-date-block">
        <div className="cp-interview-date-month">{month}</div>
        <div className="cp-interview-date-day">{day}</div>
      </div>

      <div>
        <p className="cp-interview-type">
          {interview.type}
          {job ? ` — ${job.title} at ${job.company}` : ''}
        </p>
        <div className="cp-interview-meta">
          <span>{formatDateTime(interview.scheduledAt)}</span>
          <span aria-hidden="true">·</span>
          <span>{interview.durationMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span>{interview.mode}</span>
        </div>
        <p className="cp-interview-people">With {interview.withPeople.join(', ')}</p>
        <p className="cp-interview-people">{interview.location}</p>
      </div>

      <div className="cp-interview-actions">
        <span className={`cp-badge ${status.badgeClass}`}>{status.label}</span>
        {interview.status === 'pending_confirmation' && (
          <button type="button" className="cp-btn cp-btn-signal cp-btn-sm" onClick={() => onRespondClick(interview)}>
            Respond
          </button>
        )}
      </div>
    </div>
  );
}
