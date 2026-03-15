import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

const API = 'http://localhost:8000';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 4.99,
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #34d399)',
    features: [
      '10 AI sessions / month',
      'Mood tracker',
      'Crisis support 24/7',
      'Daily affirmations',
      'Email support',
    ],
    missing: ['Journal', 'Unlimited sessions', 'Progress reports'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 7.99,
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    popular: true,
    features: [
      'Unlimited AI sessions',
      'Mood tracker + history',
      'Private journal',
      'AI journal prompts',
      'Session history',
      'Crisis support 24/7',
      'Priority email support',
    ],
    missing: ['Weekly AI progress report', 'Downloadable summaries'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, #0891b2, #67e8f9)',
    features: [
      'Everything in Standard',
      'Priority AI responses',
      'Weekly AI progress report',
      'Downloadable session summaries',
      'Personalised insights',
      'Early access to features',
      'Priority support',
    ],
    missing: [],
  },
];

function PlanCard({ plan, currentPlan, onSelect, loading }) {
  const isCurrentPlan = currentPlan === plan.id;
  return (
    <div className={`card relative flex flex-col ${plan.popular ? 'ring-2 ring-violet-500' : ''}`}
      style={{ transform: plan.popular ? 'scale(1.02)' : 'scale(1)' }}>
      {plan.popular && (
        <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
          <div className="px-4 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
            style={{ background: '#7c3aed' }}>
            <Zap size={11} /> Most Popular
          </div>
        </div>
      )}

      <div className="mb-5">
        <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: plan.color }}>{plan.name}</div>
        <div className="flex items-end gap-1">
          <span className="serif text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>${plan.price}</span>
          <span className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>/month</span>
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Billed monthly · Cancel anytime</p>
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
            <span style={{ color: 'var(--text-primary)' }}>{f}</span>
          </li>
        ))}
        {plan.missing.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm opacity-40">
            <span className="flex-shrink-0 mt-0.5 w-3.5 text-center">—</span>
            <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
          </li>
        ))}
      </ul>

      {isCurrentPlan ? (
        <div className="w-full py-3 text-center rounded-full text-sm font-semibold"
          style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          ✓ Current Plan
        </div>
      ) : (
        <button onClick={() => onSelect(plan)} disabled={loading}
          className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: plan.gradient }}>
          {loading ? <span className="spinner" /> : null}
          {loading ? 'Processing...' : `Get ${plan.name}`}
        </button>
      )}
    </div>
  );
}

export default function Pricing() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (plan) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      navigate('/login');
      return;
    }
    setLoading(plan.id);
    try {
      // Create PayPal order
      const orderRes = await axios.post(`${API}/api/payment/create-order`,
        { plan: plan.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { order_id } = orderRes.data;

      // Simulate PayPal capture (in sandbox mode, auto-capture for demo)
      const captureRes = await axios.post(`${API}/api/payment/capture-order`,
        { order_id, plan: plan.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`🎉 Welcome to ${plan.name}! You're all set.`);
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-16 w-full flex-1">
        <div className="text-center mb-14">
          <h1 className="serif text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Therapy for every budget
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-4" style={{ color: 'var(--text-secondary)' }}>
            All plans include 24/7 access to Sage and crisis support. No hidden fees. Cancel anytime.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            💳 Secure payments via PayPal · 7-day money-back guarantee
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map(plan => (
            <PlanCard key={plan.id} plan={plan}
              currentPlan={user?.plan}
              onSelect={handleSelect}
              loading={loading === plan.id} />
          ))}
        </div>

        {/* Free tier */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Just exploring? <Link to="/chat" className="text-emerald-600 font-medium">Try Sage free</Link> — no payment needed.
          </p>
        </div>

        {/* Trust signals */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '7-Day Money Back', desc: 'Not satisfied? Get a full refund within 7 days, no questions asked.', icon: '💰' },
            { title: 'Cancel Anytime', desc: 'No lock-in contracts. Cancel your subscription with one click.', icon: '🔓' },
            { title: 'Data Privacy', desc: 'Your conversations are private and encrypted. We never sell your data.', icon: '🔒' },
          ].map((t, i) => (
            <div key={i} className="text-center p-5">
              <div className="text-3xl mb-2">{t.icon}</div>
              <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{t.title}</h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 p-4 rounded-2xl text-center" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            ⚠️ MindEase is not a substitute for professional mental health care. Sage is an AI assistant and not a licensed therapist. Payments processed securely via PayPal. Prices in USD.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
