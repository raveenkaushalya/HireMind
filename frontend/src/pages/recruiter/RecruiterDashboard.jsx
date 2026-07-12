import { useMemo, useState } from 'react';

const initialJobs = [
  { id: 1, title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Colombo', applicants: 42, stage: 'Interviewing' },
  { id: 2, title: 'Product Designer', department: 'Design', location: 'Remote', applicants: 28, stage: 'Screening' },
  { id: 3, title: 'Data Analyst', department: 'Analytics', location: 'Kandy', applicants: 19, stage: 'Shortlist' },
];

const initialCandidates = [
  { id: 1, name: 'Nethmi Perera', role: 'Frontend', score: '94%', stage: 'Interviewing' },
  { id: 2, name: 'Kasun Silva', role: 'Product Design', score: '91%', stage: 'Screening' },
  { id: 3, name: 'Dulani Jayasuriya', role: 'Data', score: '89%', stage: 'Shortlist' },
];

const initialMeetings = [
  { id: 1, time: '09:30', title: 'Panel Interview - Nethmi', type: 'Technical' },
  { id: 2, time: '11:00', title: 'Hiring Sync - Design Team', type: 'Team' },
  { id: 3, time: '14:00', title: 'Candidate Review - Data Roles', type: 'Review' },
];

const stageOptions = ['Screening', 'Shortlist', 'Interviewing', 'Offer', 'Hired'];

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [jobs, setJobs] = useState(initialJobs);
  const [candidates, setCandidates] = useState(initialCandidates);
  const [meetings, setMeetings] = useState(initialMeetings);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [jobForm, setJobForm] = useState({ title: '', department: '', location: '' });
  const [interviewForm, setInterviewForm] = useState({ time: '', title: '', type: '' });

  const stats = useMemo(() => [
    { label: 'Active Jobs', value: jobs.length, detail: '+3 this week' },
    { label: 'Applicants', value: jobs.reduce((sum, job) => sum + job.applicants, 0), detail: '86 shortlisted' },
    { label: 'Interviews', value: meetings.length, detail: '4 today' },
    { label: 'Offer Rate', value: '31%', detail: '+6% this month' },
  ], [jobs, meetings]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch = `${candidate.name} ${candidate.role}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = stageFilter === 'All' || candidate.stage === stageFilter;
      return matchesSearch && matchesStage;
    });
  }, [candidates, searchTerm, stageFilter]);

  const handleCreateJob = (event) => {
    event.preventDefault();
    if (!jobForm.title || !jobForm.department || !jobForm.location) return;

    setJobs((currentJobs) => [
      {
        id: Date.now(),
        title: jobForm.title,
        department: jobForm.department,
        location: jobForm.location,
        applicants: 0,
        stage: 'Screening',
      },
      ...currentJobs,
    ]);
    setJobForm({ title: '', department: '', location: '' });
    setActiveTab('jobs');
  };

  const handleScheduleInterview = (event) => {
    event.preventDefault();
    if (!interviewForm.time || !interviewForm.title || !interviewForm.type) return;

    setMeetings((currentMeetings) => [
      { id: Date.now(), time: interviewForm.time, title: interviewForm.title, type: interviewForm.type },
      ...currentMeetings,
    ]);
    setInterviewForm({ time: '', title: '', type: '' });
    setActiveTab('interviews');
  };

  const handleAdvanceStage = (candidateId) => {
    setCandidates((currentCandidates) =>
      currentCandidates.map((candidate) => {
        if (candidate.id !== candidateId) return candidate;
        const currentIndex = stageOptions.indexOf(candidate.stage);
        const nextStage = stageOptions[Math.min(currentIndex + 1, stageOptions.length - 1)];
        return { ...candidate, stage: nextStage };
      })
    );
  };

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <div>
          <p className="eyebrow">Recruiter Portal</p>
          <h1>Welcome back, Maya</h1>
          <p>Track hiring progress, review candidates, and keep your pipeline moving.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn" onClick={() => setActiveTab('jobs')}>Create Job</button>
          <button className="primary-btn" onClick={() => setActiveTab('interviews')}>Schedule Interview</button>
        </div>
      </header>

      <nav className="tab-nav" aria-label="Recruiter workspace sections">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'jobs', label: 'Jobs' },
          { key: 'candidates', label: 'Candidates' },
          { key: 'interviews', label: 'Interviews' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="stats-grid">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <p>{item.label}</p>
            <h2>{item.value}</h2>
            <span>{item.detail}</span>
          </article>
        ))}
      </section>

      {activeTab === 'overview' && (
        <>
          <section className="content-grid">
            <div className="panel large-panel">
              <div className="panel-heading">
                <h3>Open positions</h3>
                <a href="#" onClick={() => setActiveTab('jobs')}>View all</a>
              </div>
              <ul className="job-list">
                {jobs.map((job) => (
                  <li key={job.id}>
                    <div>
                      <strong>{job.title}</strong>
                      <p>{job.department} • {job.location}</p>
                    </div>
                    <div className="job-meta">
                      <span>{job.applicants} applicants</span>
                      <span className="pill">{job.stage}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="panel">
              <div className="panel-heading">
                <h3>AI hiring insights</h3>
                <span className="pill">Live</span>
              </div>
              <ul className="insight-list">
                <li>High-fit candidates are concentrated in the last 7 days.</li>
                <li>Frontend roles are receiving the fastest response times.</li>
                <li>Interview feedback is 18% more positive this month.</li>
              </ul>
            </aside>
          </section>

          <section className="content-grid lower-grid">
            <div className="panel">
              <div className="panel-heading">
                <h3>Candidate pipeline</h3>
                <a href="#" onClick={() => setActiveTab('candidates')}>Manage</a>
              </div>
              <div className="candidate-list">
                {candidates.map((candidate) => (
                  <div className="candidate-item" key={candidate.id}>
                    <div>
                      <strong>{candidate.name}</strong>
                      <p>{candidate.role}</p>
                    </div>
                    <div className="job-meta">
                      <span>{candidate.score}</span>
                      <span className="pill">{candidate.stage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <h3>Upcoming interviews</h3>
                <a href="#" onClick={() => setActiveTab('interviews')}>Calendar</a>
              </div>
              <div className="meeting-list">
                {meetings.map((meeting) => (
                  <div className="meeting-item" key={meeting.id}>
                    <div>
                      <strong>{meeting.time}</strong>
                      <p>{meeting.title}</p>
                    </div>
                    <span className="pill">{meeting.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'jobs' && (
        <section className="content-grid lower-grid">
          <div className="panel">
            <div className="panel-heading">
              <h3>Job postings</h3>
              <span className="pill">{jobs.length} active</span>
            </div>
            <ul className="job-list">
              {jobs.map((job) => (
                <li key={job.id}>
                  <div>
                    <strong>{job.title}</strong>
                    <p>{job.department} • {job.location}</p>
                  </div>
                  <div className="job-meta">
                    <span>{job.applicants} applicants</span>
                    <span className="pill">{job.stage}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <h3>Create a new job</h3>
            </div>
            <form className="portal-form" onSubmit={handleCreateJob}>
              <label>
                Job title
                <input value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} placeholder="e.g. Software Engineer" />
              </label>
              <label>
                Department
                <input value={jobForm.department} onChange={(event) => setJobForm({ ...jobForm, department: event.target.value })} placeholder="Engineering" />
              </label>
              <label>
                Location
                <input value={jobForm.location} onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })} placeholder="Colombo" />
              </label>
              <button className="primary-btn" type="submit">Publish Job</button>
            </form>
          </div>
        </section>
      )}

      {activeTab === 'candidates' && (
        <section className="content-grid lower-grid">
          <div className="panel">
            <div className="panel-heading">
              <h3>Candidate pipeline</h3>
              <div className="filter-row">
                <input
                  className="search-input"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search candidates"
                />
                <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
                  <option value="All">All stages</option>
                  {stageOptions.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="candidate-list">
              {filteredCandidates.map((candidate) => (
                <div className="candidate-item" key={candidate.id}>
                  <div>
                    <strong>{candidate.name}</strong>
                    <p>{candidate.role}</p>
                  </div>
                  <div className="job-meta">
                    <span>{candidate.score}</span>
                    <span className="pill">{candidate.stage}</span>
                    <button className="secondary-btn small-btn" onClick={() => handleAdvanceStage(candidate.id)}>Advance</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <h3>Candidate notes</h3>
            </div>
            <div className="insight-list">
              <li>Focus on communication skills for the design shortlist.</li>
              <li>Frontend candidates are showing strong AI tool familiarity.</li>
              <li>Interview feedback from the analytics round is highly positive.</li>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'interviews' && (
        <section className="content-grid lower-grid">
          <div className="panel">
            <div className="panel-heading">
              <h3>Upcoming interviews</h3>
              <span className="pill">{meetings.length} scheduled</span>
            </div>
            <div className="meeting-list">
              {meetings.map((meeting) => (
                <div className="meeting-item" key={meeting.id}>
                  <div>
                    <strong>{meeting.time}</strong>
                    <p>{meeting.title}</p>
                  </div>
                  <span className="pill">{meeting.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <h3>Schedule new interview</h3>
            </div>
            <form className="portal-form" onSubmit={handleScheduleInterview}>
              <label>
                Time
                <input value={interviewForm.time} onChange={(event) => setInterviewForm({ ...interviewForm, time: event.target.value })} placeholder="09:30" />
              </label>
              <label>
                Interview title
                <input value={interviewForm.title} onChange={(event) => setInterviewForm({ ...interviewForm, title: event.target.value })} placeholder="Panel Interview" />
              </label>
              <label>
                Type
                <input value={interviewForm.type} onChange={(event) => setInterviewForm({ ...interviewForm, type: event.target.value })} placeholder="Technical" />
              </label>
              <button className="primary-btn" type="submit">Add to Calendar</button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
