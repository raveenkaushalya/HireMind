import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/candidate/common/PageHeader';
import InterviewCard from '../../components/candidate/interviews/InterviewCard';
import ConfirmationModal from '../../components/candidate/interviews/ConfirmationModal';
import { fetchJobById, confirmInterview } from '../../services/candidateApi';
import { useCandidate } from '../../context/CandidateContext';

export default function InterviewSchedulePage() {
  const { interviews, reloadInterviews, loading } = useCandidate();
  const [jobsById, setJobsById] = useState({});
  const [respondingTo, setRespondingTo] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    Promise.all(interviews.map((iv) => fetchJobById(iv.jobId))).then((jobs) => {
      const map = {};
      jobs.forEach((job, i) => {
        if (job) map[interviews[i].jobId] = job;
      });
      setJobsById(map);
    });
  }, [interviews]);

  const sorted = [...interviews].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

  const handleRespond = async (interviewId, response) => {
    await confirmInterview(interviewId, response);
    reloadInterviews();
    setRespondingTo(null);
    setToast(response === 'accept' ? 'Interview confirmed.' : 'Reschedule request sent.');
    setTimeout(() => setToast(null), 2600);
  };

  if (loading) {
    return <p className="cp-page-sub">Loading your interview schedule…</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Candidate Portal"
        title="Interview schedule"
        subtitle="Upcoming interviews across every active application, soonest first."
      />

      {sorted.length === 0 ? (
        <div className="cp-card cp-empty">
          <p className="cp-empty-title">No interviews scheduled</p>
          <p>Once an employer schedules one, it will show up here for you to confirm.</p>
        </div>
      ) : (
        <div className="cp-interview-list">
          {sorted.map((iv) => (
            <InterviewCard
              key={iv.id}
              interview={iv}
              job={jobsById[iv.jobId]}
              onRespondClick={setRespondingTo}
            />
          ))}
        </div>
      )}

      <ConfirmationModal
        interview={respondingTo}
        onRespond={handleRespond}
        onClose={() => setRespondingTo(null)}
      />

      {toast && (
        <div className="cp-toast" role="status">
          <span className="cp-toast-dot" aria-hidden="true" />
          {toast}
        </div>
      )}
    </div>
  );
}
