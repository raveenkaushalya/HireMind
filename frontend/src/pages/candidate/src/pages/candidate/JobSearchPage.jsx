import React, { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/candidate/common/PageHeader';
import JobFilters from '../../components/candidate/jobs/JobFilters';
import JobList from '../../components/candidate/jobs/JobList';
import { searchJobs, applyToJob } from '../../services/candidateApi';
import { useCandidate } from '../../context/CandidateContext';

const DEFAULT_FILTERS = {
  query: '',
  location: '',
  role: '',
  skills: [],
  salaryMin: 0,
  remoteOnly: false,
};

export default function JobSearchPage() {
  const { applications, reloadApplications } = useCandidate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      searchJobs(filters).then((results) => {
        setJobs(results);
        setLoading(false);
      });
    }, 200); // small debounce so typing doesn't refire on every keystroke
    return () => clearTimeout(handle);
  }, [filters]);

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
        title="Job search"
        subtitle="Filter by location, salary, role, and skills to find your next opportunity."
      />

      <div className="cp-job-layout">
        <JobFilters filters={filters} onChange={setFilters} onReset={() => setFilters(DEFAULT_FILTERS)} />

        <div>
          <div className="cp-results-meta">
            <span>{loading ? 'Searching…' : `${jobs.length} job${jobs.length === 1 ? '' : 's'} found`}</span>
          </div>
          <JobList jobs={jobs} appliedJobIds={appliedJobIds} onApply={handleApply} loading={loading} />
        </div>
      </div>

      {toast && (
        <div className="cp-toast" role="status">
          <span className="cp-toast-dot" aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
