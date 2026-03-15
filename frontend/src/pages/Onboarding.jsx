import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import axios from 'axios';

const API = 'http://localhost:8000';

const questions = [
  {
    id: 'primary_concern',
    question: "What brings you to MindEase today?",
    subtitle: "Select the area you'd like to focus on most",
    type: 'single',
    options: ['Anxiety & worry', 'Depression & low mood', 'Stress & burnout', 'Relationship issues', 'Grief & loss', 'Trauma & PTSD', 'Loneliness', 'Just need to talk'],
  },
  {
    id: 'mood_frequency',
    question: "How often do you feel overwhelmed or anxious?",
    type: 'single',
    options: ['Rarely (once a month)', 'Sometimes (once a week)', 'Often (several times a week)', 'Almost every day'],
  },
  {
    id: 'sleep',
    question: "How has your sleep been lately?",
    type: 'single',
    options: ['Sleeping well', 'Occasional trouble', 'Often disrupted', 'Very poor — barely sleeping'],
  },
  {
    id: 'social_support',
    question: "Do you have people in your life you can talk to?",
    type: 'single',
    options: ['Yes, a strong support network', 'A few close people', 'Not really', 'I feel completely alone'],
  },
  {
    id: 'previous_therapy',
    question: "Have you done therapy or counselling before?",
    type: 'single',
    options: ['Never tried it', 'Tried it, found it helpful', 'Tried it, it wasn\'t for me', 'Currently in therapy'],
  },
  {
    id: 'goals',
    question: "What would you like to get from MindEase?",
    subtitle: "You can select multiple",
    type: 'multi',
    options: ['Reduce anxiety', 'Improve mood', 'Better sleep', 'Process difficult emotions', 'Build confidence', 'Improve relationships', 'Develop coping skills', 'Track my mental health'],
  },
  {
    id: 'communication_style',
    question: "How would you like Sage to talk to you?",
    type: 'single',
    options: ['Warm and gentle', 'Direct and structured', 'Balanced — both', 'Motivational and energizing'],
  },
  {
    id: 'check_in_time',
    question: "When do you usually need support most?",
    type: 'single',
    options: ['Morning', 'Afternoon', 'Evening', 'Late night / early hours'],
  },
  {
    id: 'current_mood',
    question: "How are you feeling right now, on a scale of 1-10?",
    type: 'scale',
    min: 1,
    max: 10,
  },
  {
    id: 'commitment',
    question: "How often can you check in with MindEase?",
    type: 'single',
    options: ['A few times a week', 'Daily', 'Multiple times a day', 'Whenever I need it'],
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleSingle = (opt) => {
    setAnswers({ ...answers, [q.id]: opt });
  };

  const handleMulti = (opt) => {
    const current = answers[q.id] || [];
    if (current.includes(opt)) {
      setAnswers({ ...answers, [q.id]: current.filter(o => o !== opt) });
    } else {
      setAnswers({ ...answers, [q.id]: [...current, opt] });
    }
  };

  const handleScale = (val) => {
    setAnswers({ ...answers, [q.id]: val });
  };

  const canNext = () => {
    if (q.type === 'scale') return answers[q.id] !== undefined;
    if (q.type === 'multi') return (answers[q.id] || []).length > 0;
    return !!answers[q.id];
  };

  const handleNext = () => {
    if (step < questions.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/onboarding/submit`, { answers },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Sage has been personalised for you! 🌿');
      navigate('/chat');
    } catch {
      toast.error('Something went wrong. You can still chat with Sage!');
      navigate('/chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}
      className="flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}>
          <Heart size={16} color="white" fill="white" />
        </div>
        <span className="serif text-xl font-bold gradient-text">MindEase</span>
      </div>

      {/* Progress */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #059669, #7c3aed)' }} />
        </div>
      </div>

      {/* Card */}
      <div className="card w-full max-w-lg p-8 fade-in" key={step}>
        <h2 className="serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {q.question}
        </h2>
        {q.subtitle && <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{q.subtitle}</p>}

        {/* Single choice */}
        {q.type === 'single' && (
          <div className="space-y-2 mt-5">
            {q.options.map(opt => (
              <button key={opt} onClick={() => handleSingle(opt)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                style={{
                  background: answers[q.id] === opt ? 'linear-gradient(135deg, #d1fae5, #ede9fe)' : 'var(--bg-secondary)',
                  border: `1px solid ${answers[q.id] === opt ? '#059669' : 'var(--border)'}`,
                  color: answers[q.id] === opt ? '#059669' : 'var(--text-primary)',
                  fontWeight: answers[q.id] === opt ? 600 : 400
                }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Multi choice */}
        {q.type === 'multi' && (
          <div className="flex flex-wrap gap-2 mt-5">
            {q.options.map(opt => {
              const selected = (answers[q.id] || []).includes(opt);
              return (
                <button key={opt} onClick={() => handleMulti(opt)}
                  className="px-4 py-2 rounded-full text-sm transition-all"
                  style={{
                    background: selected ? 'linear-gradient(135deg, #059669, #7c3aed)' : 'var(--bg-secondary)',
                    border: `1px solid ${selected ? 'transparent' : 'var(--border)'}`,
                    color: selected ? 'white' : 'var(--text-primary)',
                    fontWeight: selected ? 600 : 400
                  }}>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Scale */}
        {q.type === 'scale' && (
          <div className="mt-5">
            <div className="flex gap-2 justify-center flex-wrap">
              {Array.from({ length: q.max - q.min + 1 }, (_, i) => i + q.min).map(val => (
                <button key={val} onClick={() => handleScale(val)}
                  className="w-10 h-10 rounded-full text-sm font-bold transition-all"
                  style={{
                    background: answers[q.id] === val ? 'linear-gradient(135deg, #059669, #7c3aed)' : 'var(--bg-secondary)',
                    border: `1px solid ${answers[q.id] === val ? 'transparent' : 'var(--border)'}`,
                    color: answers[q.id] === val ? 'white' : 'var(--text-primary)',
                  }}>
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
              <span>Very low</span><span>Very high</span>
            </div>
            {answers[q.id] && (
              <p className="text-center text-sm mt-3 font-medium" style={{ color: '#059669' }}>
                You rated your mood: {answers[q.id]}/10
              </p>
            )}
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex justify-between mt-8">
          <button onClick={handleBack} disabled={step === 0}
            className="flex items-center gap-1 text-sm px-4 py-2 rounded-full transition-colors"
            style={{ color: step === 0 ? 'var(--border)' : 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            <ChevronLeft size={16} /> Back
          </button>

          {step < questions.length - 1 ? (
            <button onClick={handleNext} disabled={!canNext()} className="btn-primary py-2 px-6 flex items-center gap-1"
              style={{ opacity: !canNext() ? 0.5 : 1 }}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canNext() || loading}
              className="btn-primary py-2 px-6 flex items-center gap-2"
              style={{ opacity: !canNext() ? 0.5 : 1 }}>
              {loading ? <span className="spinner" /> : null}
              {loading ? 'Saving...' : 'Meet Sage 🌿'}
            </button>
          )}
        </div>
      </div>

      <p className="disclaimer mt-4 max-w-lg">
        ⚠️ Sage is an AI assistant and not a licensed therapist. Please consult a mental health professional for clinical support.
      </p>
    </div>
  );
}
