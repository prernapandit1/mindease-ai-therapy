import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Pricing from './pages/Pricing';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import Journal from './pages/Journal';
import Crisis from './pages/Crisis';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';

// Context
export const AuthContext = createContext(null);
export const ThemeContext = createContext(null);

export function useAuth() { return useContext(AuthContext); }
export function useTheme() { return useContext(ThemeContext); }

// Protected route
function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mindease_token'));
  const [dark, setDark] = useState(localStorage.getItem('mindease_theme') === 'dark');

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem('mindease_user');
      if (stored) setUser(JSON.parse(stored));
    }
  }, [token]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('mindease_theme', dark ? 'dark' : 'light');
  }, [dark]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('mindease_token', authToken);
    localStorage.setItem('mindease_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('mindease_token');
    localStorage.removeItem('mindease_user');
  };

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: dark ? '#1e293b' : '#fff',
                color: dark ? '#f1f5f9' : '#0f172a',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: dark ? '#334155' : '#e2e8f0',
              }
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/crisis" element={<Crisis />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
            <Route path="/chat" element={<Protected><Chat /></Protected>} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/mood" element={<Protected><MoodTracker /></Protected>} />
            <Route path="/journal" element={<Protected><Journal /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
