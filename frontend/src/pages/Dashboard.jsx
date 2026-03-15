import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, TrendingUp, BookOpen, Flame, Star, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MoodChart from '../components/MoodChart';
import axios from 'axios';

const API = 'http://localhost:8000';

const PLAN_COLORS = {
  free: '#64748b',
  basic: '#059669',
  standard: '#7c3aed',
  premium: '#0891b2'
};

const AFFIRMATIONS = [
  "You are stronger than you think. Every step forward matters. 💙",
  "Healing isn't linear, and that's okay. You're doing the best you can. 🌿",
  "Your feelings are valid. You deserve support and kindness. ✨",
  "Every day is a new opportunity to be gentle with yourself. 🌸",
  "You've survived every hard day so far. You're resilient. 🌟",
];

export default function Dashboard() {
  const { user, token, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [moodStats, setMoodStats] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const affirmation = AFFIRMATIONS[new Date().getDay() % AFFIRMATIONS.length];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, moodHistRes, moodStatsRes, chatRes] = await Promise.all([
          axios.get(`${API}/api/user/profile`, { headers }),
          axios.get(`${API}/api/mood/history?days=14`, { headers }),
          axios.get(`${API}/api/mood/stats`, { headers }),
          axios.get(`${API}/api/chat/history`, { headers }),
        ]);
        setProfile(profileRes.data);
        setUser(profileRes.data);
        setMoodData(moodHistRes.data);
        setMoodStats(moodStatsRes.data);
        setChatHistory(chatRes.data);
      } catch (e) {
        console.error('Dashboard load error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const planColor = PLAN_COLORS[profile?.plan || 'free'];
  const planLabel = (profile?.plan || 'free').charAt(0).toUpperCase() + (profile?.plan || 'free').slice(1);

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" style={{ borderTopColor: '#059669', borderColor: 'var(--border)', width: 32, height: 32, borderWidth: 3 }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="serif text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            {profile?.name?.split(' ')[0]} 🌿
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm italic">{affirmation}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Day Streak', value: profile?.streak || 0, icon: <Flame size={20} />, color: '#f97316', suffix: '🔥' },
            { label: 'Sessions', value: profile?.sessions_used || 0, icon: <MessageCircle size={20} />, color: '#059669' },
            { label: 'Avg Mood', value: moodStats?.average || '—', icon: <TrendingUp size={20} />, color: '#7c3aed', suffix: '/10' },
            { label: 'Plan', value: planLabel, icon: <Star size={20} />, color: planColor },
          ].map((stat, i) => (
            <div key={i} className="card text-center">
              <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center mb-2"
                style={{ background: `${stat.color}20`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {stat.value}{stat.suffix}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick actions */}
          <div className="md:col-span-1 space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: 'var(--text-secondary)' }}>
              Quick Actions
            </h3>
            {[
              { to: '/chat', icon: <MessageCircle size={18} />, label: 'Talk to Sage', desc: 'Start a session', color: '#059669' },
              { to: '/mood', icon: <TrendingUp size={18} />, label: 'Log Mood', desc: 'How are you feeling?', color: '#7c3aed' },
              { to: '/journal', icon: <BookOpen size={18} />, label: 'Open Journal', desc: 'Write your thoughts', color: '#0891b2' },
              { to: '/pricing', icon: <Zap size={18} />, label: 'Upgrade Plan', desc: 'Unlock more features', color: '#f59e0b' },
            ].map((action, i) => (
              <Link key={i} to={action.to}>
                <div className="card flex items-center gap-3 py-3 px-4 cursor-pointer">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${action.color}20`, color: action.color }}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{action.label}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{action.desc}</div>
                  </div>
                  <ChevronRight size={14} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </Link>
            ))}
          </div>

          {/* Mood chart */}
          <div className="md:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Mood (last 14 days)</h3>
                <Link to="/mood" className="text-xs text-emerald-600 font-medium">View all →</Link>
              </div>
              <MoodChart data={moodData} />
              {moodStats && (
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  {[
                    { label: 'Average', value: moodStats.average },
                    { label: 'Highest', value: moodStats.highest || '—' },
                    { label: 'Logged', value: moodStats.total },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="font-bold text-lg" style={{ color: '#059669' }}>{s.value}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent sessions */}
        {chatHistory.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Recent Sessions</h3>
              <Link to="/chat" className="text-xs text-emerald-600 font-medium">New session →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {chatHistory.slice(0, 3).map((s, i) => (
                <div key={i} className="card">
                  <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    {s.message_count} messages
                  </div>
                  {s.mood_before && (
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      Mood before: {s.mood_before}/10
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan info */}
        {profile?.plan === 'free' || profile?.plan === 'basic' ? (
          <div className="mt-6 rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid #334155' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white mb-1">Unlock the full MindEase experience</h3>
                <p className="text-sm" style={{ color: '#94a3b8' }}>
                  Get unlimited sessions, journaling, and weekly AI progress reports from $7.99/month
                </p>
              </div>
              <Link to="/pricing">
                <button className="btn-primary flex-shrink-0">Upgrade Now →</button>
              </Link>
            </div>
          </div>
        ) : null}

      </div>
      <Footer />
    </div>
  );
}
