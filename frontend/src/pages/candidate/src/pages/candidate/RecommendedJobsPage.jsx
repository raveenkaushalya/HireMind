import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/candidate/common/PageHeader';
import JobCard from '../../components/candidate/jobs/JobCard';
import { fetchRecommendedJobs, applyToJob } from '../../services/candidateApi';
import { useCandidate } from '../../context/CandidateContext';

export default function RecommendedJobsPage() {
  const { profile, applications, reloadApplications, completion } = useCandidate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchRecommendedJobs(profile).then((results) => {
      setJobs(results);
      setLoading(false);
    });
  }, [profile]);

  const appliedJobIds = useMemo(() => new Set(applications.map((a) => a.jobId)), [applications]);

  const handleApply = async (jobId) => {
    const result = await applyToJob(jobId);
    reloadApplications();
    setToast(result.alreadyApplied ? "You've already applied to this role." : 'Application submitted!');
    setTimeout(() => setToast(null), 2600);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Candidate Portal"
        title="Recommended for you"
        subtitle="Ranked by how closely each role's requirements overlap with your profile."
      />

      <div className="cp-recommend-banner">
        <strong>AI match</strong>
        <span>
          Scored from your skills and most recent role.
          {completion < 60 && (
            <>
              {' '}
              Your profile is only {completion}% complete —{' '}
              <Link to="/candidate/profile" style={{ color: 'inherit', fontWeight: 600 }}>
                finish it
              </Link>{' '}
              for sharper matches.
            </>
          )}
        </span>
      </div>

      {loading && <p className="cp-page-sub">Scoring jobs against your profile…</p>}

      {!loading && jobs.length === 0 && (
        <div className="cp-card cp-empty">
          <p className="cp-empty-title">No recommendations yet</p>
          <p>Add a few skills to your profile and check back here.</p>
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="cp-job-list">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              applied={appliedJobIds.has(job.id)}
              onApply={handleApply}
              matchScore={job.matchScore}
              matchedSkills={job.matchedSkills}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className="cp-toast" role="status">
          <span className="cp-toast-dot" aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
