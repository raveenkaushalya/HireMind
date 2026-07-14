import React from 'react';
import { formatDateTime } from '../common/stageMeta';

export default function ConfirmationModal({ interview, onRespond, onClose }) {
  if (!interview) return null;

  return (
    <div className="cp-modal-backdrop" onClick={onClose}>
      <div className="cp-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2 className="cp-modal-title">Confirm your interview</h2>
        <p className="cp-panel-desc" style={{ margin: 0 }}>
          {interview.type} · {formatDateTime(interview.scheduledAt)}
        </p>
        <p className="cp-panel-desc">
          {interview.mode} with {interview.withPeople.join(', ')}.
        </p>

        <div className="cp-modal-actions">
          <button type="button" className="cp-btn cp-btn-ghost" onClick={() => onRespond(interview.id, 'reschedule')}>
            Request a reschedule
          </button>
          <button type="button" className="cp-btn cp-btn-signal" onClick={() => onRespond(interview.id, 'accept')}>
            Confirm time
          </button>
        </div>
      </div>
    </div>
  );
}
