import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Shield, Zap, Clock, MessageCircle, TrendingUp, BookOpen, ChevronDown, Star, Check } from 'lucide-react';

const faqs = [
  { q: "Is Sage a real therapist?", a: "No. Sage is an AI companion trained on evidence-based techniques (CBT/DBT). Sage provides emotional support and coping tools, but is not a licensed therapist. For clinical treatment, please consult a mental health professional." },
  { q: "How is MindEase different from BetterHelp?", a: "MindEase costs up to 98% less ($4.99 vs $260+/month), provides instant 24/7 AI support, includes mood tracking and journaling, and detects crisis situations automatically. BetterHelp takes 48 hours to match you and has no AI." },
  { q: "Is my data private and secure?", a: "Yes. All data is encrypted. We never sell your personal information. You can delete your account and all data at any time. Read our Privacy Policy for full details." },
  { q: "What if I'm in a mental health crisis?", a: "If you're in crisis, call iCall at 9152987821 immediately. MindEase also detects crisis signals and shows emergency resources automatically. Sage will always provide crisis helpline information." },
  { q: "Can I cancel anytime?", a: "Yes, cancel anytime with no questions asked. We offer a 7-day money-back guarantee on all paid plans." },
  { q: "Does MindEase work for anxiety and depression?", a: "Sage specializes in anxiety, depression, stress, grief, relationships, trauma, and loneliness. It uses CBT and DBT techniques proven effective for these conditions." },
];

const testimonials = [
  { name: "Priya S.", role: "Student, Mumbai", text: "I was skeptical about AI therapy, but Sage helped me through my exam anxiety in ways I didn't expect. Available at 2am when I needed it most.", rating: 5 },
  { name: "Rahul M.", role: "Software Engineer, Bangalore", text: "BetterHelp was ₹20,000/month which I couldn't afford. MindEase at ₹400/month changed everything. The mood tracking keeps me accountable.", rating: 5 },
  { name: "Anjali K.", role: "Working Mom, Delhi", text: "The journal prompts are so thoughtful. It's like having a therapist who knows exactly what question to ask. I feel truly heard.", rating: 5 },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <button onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-center justify-between gap-4 font-medium"
        style={{ color: 'var(--text-primary)' }}>
        <span>{q}</span>
        <ChevronDown size={18} className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-secondary)' }} />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{a}</p>
      )}
    </div>
  );
}

