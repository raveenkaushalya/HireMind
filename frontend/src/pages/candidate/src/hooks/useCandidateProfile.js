import { useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import { DEFAULT_PROFILE } from '../services/mockData/candidateMockData';

const STORAGE_KEY = 'hiremind.candidate.profile';

/**
 * Owns the candidate's profile (personal info, education, work history,
 * skills, resume metadata) and persists it locally. Also exposes a
 * completion percentage used by the profile meter and the dashboard.
 */
export default function useCandidateProfile() {
  const [profile, setProfile] = useLocalStorage(STORAGE_KEY, DEFAULT_PROFILE);

  const updatePersonal = (patch) =>
    setProfile((prev) => ({ ...prev, personal: { ...prev.personal, ...patch } }));

  const setEducation = (education) => setProfile((prev) => ({ ...prev, education }));
  const setWorkHistory = (workHistory) => setProfile((prev) => ({ ...prev, workHistory }));
  const setSkills = (skills) => setProfile((prev) => ({ ...prev, skills }));

  // `resume.previewUrl` is a blob: URL (from URL.createObjectURL) — it only
  // stays valid for the current page session. Persisting it to localStorage
  // would leave a dead link after any reload, so only the durable metadata
  // (name/size/type/uploadedAt) is stored here. ResumeUploadWidget keeps the
  // live previewUrl in its own component state for the current session only.
  const setResume = (resume) => {
    if (!resume) {
      setProfile((prev) => ({ ...prev, resume: null }));
      return;
    }
    const { previewUrl: _previewUrl, ...persisted } = resume;
    setProfile((prev) => ({ ...prev, resume: persisted }));
  };

  const completion = useMemo(() => computeCompletion(profile), [profile]);

  return {
    profile,
    updatePersonal,
    setEducation,
    setWorkHistory,
    setSkills,
    setResume,
    completion,
  };
}

function computeCompletion(profile) {
  const checks = [
    Boolean(profile.personal?.fullName),
    Boolean(profile.personal?.email),
    Boolean(profile.personal?.headline),
    Boolean(profile.personal?.summary),
    (profile.education?.length ?? 0) > 0,
    (profile.workHistory?.length ?? 0) > 0,
    (profile.skills?.length ?? 0) >= 3,
    Boolean(profile.resume),
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}
