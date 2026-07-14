import React from 'react';
import { STAGE_META, formatDate } from '../common/stageMeta';

export default function ApplicationDetailDrawer({ application, job, onClose, onWithdraw }) {
  if (!application) return null;

  return (
    <div className="cp-drawer-backdrop" onClick={onClose}>
      <div className="cp-drawer" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="cp-drawer-head">
          <div>
            <h2 className="cp-drawer-title">{job?.title ?? 'Job no longer listed'}</h2>
            <p className="cp-drawer-company">{job?.company}</p>
          </div>
          <button type="button" className="cp-btn cp-btn-icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <span className={`cp-badge ${STAGE_META[application.stage]?.badgeClass ?? 'cp-badge-neutral'}`}>
          {STAGE_META[application.stage]?.label ?? application.stage}
        </span>

        {job && (
          <p className="cp-panel-desc" style={{ margin: 'var(--cp-space-4) 0' }}>
            {job.location} {job.remote ? '· Remote' : ''} · {job.role}
          </p>
        )}

        <h3 style={{ fontFamily: 'var(--cp-font-display)', fontSize: 'var(--cp-size-md)' }}>Timeline</h3>
        <ul className="cp-timeline">
          {application.history.map((step) => (
            <li key={step.stage}>
              <div>
                <div className="cp-timeline-stage">{STAGE_META[step.stage]?.label ?? step.stage}</div>
                <div className="cp-timeline-date">{formatDate(step.at)}</div>
              </div>
            </li>
          ))}
        </ul>

        {application.notes && (
          <>
            <h3 style={{ fontFamily: 'var(--cp-font-display)', fontSize: 'var(--cp-size-md)' }}>Notes</h3>
            <p className="cp-panel-desc">{application.notes}</p>
          </>
        )}

        {application.stage !== 'offer' && (
          <button
            type="button"
            className="cp-btn cp-btn-danger-ghost cp-btn-sm"
            onClick={() => onWithdraw(application.id)}
            style={{ marginTop: 'var(--cp-space-4)' }}
          >
            Withdraw application
          </button>
        )}
      </div>
    </div>
  );
}
