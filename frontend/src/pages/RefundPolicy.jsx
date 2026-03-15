import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RefundPolicy() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
        <h1 className="serif text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Refund Policy</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Last updated: January 2024</p>

        <div className="card p-5 mb-8" style={{ background: 'linear-gradient(135deg, #f0fdf4, #faf5ff)' }}>
          <h2 className="font-bold mb-2">💰 7-Day Money-Back Guarantee</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            We stand by MindEase. If you're not satisfied for any reason within your first 7 days on a paid plan, we'll refund you in full — no questions asked.
          </p>
        </div>

        {[
          { title: '1. 7-Day Refund Guarantee', content: 'First-time subscribers on any paid plan (Basic, Standard, or Premium) are eligible for a full refund within 7 days of their first payment. This guarantee applies once per customer.' },
          { title: '2. How to Request a Refund', content: 'Email refunds@mindease.app with your registered email address and reason for the refund (optional). We process refunds within 3-5 business days. Refunds are returned to your original PayPal account.' },
          { title: '3. Cancellations', content: 'You may cancel your subscription at any time. After cancellation, you retain access to your paid plan until the end of the current billing period. No partial refunds are issued for unused days after the 7-day guarantee period.' },
          { title: '4. Exceptions', content: 'Refunds may be denied in cases of: repeated abuse of the refund policy, violation of our Terms of Service, or fraudulent activity. Refunds are not available for accounts suspended due to policy violations.' },
          { title: '5. Contact', content: 'Questions about refunds? Email refunds@mindease.app or reach out through our support page.' },
        ].map((s, i) => (
          <div key={i} className="mb-5">
            <h2 className="font-bold text-base mb-2">{s.title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.content}</p>
          </div>
        ))}

        <div className="mt-8 text-center">
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>Questions?</p>
          <a href="mailto:support@mindease.app">
            <button className="btn-primary">Contact Support</button>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
