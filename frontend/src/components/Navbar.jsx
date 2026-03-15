import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Heart, Phone } from 'lucide-react';
import { useAuth, useTheme } from '../App';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/chat', label: 'Talk to Sage' },
        { to: '/mood', label: 'Mood' },
        { to: '/journal', label: 'Journal' },
      ]
    : [
        { to: '/pricing', label: 'Pricing' },
        { to: '/crisis', label: 'Crisis Help' },
      ];

  return (
    <nav style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)' }}
      className="sticky top-0 z-50 backdrop-blur-sm">
      {/* Crisis banner */}
      <div className="crisis-banner text-xs">
        🆘 Crisis? Call iCall: <a href="tel:9152987821" className="font-bold underline">9152987821</a> · Available 24/7
      </div>

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}>
            <Heart size={16} color="white" fill="white" />
          </div>
          <span className="serif text-xl font-bold gradient-text">MindEase</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                location.pathname === link.to ? 'text-emerald-600' : ''
              }`}
              style={{ color: location.pathname === link.to ? '#059669' : 'var(--text-secondary)' }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => setDark(!dark)}
            className="p-2 rounded-full transition-colors"
            style={{ color: 'var(--text-secondary)' }}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Hi, {user.name?.split(' ')[0]}
              </span>
              <button onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-full border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <button className="text-sm px-4 py-2 rounded-full border transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="btn-primary text-sm py-2 px-5">Get Started</button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2" style={{ color: 'var(--text-primary)' }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)' }}
          className="md:hidden px-4 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              className="text-sm font-medium py-2 border-b"
              style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}>
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setDark(!dark)} className="flex items-center gap-2 text-sm"
              style={{ color: 'var(--text-secondary)' }}>
              {dark ? <Sun size={16} /> : <Moon size={16} />}
              {dark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
          {user ? (
            <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="w-full btn-secondary text-sm">Login</button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button className="w-full btn-primary text-sm">Get Started Free</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
