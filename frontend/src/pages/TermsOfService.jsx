import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12 w-full flex-1">
        <h1 className="serif text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Terms of Service</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>Last updated: January 2024</p>

        <div className="prose max-w-none space-y-6" style={{ color: 'var(--text-primary)' }}>
          <div className="card p-5">
            <h2 className="font-bold text-lg mb-2">⚠️ Important Disclaimer</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              MindEase and its AI therapist "Sage" are <strong>not a substitute for professional mental health care</strong>.
              Sage is an AI assistant trained on therapeutic techniques and is not a licensed therapist, psychologist, or medical professional.
              For clinical mental health treatment, please consult a qualified mental health professional.
              In a crisis, please call iCall at 9152987821 or your local emergency services.
            </p>
          </div>

          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing and using MindEase, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.'
            },
            {
              title: '2. Service Description',
              content: 'MindEase provides an AI-powered mental wellness platform including an AI companion (Sage), mood tracking, journaling, and educational resources. These services are for general wellness purposes only and do not constitute medical advice, diagnosis, or treatment.'
            },
            {
              title: '3. Eligibility',
              content: 'You must be at least 18 years of age to use MindEase. By registering, you confirm that you are 18 or older. If you are under 18, please use this service only with parental or guardian supervision and consent.'
            },
            {
              title: '4. User Responsibilities',
              content: 'You agree to: (a) provide accurate registration information; (b) maintain the confidentiality of your account credentials; (c) not use the service for any unlawful purpose; (d) not attempt to harm, harass, or manipulate the AI system; (e) seek emergency services if you are in immediate danger.'
            },
            {
              title: '5. AI Limitations',
              content: 'Sage is an AI and has limitations. Sage may not always provide accurate information, may misunderstand your situation, and cannot replace human judgment. Sage is programmed to detect crisis signals but this detection is not 100% reliable. Always seek professional help for serious mental health concerns.'
            },
            {
              title: '6. Subscription and Payments',
              content: 'Paid plans are billed monthly. All payments are processed securely via PayPal. You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. We offer a 7-day money-back guarantee for first-time subscribers.'
            },
            {
              title: '7. Privacy',
              content: 'Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information. We do not sell your personal data to third parties.'
            },
            {
              title: '8. Intellectual Property',
              content: 'All content, features, and functionality of MindEase are owned by MindEase and are protected by intellectual property laws. You may not copy, modify, or distribute our content without explicit permission.'
            },
            {
              title: '9. Limitation of Liability',
              content: 'MindEase is provided "as is" without warranties. To the maximum extent permitted by law, MindEase shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. This includes, but is not limited to, any harm arising from reliance on AI-generated content.'
            },
            {
              title: '10. DISHA Compliance',
              content: 'MindEase operates in compliance with the Digital Information Security in Healthcare Act (DISHA) guidelines for digital health platforms in India. We maintain appropriate safeguards for health-related user data.'
            },
            {
              title: '11. Governing Law',
              content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.'
            },
            {
              title: '12. Changes to Terms',
              content: 'We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the platform. Continued use after changes constitutes acceptance of the new terms.'
            },
            {
              title: '13. Contact',
              content: 'For questions about these Terms, please contact us at legal@mindease.app or through our support channels.'
            },
          ].map((section, i) => (
            <div key={i}>
              <h2 className="font-bold text-base mb-2">{section.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
