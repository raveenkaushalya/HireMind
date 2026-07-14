import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import AboutPage from '../pages/about/AboutPage';
import LoginPage from '../pages/auth/LoginPage';
import RecruiterDashboard from '../pages/recruiter/RecruiterDashboard';
import HiringManagerDashboard from '../pages/hiring-manager/HiringManagerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import candidateRoutes from './CandidateRoutes';

// NOTE (Candidate Portal section): this file previously just rendered a
// placeholder div. It's wired up here with react-router-dom so the Candidate
// Portal (mounted at /candidate/*, see CandidateRoutes.jsx) is reachable and
// runnable end to end. The routes below for home/about/auth/recruiter/admin/
// hiring-manager are minimal pass-throughs to each team member's existing
// page stub — swap them out for your own nested routing as your section
// grows, this isn't meant to lock in anyone else's structure.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recruiter/*" element={<RecruiterDashboard />} />
      <Route path="/hiring-manager/*" element={<HiringManagerDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      {candidateRoutes}
    </Routes>
  );
}
