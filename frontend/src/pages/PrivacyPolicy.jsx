import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
        <h1 className="serif text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Privacy Policy</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Last updated: January 2024</p>

        <div className="space-y-6" style={{ color: 'var(--text-primary)' }}>
          <div className="card p-5" style={{ background: 'linear-gradient(135deg, #f0fdf4, #faf5ff)' }}>
            <p className="text-sm leading-relaxed font-medium">
              🔒 Your privacy matters deeply to us. MindEase collects only what is necessary to provide you with mental wellness support. We never sell your data. Your conversations with Sage are private.
            </p>
          </div>

          {[
            {
              title: '1. What Data We Collect',
              content: `We collect:
• Account information: name, email address, encrypted password
• Onboarding assessment answers (to personalise Sage)
• Chat messages with Sage (stored to provide session context)
• Mood entries (scores, emotion tags, notes)
• Journal entries (titles and content)
• Payment information (processed by PayPal — we do not store card details)
• Usage data: session counts, last active date, streak information

We do NOT collect: your full name beyond what you provide, government IDs, location data (unless you share it), biometric data, or health records.`
            },
            {
              title: '2. How We Use Your Data',
              content: `Your data is used to:
• Provide and personalise the MindEase service
• Allow Sage to maintain session context and provide relevant responses
• Display your mood history and progress
• Process subscription payments
• Send service-related communications (not marketing without consent)
• Improve our services (anonymised, aggregated data only)
• Comply with legal obligations`
            },
            {
              title: '3. Data Storage and Security',
              content: `All data is stored on secure servers with:
• Encryption in transit (HTTPS/TLS)
• Encrypted database storage for sensitive fields
• Access controls limiting who can view your data
• Regular security audits

We retain your data for as long as your account is active. Upon account deletion, all personal data is removed within 30 days.`
            },
            {
              title: '4. Sharing Your Data',
              content: `We do not sell, trade, or rent your personal data. We may share data with:
• PayPal: for payment processing (subject to PayPal's privacy policy)
• Groq AI: for AI response generation (messages are processed but not stored by Groq)
• Law enforcement: only when legally required

We do not share your mental health data with insurance companies, employers, or third-party marketers.`
            },
            {
              title: '5. Mental Health Data',
              content: `We understand mental health data is especially sensitive. We apply additional protections:
• Chat conversations are stored only to provide session continuity
• Mood and journal data is never shared or used for advertising
• We comply with applicable mental health data protection laws including DISHA guidelines
• Mental health data is never used to profile you for commercial purposes`
            },
            {
              title: '6. Your Rights',
              content: `You have the right to:
• Access your personal data at any time (via account settings)
• Request corrections to inaccurate data
• Delete your account and all associated data
• Export your data in a portable format
• Withdraw consent for optional data processing
• Lodge a complaint with relevant data protection authorities

To exercise these rights, contact us at privacy@mindease.app`
            },
            {
              title: '7. Cookies',
              content: 'MindEase uses only essential cookies for authentication (JWT tokens in localStorage). We do not use tracking cookies or third-party advertising cookies.'
            },
            {
              title: '8. Children\'s Privacy',
              content: 'MindEase is not intended for users under 18. We do not knowingly collect data from minors. If we learn we have collected data from someone under 18, we will delete it promptly.'
            },
            {
              title: '9. DISHA Compliance',
              content: 'We comply with India\'s Digital Information Security in Healthcare Act (DISHA) guidelines. This includes maintaining appropriate security measures, limiting data collection to what is necessary, and ensuring users have control over their health-related data.'
            },
            {
              title: '10. Changes to This Policy',
              content: 'We will notify you of material changes to this policy via email or in-app notification at least 14 days before they take effect.'
            },
            {
              title: '11. Contact Us',
              content: 'For privacy concerns or to exercise your data rights: privacy@mindease.app'
            },
          ].map((s, i) => (
            <div key={i}>
              <h2 className="font-bold text-base mb-2">{s.title}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{s.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
