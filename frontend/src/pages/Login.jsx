import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/login`, form);
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 💙`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      {/* Top bar */}
      <div className="p-4 flex justify-between items-center max-w-6xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}>
            <Heart size={16} color="white" fill="white" />
          </div>
          <span className="serif text-xl font-bold gradient-text">MindEase</span>
        </Link>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          No account? <Link to="/signup" className="text-emerald-600 font-medium">Sign up free</Link>
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="serif text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Sage is ready to listen 💙</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    focusRingColor: '#059669'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Password</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Your password"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none pr-11"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3 top-3.5" style={{ color: 'var(--text-secondary)' }}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                {loading ? <span className="spinner" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                New to MindEase? <Link to="/signup" className="text-emerald-600 font-medium">Create free account</Link>
              </p>
            </div>
          </div>

          <p className="disclaimer mt-4">
            ⚠️ Sage is an AI assistant and not a licensed therapist. For clinical care, consult a mental health professional.
          </p>
        </div>
      </div>
    </div>
  );
}
