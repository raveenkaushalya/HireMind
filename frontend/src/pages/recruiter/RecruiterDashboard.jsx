import React from 'react';

const stats = [
  { label: 'Active jobs', value: '12', detail: '4 closing this week' },
  { label: 'New applicants', value: '48', detail: '12 need review' },
  { label: 'Interviews', value: '9', detail: '3 scheduled today' },
  { label: 'Shortlisted', value: '21', detail: 'High fit candidates' }
];

const pipeline = [
  { title: 'New applications', count: '24', tone: 'blue' },
  { title: 'Screening', count: '11', tone: 'purple' },
  { title: 'Interview stage', count: '8', tone: 'green' },
  { title: 'Offer stage', count: '3', tone: 'orange' }
];

const applicants = [
  { name: 'Nimali Perera', role: 'Senior Frontend Engineer', stage: 'Screening', score: '92%' },
  { name: 'Harith Fernando', role: 'Product Designer', stage: 'Interview', score: '88%' },
  { name: 'Kasun Silva', role: 'Data Analyst', stage: 'Shortlisted', score: '95%' }
];

const jobs = [
  { title: 'Senior Frontend Developer', location: 'Colombo', applicants: '18', status: 'Open' },
  { title: 'HR Operations Associate', location: 'Remote', applicants: '9', status: 'Review' },
  { title: 'Data Analyst', location: 'Kandy', applicants: '12', status: 'Open' }
];

export default function RecruiterDashboard() {
  return (
    <div className="recruiter-page">
      <header className="recruiter-header">
        <div>
          <p className="eyebrow">Recruiter portal</p>
          <h1>Welcome back, Recruiter</h1>
          <p className="subtitle">Track hiring progress, review applicants, and manage interviews from one place.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">Export report</button>
          <button className="btn btn-primary">Post a new job</button>
        </div>
      </header>

      <section className="hero-card">
        <div>
          <p className="eyebrow">This week</p>
          <h2>Hiring momentum is strong</h2>
          <p>16 candidates moved to the next stage and 5 interviews are scheduled for tomorrow.</p>
        </div>
        <div className="hero-badge">AI-assisted shortlist ready</div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <p>{stat.label}</p>
            <h3>{stat.value}</h3>
            <span>{stat.detail}</span>
          </article>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Hiring pipeline</h3>
            <a href="#">View all</a>
          </div>
          <div className="pipeline-list">
            {pipeline.map((item) => (
              <div className={`pipeline-item ${item.tone}`} key={item.title}>
                <div>
                  <p>{item.title}</p>
                  <strong>{item.count}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Recent activity</h3>
            <a href="#">Refresh</a>
          </div>
          <ul className="activity-list">
            <li><strong>Interview scheduled</strong><span>Senior Frontend Developer · 10:30 AM</span></li>
            <li><strong>Candidate shortlisted</strong><span>Kasun Silva moved to the offer stage</span></li>
            <li><strong>New application received</strong><span>2 fresh applications for HR Operations</span></li>
          </ul>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Top applicants</h3>
          <a href="#">See full shortlist</a>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Role</th>
              <th>Stage</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant.name}>
                <td>{applicant.name}</td>
                <td>{applicant.role}</td>
                <td>{applicant.stage}</td>
                <td>{applicant.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Open requisitions</h3>
          <a href="#">Manage jobs</a>
        </div>
        <div className="jobs-list">
          {jobs.map((job) => (
            <article className="job-card" key={job.title}>
              <div>
                <h4>{job.title}</h4>
                <p>{job.location}</p>
              </div>
              <div className="job-meta">
                <span>{job.applicants} applicants</span>
                <strong>{job.status}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
