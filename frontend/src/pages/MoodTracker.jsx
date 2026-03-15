import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MoodChart from '../components/MoodChart';
import axios from 'axios';

const API = 'http://localhost:8000';

const EMOTIONS = [
  'Happy', 'Grateful', 'Calm', 'Hopeful', 'Excited',
  'Anxious', 'Sad', 'Angry', 'Frustrated', 'Lonely',
  'Tired', 'Numb', 'Overwhelmed', 'Confused', 'Content'
];

const MOOD_EMOJI = ['', '😰','😢','😟','😕','😐','🙂','😊','😄','🌟','🚀'];
const MOOD_LABEL = ['', 'Very Low','Low','Below Average','Slightly Low','Neutral','Fairly Good','Good','Great','Excellent','Amazing'];

export default function MoodTracker() {
  const [score, setScore] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [histRes, statsRes] = await Promise.all([
        axios.get(`${API}/api/mood/history?days=30`, { headers }),
        axios.get(`${API}/api/mood/stats`, { headers })
      ]);
      setHistory(histRes.data);
      setStats(statsRes.data);
    } catch (e) { console.error(e); }
  };

  const toggleEmotion = (e) => {
    setSelectedEmotions(prev =>
      prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]
    );
  };

  const handleSubmit = async () => {
    if (!score) return toast.error('Please select your mood score');
    setLoading(true);
    try {
      await axios.post(`${API}/api/mood/log`, {
        score,
        emotion_tags: selectedEmotions,
        note: note.trim() || null
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Mood logged! Keep it up 🌿');
      setScore(null);
      setSelectedEmotions([]);
      setNote('');
      fetchHistory();
    } catch (e) {
      toast.error('Failed to log mood. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        <div className="mb-8">
          <h1 className="serif text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Mood Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track how you feel every day. Small check-ins, big insights.</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Average Mood', value: `${stats.average}/10` },
              { label: 'Entries', value: stats.total },
              { label: 'Day Streak', value: `${stats.streak} 🔥` },
            ].map((s, i) => (
              <div key={i} className="card text-center">
                <div className="serif text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Log mood */}
        <div className="card mb-6">
          <h2 className="font-bold text-lg mb-5" style={{ color: 'var(--text-primary)' }}>
            How are you feeling right now?
          </h2>

          {/* Score picker */}
          <div className="mb-5">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              Rate your mood (1–10)
            </p>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => setScore(n)}
                  className="flex flex-col items-center p-2 rounded-xl transition-all"
                  style={{
                    background: score === n ? 'linear-gradient(135deg, #059669, #7c3aed)' : 'var(--bg-secondary)',
                    border: `1px solid ${score === n ? 'transparent' : 'var(--border)'}`,
                    transform: score === n ? 'scale(1.1)' : 'scale(1)'
                  }}>
                  <span className="text-xl">{MOOD_EMOJI[n]}</span>
                  <span className="text-xs font-bold mt-0.5"
                    style={{ color: score === n ? 'white' : 'var(--text-primary)' }}>{n}</span>
                </button>
              ))}
            </div>
            {score && (
              <p className="text-center text-sm font-medium mt-3" style={{ color: '#059669' }}>
                {MOOD_EMOJI[score]} {MOOD_LABEL[score]}
              </p>
            )}
          </div>

          {/* Emotion tags */}
          <div className="mb-5">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
              What emotions are present? (optional)
            </p>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(e => (
                <button key={e} onClick={() => toggleEmotion(e)}
                  className="px-3 py-1.5 rounded-full text-sm transition-all"
                  style={{
                    background: selectedEmotions.includes(e) ? 'linear-gradient(135deg, #059669, #7c3aed)' : 'var(--bg-secondary)',
                    border: `1px solid ${selectedEmotions.includes(e) ? 'transparent' : 'var(--border)'}`,
                    color: selectedEmotions.includes(e) ? 'white' : 'var(--text-primary)',
                  }}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-5">
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Add a note (optional)
            </p>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="What's on your mind today?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
          </div>

          <button onClick={handleSubmit} disabled={!score || loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            style={{ opacity: !score ? 0.5 : 1 }}>
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Logging...' : 'Log My Mood'}
          </button>
        </div>

        {/* Chart */}
        <div className="card mb-6">
          <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Last 30 Days</h2>
          <MoodChart data={history} />
        </div>

        {/* Recent entries */}
        {history.length > 0 && (
          <div className="card">
            <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Entries</h2>
            <div className="space-y-3">
              {history.slice(-10).reverse().map((entry, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b last:border-0"
                  style={{ borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'var(--bg-secondary)' }}>
                    {MOOD_EMOJI[entry.score]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: '#059669' }}>
                        {entry.score}/10 — {MOOD_LABEL[entry.score]}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(entry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    {entry.emotion_tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.emotion_tags.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.note && <p className="text-xs mt-1 italic" style={{ color: 'var(--text-secondary)' }}>{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
