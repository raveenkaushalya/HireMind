import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/public/HomePage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import JobsPage from './pages/public/JobsPage';
import HiringManagerDashboard from './pages/recruitment/hiring-managers/HiringManagerDashboard';
import RecruiterDashboard from './pages/recruitment/recruiter/RecruiterDashboard';
import CompanyDashboard from './pages/company/CompanyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function AppContent() {
  const { currentPage, userRole, signOut, openRoleDashboard } = useAuth();

  const switchRecruitmentRole = () => {
    if (userRole === 'recruiter') {
      openRoleDashboard('hiring_manager');
      return;
    }
    if (userRole === 'hiring_manager') {
      openRoleDashboard('recruiter');
    }
  };

  if (currentPage === 'login') return <LoginPage />;
  if (currentPage === 'register') return <RegisterPage />;
  if (currentPage === 'jobs') return <JobsPage />;
  if (currentPage === 'contact') return <ContactPage />;
  if (currentPage === 'candidate_dashboard') return <CandidateDashboard />;
  if (currentPage === 'recruiter_dashboard') {
    return <RecruiterDashboard onLogout={signOut} onSwitch={switchRecruitmentRole} />;
  }
  if (currentPage === 'hiring_manager_dashboard') {
    return <HiringManagerDashboard onLogout={signOut} onSwitch={switchRecruitmentRole} />;
  }
  if (currentPage === 'company_dashboard') {
    return <CompanyDashboard onLogout={signOut} />;
  }
  if (currentPage === 'admin_dashboard') {
    return <AdminDashboard onLogout={signOut} />;
  }

  return <HomePage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
