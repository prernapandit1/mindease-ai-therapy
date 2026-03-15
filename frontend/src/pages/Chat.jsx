import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, Phone, Info, Sparkles, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../App';
import Navbar from '../components/Navbar';
import CrisisAlert from '../components/CrisisAlert';
import axios from 'axios';

const API = 'http://localhost:8000';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `Hello, I'm **Sage** 🌿

I'm here to listen — without judgment, without rush.

Whether you're dealing with anxiety, stress, sadness, or just need to talk through something on your mind, I'm here for you.

*How are you feeling today?*

---
*Sage is an AI assistant and not a licensed therapist. Please consult a mental health professional for clinical support.*`
};

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 fade-in`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2 self-end mb-1"
          style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}>
          <Sparkles size={14} color="white" />
        </div>
      )}
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-sage'}>
        {isUser ? (
          <p className="text-sm leading-relaxed">{msg.content}</p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-sm max-w-none"
            style={{ color: 'var(--text-primary)' }}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
        {msg.timestamp && (
          <p className="text-xs mt-1 opacity-60">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2"
        style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}>
        <Sparkles size={14} color="white" />
      </div>
      <div className="chat-bubble-sage flex items-center gap-1.5 py-3">
        {[0, 0.2, 0.4].map((delay, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-emerald-500"
            style={{ animation: `pulse-soft 1.2s ease-in-out ${delay}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

const QUICK_PROMPTS = [
  "I'm feeling anxious today",
  "I need help with stress",
  "I'm feeling lonely",
  "Help me with a breathing exercise",
  "I want to talk about my mood",
];

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showCrisis, setShowCrisis] = useState(false);
  const [moodBefore, setMoodBefore] = useState(null);
  const [showMoodPicker, setShowMoodPicker] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { token, user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setShowMoodPicker(false);

    const userMsg = { role: 'user', content: msg, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/chat/message`, {
        message: msg,
        session_id: sessionId,
        mood_before: moodBefore
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.session_id && !sessionId) setSessionId(res.data.session_id);

      const aiMsg = {
        role: 'assistant',
        content: res.data.response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMsg]);

      if (res.data.is_crisis) setShowCrisis(true);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Session limit reached. Please upgrade your plan.');
      } else {
        const fallback = {
          role: 'assistant',
          content: "I'm having a small technical issue. Please try again in a moment. If you need immediate support, please call iCall: **9152987821**.",
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, fallback]);
      }
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewSession = () => {
    setMessages([WELCOME_MESSAGE]);
    setSessionId(null);
    setShowCrisis(false);
    setShowMoodPicker(true);
    setMoodBefore(null);
    toast.success('New session started 🌿');
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-3xl mx-auto w-full px-4 py-4 flex-col" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}>
                <Sparkles size={18} color="white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2"
                style={{ borderColor: 'var(--bg-primary)' }} />
            </div>
            <div>
              <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Sage</h2>
              <p className="text-xs text-green-500 font-medium">Online · Always here</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="tel:9152987821"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
              <Phone size={12} /> iCall: 9152987821
            </a>
            <button onClick={startNewSession}
              className="p-2 rounded-full text-xs"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              title="New session">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Crisis alert */}
        {showCrisis && <CrisisAlert onClose={() => setShowCrisis(false)} />}

        {/* Mood picker */}
        {showMoodPicker && !moodBefore && (
          <div className="card mb-4 p-4">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
              How are you feeling right now? (1 = very low, 10 = great)
            </p>
            <div className="flex flex-wrap gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => { setMoodBefore(n); setShowMoodPicker(false); }}
                  className="w-9 h-9 rounded-full text-sm font-bold transition-all hover:scale-110"
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  {n}
                </button>
              ))}
            </div>
            <button onClick={() => setShowMoodPicker(false)} className="text-xs mt-2"
              style={{ color: 'var(--text-secondary)' }}>Skip for now</button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-2xl p-4 mb-4"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && !loading && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => sendMessage(p)}
                className="flex-shrink-0 text-xs px-3 py-2 rounded-full transition-colors"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)'
                }}>
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            rows={1}
            className="flex-1 resize-none px-4 py-3 rounded-2xl text-sm outline-none"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              maxHeight: '120px'
            }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() && !loading ? 'linear-gradient(135deg, #059669, #7c3aed)' : 'var(--border)',
              color: 'white'
            }}>
            <Send size={18} />
          </button>
        </div>

        {/* Plan limit info */}
        {user?.plan === 'basic' && (
          <div className="text-center mt-2">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {10 - (user?.sessions_used || 0)} sessions remaining this month ·{' '}
              <Link to="/pricing" className="text-emerald-600 underline">Upgrade</Link>
            </p>
          </div>
        )}

        <p className="disclaimer mt-1">
          Sage is an AI assistant and not a licensed therapist. For clinical support, consult a professional.
        </p>
      </div>
    </div>
  );
}
