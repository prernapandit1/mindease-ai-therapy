import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, BookOpen, Sparkles, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null);
  const { token, user } = useAuth();

  const canUseJournal = ['standard', 'premium'].includes(user?.plan);

  useEffect(() => {
    if (canUseJournal) fetchEntries();
    fetchPrompt();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/journal/entries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchPrompt = async () => {
    try {
      const res = await axios.get(`${API}/api/journal/prompt`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiPrompt(res.data.prompt);
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return toast.error('Please add a title and some content');
    setSaving(true);
    try {
      await axios.post(`${API}/api/journal/entry`, {
        title: title.trim(),
        content: content.trim(),
        ai_prompt: aiPrompt
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Journal entry saved 📖');
      setTitle('');
      setContent('');
      setShowNew(false);
      fetchEntries();
    } catch (e) {
      toast.error('Failed to save entry.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    try {
      await axios.delete(`${API}/api/journal/entry/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Entry deleted');
      setEntries(entries.filter(e => e.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      toast.error('Failed to delete entry.');
    }
  };

  if (!canUseJournal) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #d1fae5, #ede9fe)' }}>
              <Lock size={28} style={{ color: '#7c3aed' }} />
            </div>
            <h2 className="serif text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Journal is locked</h2>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
              Journaling with AI-generated prompts is available on Standard and Premium plans.
            </p>
            <Link to="/pricing">
              <button className="btn-primary">Upgrade to Unlock →</button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="serif text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              My Journal
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>{entries.length} private entries</p>
          </div>
          <button onClick={() => { setShowNew(true); setSelected(null); }} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> New Entry
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Entry list */}
          <div className="md:col-span-1">
            {/* Today's prompt */}
            {aiPrompt && (
              <div className="card mb-4 p-4" style={{ background: 'linear-gradient(135deg, #f0fdf4, #faf5ff)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} style={{ color: '#7c3aed' }} />
                  <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#7c3aed' }}>Today's Prompt</span>
                </div>
                <p className="text-sm italic" style={{ color: 'var(--text-primary)' }}>"{aiPrompt}"</p>
                <button onClick={() => { setShowNew(true); setContent(`Prompt: ${aiPrompt}\n\n`); setTitle('Reflection'); }}
                  className="text-xs mt-2 font-medium" style={{ color: '#059669' }}>
                  Write about this →
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto" style={{ borderTopColor: '#059669', borderColor: 'var(--border)', width: 24, height: 24, borderWidth: 2 }} />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen size={40} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No entries yet. Start writing!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map(entry => (
                  <div key={entry.id}
                    onClick={() => { setSelected(entry); setShowNew(false); }}
                    className="card cursor-pointer py-3 px-4"
                    style={{ border: selected?.id === entry.id ? '1px solid #059669' : '1px solid var(--border)' }}>
                    <div className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{entry.title}</div>
                    <div className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>{entry.content.slice(0, 60)}...</div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(entry.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor / Viewer */}
          <div className="md:col-span-2">
            {showNew ? (
              <div className="card p-6">
                <h2 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>New Entry</h2>
                {aiPrompt && (
                  <div className="p-3 rounded-xl mb-4 text-sm italic"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    💡 Prompt: {aiPrompt}
                  </div>
                )}
                <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Title your entry..."
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-3 font-semibold"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <textarea value={content} onChange={e => setContent(e.target.value)}
                  placeholder="What's on your mind? Write freely — this is your private space."
                  rows={14}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none mb-4"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', lineHeight: '1.8' }} />
                <div className="flex gap-3">
                  <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                    {saving ? <span className="spinner" /> : null}
                    {saving ? 'Saving...' : 'Save Entry'}
                  </button>
                  <button onClick={() => setShowNew(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            ) : selected ? (
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{selected.title}</h2>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(selected.created_at).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(selected.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                {selected.ai_prompt && (
                  <div className="p-3 rounded-xl mb-4 text-sm italic"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    💡 Prompt: {selected.ai_prompt}
                  </div>
                )}
                <p className="text-sm leading-loose whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                  {selected.content}
                </p>
              </div>
            ) : (
              <div className="card p-6 flex flex-col items-center justify-center h-64">
                <BookOpen size={40} className="mb-3" style={{ color: 'var(--text-secondary)' }} />
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Select an entry or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
