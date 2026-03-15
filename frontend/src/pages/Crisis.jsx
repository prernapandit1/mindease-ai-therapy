import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Globe, Heart, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const INDIA_RESOURCES = [
  { name: 'iCall', number: '9152987821', desc: 'Free counselling by trained professionals. Mon–Sat 8am–10pm.', color: '#dc2626' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 mental health helpline. Calls are free and confidential.', color: '#7c3aed' },
  { name: 'AASRA', number: '9820466627', desc: 'Crisis intervention 24/7. No judgment, just support.', color: '#0891b2' },
  { name: 'Snehi', number: '044-24640050', desc: 'Emotional support for those in distress.', color: '#059669' },
  { name: 'Vandrevala Whatsapp', number: '+91 1860-2662-345', desc: 'WhatsApp support available.', color: '#16a34a' },
];

const GLOBAL_RESOURCES = [
  { name: 'International Association for Suicide Prevention', url: 'https://www.iasp.info/resources/Crisis_Centres/', desc: 'Find a crisis centre near you worldwide.' },
  { name: 'Crisis Text Line (US)', desc: 'Text HOME to 741741 for free, 24/7 crisis support via text.' },
  { name: 'Samaritans (UK)', desc: 'Call 116 123 — 24/7 free to call.' },
  { name: 'Lifeline (Australia)', desc: 'Call 13 11 14 — 24/7 crisis support.' },
];

const GROUNDING = [
  { title: '5-4-3-2-1 Technique', steps: ['Name 5 things you can SEE', 'Name 4 things you can TOUCH', 'Name 3 things you can HEAR', 'Name 2 things you can SMELL', 'Name 1 thing you can TASTE'] },
  { title: 'Box Breathing', steps: ['Inhale slowly for 4 counts', 'Hold for 4 counts', 'Exhale slowly for 4 counts', 'Hold for 4 counts', 'Repeat 4 times'] },
  { title: 'Safe Place Visualisation', steps: ['Close your eyes and breathe slowly', 'Picture a place where you feel completely safe', 'Notice every detail — colours, sounds, smells', 'Feel the safety in your body', 'Stay here as long as you need'] },
];

export default function Crisis() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <Navbar />

      {/* Emergency banner */}
      <div style={{ background: '#dc2626' }} className="py-4 text-center text-white px-4">
        <div className="flex items-center justify-center gap-2 text-lg font-bold">
          <AlertTriangle size={20} />
          If you are in immediate danger, call 112 (India) or your local emergency number
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #d1fae5, #ede9fe)' }}>
            <Heart size={28} style={{ color: '#059669' }} />
          </div>
          <h1 className="serif text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            You are not alone
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Whatever you're going through, there are people who care and are trained to help. Please reach out.
          </p>
        </div>

        {/* India helplines */}
        <section className="mb-10">
          <h2 className="serif text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            🇮🇳 India — Crisis Helplines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INDIA_RESOURCES.map((r, i) => (
              <div key={i} className="card flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${r.color}20` }}>
                  <Phone size={18} style={{ color: r.color }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{r.name}</h3>
                  <a href={`tel:${r.number.replace(/[^0-9+]/g, '')}`}
                    className="text-lg font-bold block mb-1" style={{ color: r.color }}>
                    {r.number}
                  </a>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global */}
        <section className="mb-10">
          <h2 className="serif text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            🌍 International Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GLOBAL_RESOURCES.map((r, i) => (
              <div key={i} className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} style={{ color: '#0891b2' }} />
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{r.name}</h3>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{r.desc}</p>
                {r.url && (
                  <a href={r.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-emerald-600 mt-2 block">
                    Visit website →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Grounding techniques */}
        <section className="mb-10">
          <h2 className="serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Right now: Grounding techniques
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            If you're feeling overwhelmed, these techniques can help you feel more present and calm.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GROUNDING.map((t, i) => (
              <div key={i} className="card" style={{ background: i === 0 ? 'linear-gradient(135deg, #f0fdf4, #faf5ff)' : 'var(--card-bg)' }}>
                <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{t.title}</h3>
                <ol className="space-y-1.5">
                  {t.steps.map((step, j) => (
                    <li key={j} className="flex gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                        style={{ background: '#059669' }}>{j + 1}</span>
                      <span style={{ color: 'var(--text-primary)' }}>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Talk to Sage */}
        <div className="rounded-2xl p-6 text-center"
          style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
          <MessageCircle size={32} className="mx-auto mb-3 text-emerald-400" />
          <h2 className="serif text-2xl font-bold text-white mb-2">Want to talk right now?</h2>
          <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
            Sage is available 24/7 and can provide immediate support and guidance.
            Remember, Sage is not a crisis service — if you're in danger, please call a helpline.
          </p>
          <Link to="/chat">
            <button className="btn-primary">Talk to Sage →</button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
