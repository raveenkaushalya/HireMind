import React, { useCallback, useEffect, useRef, useState } from 'react';
import { uploadResume, validateResumeFile } from '../../../services/candidateApi';

function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function ResumeUploadWidget({ resume, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | error
  const [error, setError] = useState(null);
  // Only valid for the current page session — see note in useCandidateProfile.js.
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    async (fileList) => {
      const file = fileList?.[0];
      if (!file) return;

      const validationError = validateResumeFile(file);
      if (validationError) {
        setError(validationError);
        setStatus('error');
        return;
      }

      setStatus('uploading');
      setError(null);
      try {
        const meta = await uploadResume(file);
        setPreviewUrl(meta.previewUrl);
        onChange(meta);
        setStatus('idle');
      } catch (err) {
        setError(err.message || 'Upload failed. Please try again.');
        setStatus('error');
      }
    },
    [onChange]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const openFileDialog = () => inputRef.current?.click();
  const resetInputValue = (e) => {
    e.target.value = null; // allows re-selecting the same filename after "Replace"
  };

  useEffect(() => {
    // Revoke the blob URL when it's replaced or the component unmounts, so we
    // don't leak memory across repeated uploads in the same session.
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const removeResume = () => {
    onChange(null);
    setPreviewUrl(null);
    setStatus('idle');
    setError(null);
  };

  return (
    <div className="cp-panel cp-card">
      <h2 className="cp-panel-title">Resume / CV</h2>
      <p className="cp-panel-desc">Upload a PDF, DOC, or DOCX (max 5MB). Recruiters see this file when you apply.</p>

      {!resume && (
        <div
          className={`cp-dropzone${isDragging ? ' is-dragging' : ''}`}
          role="button"
          tabIndex={0}
          onClick={openFileDialog}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
        >
          <div className="cp-dropzone-icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15V3m0 0L7 8m5-5 5 5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="cp-dropzone-title">
            {status === 'uploading' ? 'Uploading…' : 'Drag & drop your resume, or click to browse'}
          </p>
          <p className="cp-dropzone-hint">PDF, DOC, or DOCX — up to 5MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            hidden
            onClick={resetInputValue}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {status === 'error' && error && <p className="cp-error-text" style={{ marginTop: 'var(--cp-space-3)' }}>{error}</p>}

      {resume && (
        <div className="cp-resume-preview">
          <div className="cp-resume-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="cp-resume-info">
            <div className="cp-resume-name">{resume.name}</div>
            <div className="cp-resume-meta">
              {formatBytes(resume.sizeBytes)} · uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
            </div>
          </div>
          <div className="cp-resume-actions">
            {previewUrl && (
              <a className="cp-btn cp-btn-ghost cp-btn-sm" href={previewUrl} target="_blank" rel="noreferrer">
                Preview
              </a>
            )}
            <button type="button" className="cp-btn cp-btn-ghost cp-btn-sm" onClick={openFileDialog}>
              Replace
            </button>
            <button type="button" className="cp-btn cp-btn-danger-ghost cp-btn-sm" onClick={removeResume}>
              Remove
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            hidden
            onClick={resetInputValue}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {resume && !previewUrl && (
        <p className="cp-hint" style={{ marginTop: 'var(--cp-space-3)' }}>
          Preview isn&apos;t available after a page refresh — click Replace to re-upload and preview it again.
        </p>
      )}

      {previewUrl && resume?.type === 'application/pdf' && (
        <iframe
          title="Resume preview"
          src={previewUrl}
          style={{
            width: '100%',
            height: '480px',
            border: '1px solid var(--cp-border)',
            borderRadius: 'var(--cp-radius-sm)',
            marginTop: 'var(--cp-space-4)',
          }}
        />
      )}
    </div>
  );
}
