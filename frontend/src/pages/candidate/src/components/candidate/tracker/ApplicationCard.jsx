import React from 'react';
import { formatDate } from '../common/stageMeta';

export default function ApplicationCard({ application, job, onSelect }) {
  return (
    <div
      className="cp-app-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(application)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(application)}
    >
      <p className="cp-app-card-title">{job?.title ?? 'Job no longer listed'}</p>
      <p className="cp-app-card-company">{job?.company ?? '—'}</p>
      <span className="cp-app-card-date">Since {formatDate(application.appliedAt)}</span>
    </div>
  );
}
