import React, { useState } from 'react';
import PageHeader from '../../components/candidate/common/PageHeader';
import PersonalInfoForm from '../../components/candidate/profile/PersonalInfoForm';
import EducationForm from '../../components/candidate/profile/EducationForm';
import WorkHistoryForm from '../../components/candidate/profile/WorkHistoryForm';
import SkillsForm from '../../components/candidate/profile/SkillsForm';
import ResumeUploadWidget from '../../components/candidate/profile/ResumeUploadWidget';
import ProfileCompletionMeter from '../../components/candidate/profile/ProfileCompletionMeter';
import { useCandidate } from '../../context/CandidateContext';

const TABS = [
  { id: 'personal', label: 'Personal info' },
  { id: 'education', label: 'Education' },
  { id: 'work', label: 'Work history' },
  { id: 'skills', label: 'Skills' },
  { id: 'resume', label: 'Resume / CV' },
];

export default function ProfileBuilderPage() {
  const { profile, updatePersonal, setEducation, setWorkHistory, setSkills, setResume, completion } =
    useCandidate();
  const [activeTab, setActiveTab] = useState('personal');

  const name = profile.personal?.fullName?.trim();
  const initials = name
    ? name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '—';

  return (
    <div>
      <PageHeader
        eyebrow="Candidate Portal"
        title="Build your profile"
        subtitle="A complete profile improves your match score on Recommended Jobs and is what recruiters see when you apply."
      />

      <ProfileCompletionMeter completion={completion} initials={initials} headline={profile.personal?.headline} />

      <div className="cp-tabs" role="tablist" aria-label="Profile sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            className={`cp-tab${activeTab === tab.id ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'personal' && <PersonalInfoForm personal={profile.personal} onChange={updatePersonal} />}
      {activeTab === 'education' && <EducationForm education={profile.education} onChange={setEducation} />}
      {activeTab === 'work' && <WorkHistoryForm workHistory={profile.workHistory} onChange={setWorkHistory} />}
      {activeTab === 'skills' && <SkillsForm skills={profile.skills} onChange={setSkills} />}
      {activeTab === 'resume' && <ResumeUploadWidget resume={profile.resume} onChange={setResume} />}
    </div>
  );
}
