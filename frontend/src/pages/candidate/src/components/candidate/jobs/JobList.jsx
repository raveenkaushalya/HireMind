import React from 'react';
import JobCard from './JobCard';

export default function JobList({ jobs, appliedJobIds, onApply, loading }) {
  if (loading) {
    return <p className="cp-page-sub">Searching jobs…</p>;
  }

  if (jobs.length === 0) {
    return (
      <div className="cp-card cp-empty">
        <p className="cp-empty-title">No jobs match those filters</p>
        <p>Try widening your location, lowering the minimum salary, or removing a skill.</p>
      </div>
    );
  }

  return (
    <div className="cp-job-list">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} applied={appliedJobIds.has(job.id)} onApply={onApply} />
      ))}
    </div>
  );
}
