import React from 'react';
import { Route } from 'react-router-dom';
import CandidateLayout from '../components/candidate/layout/CandidateLayout';
import CandidateDashboard from '../pages/candidate/CandidateDashboard';
import ProfileBuilderPage from '../pages/candidate/ProfileBuilderPage';
import JobSearchPage from '../pages/candidate/JobSearchPage';
import RecommendedJobsPage from '../pages/candidate/RecommendedJobsPage';
import ApplicationTrackerPage from '../pages/candidate/ApplicationTrackerPage';
import InterviewSchedulePage from '../pages/candidate/InterviewSchedulePage';

/**
 * Candidate Portal routes, as a set of <Route> elements meant to be spread
 * inside AppRoutes.jsx's <Routes>, e.g.:
 *
 *   <Routes>
 *     <Route path="/" element={<HomePage />} />
 *     ...
 *     {candidateRoutes}
 *   </Routes>
 *
 * Kept as its own module so the Candidate Portal's routing can be reviewed,
 * tested, and merged independently of the other portals (recruiter, admin,
 * hiring-manager) that live alongside it in AppRoutes.jsx.
 */
const candidateRoutes = (
  <Route path="/candidate" element={<CandidateLayout />}>
    <Route index element={<CandidateDashboard />} />
    <Route path="profile" element={<ProfileBuilderPage />} />
    <Route path="jobs" element={<JobSearchPage />} />
    <Route path="recommended" element={<RecommendedJobsPage />} />
    <Route path="applications" element={<ApplicationTrackerPage />} />
    <Route path="interviews" element={<InterviewSchedulePage />} />
  </Route>
);

export default candidateRoutes;
