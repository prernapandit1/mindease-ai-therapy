import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = (p) => {
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = passwordStrength(form.password);
  const strengthColor = ['#dc2626', '#ea580c', '#d97706', '#059669'][strength - 1] || '#e2e8f0';
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password
      });
      login(res.data.user, res.data.token);
      toast.success(`Welcome to MindEase, ${res.data.user.name}! 🌿`);
      navigate('/onboarding');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <div className="p-4 flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}>
            <Heart size={16} color="white" fill="white" />
          </div>
          <span className="serif text-xl font-bold gradient-text">MindEase</span>
        </Link>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Have an account? <Link to="/login" className="text-emerald-600 font-medium">Sign in</Link>
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="serif text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Start your healing journey</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Free to start. No credit card required.</p>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {['24/7 AI support', 'Mood tracking', 'Private & secure'].map(b => (
              <div key={b} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                <Check size={11} style={{ color: '#059669' }} />
                {b}
              </div>
            ))}
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Full Name</label>
                <input type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Password</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Create a password"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-11"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3 top-3.5" style={{ color: 'var(--text-secondary)' }}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${strength * 25}%`, background: strengthColor }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: strengthColor }}>{strengthLabel}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Confirm Password</label>
                <input type="password" value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${form.confirm && form.confirm !== form.password ? '#dc2626' : 'var(--border)'}`,
                    color: 'var(--text-primary)'
                  }} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {loading ? <span className="spinner" /> : null}
                {loading ? 'Creating account...' : 'Create Free Account'}
              </button>
            </form>

            <p className="text-xs text-center mt-4" style={{ color: 'var(--text-secondary)' }}>
              By signing up, you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </div>

          <p className="disclaimer mt-4">
            ⚠️ Sage is an AI assistant and not a licensed therapist. For clinical care, consult a mental health professional.
          </p>
        </div>
      </div>
    </div>
  );
}
