import { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import JobSeekerDashboard from '@/pages/JobSeekerDashboard';
import EmployerDashboard from '@/pages/EmployerDashboard';
import JobListings from '@/pages/JobListings';
import JobDetail from '@/pages/JobDetail';
import { Toaster } from '@/components/ui/sonner';
import { authAPI } from '@/lib/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await authAPI.me();
      const userData = response.data;
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />
          <Route path="/auth" element={user ? <Navigate to={user.role === 'job_seeker' ? '/dashboard' : '/employer'} /> : <AuthPage onLogin={handleLogin} />} />
          <Route path="/dashboard" element={user && user.role === 'job_seeker' ? <JobSeekerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/employer" element={user && user.role === 'employer' ? <EmployerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/jobs" element={user ? <JobListings user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/jobs/:jobId" element={user ? <JobDetail user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