export default function Landing() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#059669' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: '#7c3aed' }} />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            <Zap size={14} style={{ color: '#059669' }} />
            24/7 AI Mental Health Support — Now Available
          </div>

          <h1 className="serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Therapy for Everyone,<br />
            <span className="gradient-text">Starting at $4.99</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}>
            Meet <strong>Sage</strong> — your 24/7 AI therapist trained in CBT & DBT. Instant support for anxiety, depression, stress & more. No waitlists. No $300 bills.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Link to="/signup">
              <button className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
                Start Free Today →
              </button>
            </Link>
            <Link to="/chat">
              <button className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
                Try Sage Now
              </button>
            </Link>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            No credit card required · Cancel anytime · 7-day money-back guarantee
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mt-14">
            {[['98%', 'cheaper than BetterHelp'], ['24/7', 'instant support'], ['0min', 'wait time']].map(([val, label]) => (
              <div key={val}>
                <div className="serif text-3xl font-bold gradient-text">{val}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* vs BetterHelp */}
      <section className="py-16 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="serif text-3xl md:text-4xl font-bold text-center mb-10">
            Why MindEase beats BetterHelp
          </h2>
          <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--navy)', color: 'white' }}>
                  <th className="text-left p-4 font-medium">Feature</th>
                  <th className="text-center p-4 font-medium gradient-text">MindEase ✨</th>
                  <th className="text-center p-4 font-medium" style={{ color: '#94a3b8' }}>BetterHelp</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Monthly Cost', '$4.99 – $9.99', '$260 – $400'],
                  ['Wait Time', 'Instant', '48+ hours'],
                  ['Availability', '24/7 always on', 'Scheduled only'],
                  ['AI Support', '✅ Sage AI therapist', '❌ None'],
                  ['Crisis Detection', '✅ Automatic', '❌ None'],
                  ['Mood Tracking', '✅ Daily logs + charts', '❌ None'],
                  ['Journaling', '✅ AI-prompted journal', '❌ None'],
                  ['Progress Reports', '✅ Weekly AI reports', '❌ None'],
                ].map(([feature, us, them], i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : ''} style={{ background: i % 2 === 0 ? 'var(--card-bg)' : 'var(--bg-secondary)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-primary)' }}>{feature}</td>
                    <td className="p-4 text-center text-emerald-600 font-semibold">{us}</td>
                    <td className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="serif text-3xl md:text-4xl font-bold text-center mb-4">Everything you need to feel better</h2>
          <p className="text-center mb-12 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Sage uses proven therapeutic techniques to help you build resilience, understand your emotions, and thrive.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <MessageCircle size={24} />, title: 'AI Therapist Sage', desc: 'Empathetic conversations using CBT & DBT. Available at 3am, no appointment needed.' },
              { icon: <TrendingUp size={24} />, title: 'Mood Tracking', desc: 'Log your mood daily, spot patterns, and watch your emotional health improve over time.' },
              { icon: <BookOpen size={24} />, title: 'Guided Journaling', desc: 'AI-generated prompts that cut through the noise and help you process what matters.' },
              { icon: <Shield size={24} />, title: 'Crisis Detection', desc: 'Sage automatically recognizes distress signals and connects you with help immediately.' },
              { icon: <Zap size={24} />, title: 'Instant Matching', desc: 'No waiting. No forms. Start talking to Sage in under 60 seconds.' },
              { icon: <Heart size={24} />, title: 'Progress Reports', desc: 'Weekly AI-generated summaries of your mental health journey on Premium.' },
            ].map((f, i) => (
              <div key={i} className="card">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #d1fae5, #ede9fe)', color: '#059669' }}>
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="serif text-3xl md:text-4xl font-bold mb-12">Start feeling better in 3 steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Take the Quiz', desc: 'A 10-question assessment helps Sage understand your needs and personalize your experience.' },
              { step: '2', title: 'Meet Sage', desc: 'Your AI therapist greets you with warmth and dives straight into what you\'re going through.' },
              { step: '3', title: 'Feel Better', desc: 'Use tools like mood tracking, journaling, and daily check-ins to build lasting wellness.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white mb-4 serif"
                  style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}>
                  {s.step}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="serif text-3xl md:text-4xl font-bold text-center mb-10">Real stories, real healing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4 italic" style={{ color: 'var(--text-primary)' }}>"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-16 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="serif text-3xl md:text-4xl font-bold mb-4">Affordable plans for every budget</h2>
          <p className="mb-10" style={{ color: 'var(--text-secondary)' }}>All plans include access to Sage 24/7. No hidden fees.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Basic', price: '$4.99', color: '#059669', features: ['10 AI sessions/month', 'Mood tracker', 'Crisis support'] },
              { name: 'Standard', price: '$7.99', color: '#7c3aed', popular: true, features: ['Unlimited sessions', 'Mood tracker', 'Journal', 'Session history'] },
              { name: 'Premium', price: '$9.99', color: '#0891b2', features: ['Everything in Standard', 'Priority responses', 'Weekly AI report', 'Download summaries'] },
            ].map((plan, i) => (
              <div key={i} className={`card relative ${plan.popular ? 'ring-2 ring-violet-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: '#7c3aed' }}>Most Popular</div>
                )}
                <div className="serif text-2xl font-bold" style={{ color: plan.color }}>{plan.price}</div>
                <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>/month</div>
                <div className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{plan.name}</div>
                <ul className="text-sm space-y-2 mb-4">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check size={13} style={{ color: plan.color }} className="flex-shrink-0" />
                      <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link to="/pricing" className="inline-block mt-8">
            <button className="btn-primary">View Full Pricing →</button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="serif text-3xl md:text-4xl font-bold text-center mb-10">Frequently asked questions</h2>
          {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="serif text-3xl md:text-5xl font-bold text-white mb-4">
            Your mental health matters.
          </h2>
          <p className="text-lg mb-8" style={{ color: '#94a3b8' }}>
            Start your healing journey today. Sage is waiting to listen.
          </p>
          <Link to="/signup">
            <button className="btn-primary text-lg px-10 py-4">Begin for Free →</button>
          </Link>
          <p className="text-xs mt-4" style={{ color: '#64748b' }}>
            ⚠️ Sage is an AI and not a licensed therapist. For clinical care, please consult a mental health professional.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
