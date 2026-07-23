import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type UserRole = 'candidate' | 'recruiter' | 'hiring_manager' | 'company' | 'admin';
type PageView = 'home' | 'login' | 'register' | 'jobs' | 'contact' | 'candidate_dashboard' | 'recruiter_dashboard' | 'hiring_manager_dashboard' | 'company_dashboard' | 'admin_dashboard' | 'admin_login' | 'company_setup_password';

const dashboardByRole: Record<UserRole | string, PageView> = {
  candidate: 'candidate_dashboard',
  Candidate: 'candidate_dashboard',
  recruiter: 'recruiter_dashboard',
  Recruiter: 'recruiter_dashboard',
  hiring_manager: 'hiring_manager_dashboard',
  HiringManager: 'hiring_manager_dashboard',
  company: 'company_dashboard',
  Company: 'company_dashboard',
  admin: 'admin_dashboard',
  Admin: 'admin_dashboard',
};

interface AuthContextType {
  isSignedIn: boolean;
  username: string;
  userRole: UserRole | string;
  userId: number | null;
  email: string;
  token: string | null;
  currentPage: PageView;
  signIn: (name: string, role: string, token: string, userId: number, email: string) => void;
  signOut: () => void;
  openLogin: () => void;
  openRegister: () => void;
  openDashboard: () => void;
  openRoleDashboard: (role: string) => void;
  openJobs: () => void;
  openContact: () => void;
  openAdminLogin: () => void;
  goHome: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState<UserRole | string>('candidate');
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isInitializing, setIsInitializing] = useState(true);

  // Restore session from localStorage and handle basic URL routing
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedName = localStorage.getItem('name');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('email');

    // Check path for deep linking
    const path = window.location.pathname;
    const searchParams = new window.URLSearchParams(window.location.search);
    const companySetupToken = searchParams.get('companySetupToken');
    const recruiterSetupToken = searchParams.get('recruiterSetupToken');
    const hiringManagerSetupToken = searchParams.get('hiringManagerSetupToken');

    if (storedToken && storedName && storedRole && storedUserId) {
      if (companySetupToken || recruiterSetupToken || hiringManagerSetupToken) {
        // Force logout if they are trying to setup a new account while logged in
        setCurrentPage('company_setup_password');
        setToken(null);
        setUsername('');
        setUserRole('candidate');
        setUserId(null);
        setEmail('');
        setIsSignedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
      } else {
        setToken(storedToken);
        setUsername(storedName);
        setUserRole(storedRole);
        setUserId(Number(storedUserId));
        setEmail(storedEmail || '');
        setIsSignedIn(true);
        setCurrentPage(dashboardByRole[storedRole] || 'home');
      }
    } else {
      if (companySetupToken || recruiterSetupToken || hiringManagerSetupToken) {
        setCurrentPage('company_setup_password');
      } else if (path.startsWith('/admin')) {
        setCurrentPage('admin_login');
      }
    }
    setIsInitializing(false);
  }, []);

  const signIn = (name: string, role: string, authToken: string, loggedInUserId: number, loggedInEmail: string) => {
    setUsername(name);
    setUserRole(role);
    setToken(authToken);
    setUserId(loggedInUserId);
    setEmail(loggedInEmail);
    setIsSignedIn(true);
    setCurrentPage(dashboardByRole[role] || 'home');

    // Save to localStorage
    localStorage.setItem('token', authToken);
    localStorage.setItem('name', name);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', loggedInUserId.toString());
    localStorage.setItem('email', loggedInEmail);
  };

  const signOut = () => {
    setUsername('');
    setUserRole('candidate');
    setToken(null);
    setUserId(null);
    setEmail('');
    setIsSignedIn(false);
    setCurrentPage('home');

    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
  };

  const openLogin = () => setCurrentPage('login');
  const openRegister = () => setCurrentPage('register');
  const openDashboard = () => setCurrentPage(userRole ? (dashboardByRole[userRole] || 'home') : 'home');
  const openRoleDashboard = (role: string) => setCurrentPage(dashboardByRole[role] || 'home');
  const openJobs = () => setCurrentPage('jobs');
  const openContact = () => setCurrentPage('contact');
  const openAdminLogin = () => setCurrentPage('admin_login');
  const goHome = () => setCurrentPage('home');

  if (isInitializing) {
    return <div className="h-screen w-screen flex items-center justify-center bg-surface-950"><div className="w-8 h-8 border-4 border-surface-600 border-t-primary-500 rounded-full animate-spin" /></div>;
  }

  return (
    <AuthContext.Provider value={{
      isSignedIn,
      username,
      userRole,
      userId,
      email,
      token,
      currentPage,
      signIn,
      signOut,
      openLogin,
      openRegister,
      openDashboard,
      openRoleDashboard,
      openJobs,
      openContact,
      openAdminLogin,
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
