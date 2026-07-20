import { createContext, useContext, useState, type ReactNode } from 'react';

type UserRole = 'candidate' | 'recruiter' | 'hiring_manager' | 'company' | 'admin';
type PageView = 'home' | 'login' | 'register' | 'jobs' | 'contact' | 'candidate_dashboard' | 'recruiter_dashboard' | 'hiring_manager_dashboard' | 'company_dashboard' | 'admin_dashboard';

export function getRoleFromEmail(email: string): UserRole {
  const normalized = email.trim().toLowerCase();
  const [localPart, domainPart = ''] = normalized.split('@');

  if (normalized === 'admin@hireminds.co' || localPart.includes('admin')) return 'admin';
  if (localPart.includes('recruiter') || localPart.includes('rec') || localPart.includes('talent') || localPart.includes('jobs')) return 'recruiter';
  if (localPart.includes('hiring') || localPart.includes('hm') || localPart.includes('recruitment')) return 'hiring_manager';
  if (localPart.includes('company') || localPart.includes('hr') || localPart.includes('work') || domainPart.includes('company')) return 'company';

  return 'candidate';
}

const dashboardByRole: Record<UserRole, PageView> = {
  candidate: 'candidate_dashboard',
  recruiter: 'recruiter_dashboard',
  hiring_manager: 'hiring_manager_dashboard',
  company: 'company_dashboard',
  admin: 'admin_dashboard',
};

interface AuthContextType {
  isSignedIn: boolean;
  username: string;
  userRole: UserRole | '';
  currentPage: PageView;
  signIn: (username: string, role?: UserRole) => void;
  signOut: () => void;
  openLogin: () => void;
  openRegister: () => void;
  openDashboard: () => void;
  openRoleDashboard: (role: UserRole) => void;
  openJobs: () => void;
  openContact: () => void;
  goHome: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<UserRole | ''>('candidate');
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const signIn = (name: string, role: UserRole = 'candidate') => {
    setUsername(name);
    setUserRole(role);
    setIsSignedIn(true);
    setCurrentPage(dashboardByRole[role]);
  };

  const signOut = () => {
    setUsername('');
    setUserRole('candidate');
    setIsSignedIn(false);
    setCurrentPage('home');
  };

  const openLogin = () => setCurrentPage('login');
  const openRegister = () => setCurrentPage('register');
  const openDashboard = () => setCurrentPage(userRole ? dashboardByRole[userRole] : 'candidate_dashboard');
  const openRoleDashboard = (role: UserRole) => setCurrentPage(dashboardByRole[role]);
  const openJobs = () => setCurrentPage('jobs');
  const openContact = () => setCurrentPage('contact');
  const goHome = () => setCurrentPage('home');

  return (
    <AuthContext.Provider value={{
      isSignedIn,
      username,
      userRole,
      currentPage,
      signIn,
      signOut,
      openLogin,
      openRegister,
      openDashboard,
      openRoleDashboard,
      openJobs,
      openContact,
      goHome,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
