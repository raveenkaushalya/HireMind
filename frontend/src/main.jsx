import React from 'react';
import ReactDOM from 'react-dom/client';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import './styles/globals.css';

function App() {
  return <RecruiterDashboard />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
