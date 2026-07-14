import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/candidate/common/PageHeader';
import PipelineTrack from '../../components/candidate/tracker/PipelineTrack';
import ApplicationCard from '../../components/candidate/tracker/ApplicationCard';
import ApplicationDetailDrawer from '../../components/candidate/tracker/ApplicationDetailDrawer';
import { PIPELINE_STAGES, STAGE_META } from '../../components/candidate/common/stageMeta';
import { fetchJobById, withdrawApplication } from '../../services/candidateApi';
import { useCandidate } from '../../context/CandidateContext';

export default function ApplicationTrackerPage() {
  const { applications, reloadApplications, loading } = useCandidate();
  const [jobsById, setJobsById] = useState({});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Promise.all(applications.map((a) => fetchJobById(a.jobId))).then((jobs) => {
      const map = {};
      jobs.forEach((job, i) => {
        if (job) map[applications[i].jobId] = job;
      });
      setJobsById(map);
    });
  }, [applications]);

  const handleWithdraw = async (applicationId) => {
    await withdrawApplication(applicationId);
    reloadApplications();
    setSelected(null);
  };

  if (loading) {
    return <p className="cp-page-sub">Loading your applications…</p>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Candidate Portal"
        title="Application tracker"
        subtitle="Every application moves left to right through the same four stages — click a card for its full history."
      />

      {applications.length === 0 ? (
        <div className="cp-card cp-empty">
          <p className="cp-empty-title">No applications yet</p>
          <p>Apply to a role from Job Search or Recommended Jobs to see it show up here.</p>
        </div>
      ) : (
        <>
          <PipelineTrack applications={applications} />

          <div className="cp-board">
            {PIPELINE_STAGES.map((stage) => {
              const stageApps = applications.filter((a) => a.stage === stage);
              return (
                <div className="cp-board-col" key={stage}>
                  <div className="cp-board-col-head">
                    <span className="cp-board-col-title">{STAGE_META[stage].label}</span>
                    <span className={`cp-badge ${STAGE_META[stage].badgeClass}`}>{stageApps.length}</span>
                  </div>
                  {stageApps.length === 0 ? (
                    <p className="cp-board-empty">No applications</p>
                  ) : (
                    stageApps.map((app) => (
                      <ApplicationCard
                        key={app.id}
                        application={app}
                        job={jobsById[app.jobId]}
                        onSelect={setSelected}
                      />
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <ApplicationDetailDrawer
        application={selected}
        job={selected ? jobsById[selected.jobId] : null}
        onClose={() => setSelected(null)}
        onWithdraw={handleWithdraw}
      />
    </div>
  );
}
