import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useCandidateProfile from '../hooks/useCandidateProfile';
import { fetchApplications, fetchInterviews } from '../services/candidateApi';

const CandidateContext = createContext(null);

export function CandidateProvider({ children }) {
  const profileState = useCandidateProfile();
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const reloadApplications = useCallback(() => {
    fetchApplications().then(setApplications);
  }, []);

  const reloadInterviews = useCallback(() => {
    fetchInterviews().then(setInterviews);
  }, []);

  useEffect(() => {
    Promise.all([fetchApplications(), fetchInterviews()]).then(([apps, ivs]) => {
      setApplications(apps);
      setInterviews(ivs);
      setLoading(false);
    });
  }, []);

  const value = {
    ...profileState,
    applications,
    interviews,
    loading,
    reloadApplications,
    reloadInterviews,
  };

  return <CandidateContext.Provider value={value}>{children}</CandidateContext.Provider>;
}

export function useCandidate() {
  const ctx = useContext(CandidateContext);
  if (!ctx) {
    throw new Error('useCandidate must be used within a CandidateProvider');
  }
  return ctx;
}
