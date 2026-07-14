import React from 'react';
import { Outlet } from 'react-router-dom';
import CandidateSidebar from './CandidateSidebar';
import ChatbotWidget from '../chatbot/ChatbotWidget';
import { CandidateProvider } from '../../../context/CandidateContext';

import '../../../styles/candidate/tokens.css';
import '../../../styles/candidate/layout.css';
import '../../../styles/candidate/components.css';
import '../../../styles/candidate/profile.css';
import '../../../styles/candidate/jobs.css';
import '../../../styles/candidate/tracker.css';
import '../../../styles/candidate/interviews.css';
import '../../../styles/candidate/chatbot.css';
import '../../../styles/candidate/dashboard.css';

export default function CandidateLayout() {
  return (
    <CandidateProvider>
      <div className="cp-shell">
        <CandidateSidebar />
        <main className="cp-main">
          <Outlet />
        </main>
        <ChatbotWidget />
      </div>
    </CandidateProvider>
  );
}
