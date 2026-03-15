import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: '#94a3b8' }} className="mt-auto">
      {/* Crisis banner */}
      <div style={{ background: '#dc2626' }} className="py-3 text-center text-white text-sm">
        <Phone size={14} className="inline mr-2" />
        <strong>Mental Health Crisis?</strong> Call iCall: <a href="tel:9152987821" className="font-bold underline">9152987821</a> | Available 24/7
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}>
                <Heart size={14} color="white" fill="white" />
              </div>
              <span className="serif text-lg font-bold text-white">MindEase</span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered mental wellness for everyone. Therapy shouldn't be a luxury.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Platform</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/chat" className="hover:text-white transition-colors">Talk to Sage (AI)</Link>
              <Link to="/mood" className="hover:text-white transition-colors">Mood Tracker</Link>
              <Link to="/journal" className="hover:text-white transition-colors">Journal</Link>
              <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Support</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/crisis" className="hover:text-white transition-colors">Crisis Resources</Link>
              <a href="mailto:support@mindease.app" className="hover:text-white transition-colors">Contact Us</a>
              <span>iCall: 9152987821</span>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Legal</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3"
          style={{ borderColor: '#334155' }}>
          <p className="text-xs text-center md:text-left">
            © 2024 MindEase. Made with ❤️ for mental wellness.
          </p>
          <p className="text-xs text-center italic" style={{ color: '#64748b' }}>
            ⚠️ Sage is an AI assistant and not a licensed therapist. Please consult a mental health professional for clinical support. DISHA Guidelines Compliant.
          </p>
        </div>
      </div>
    </footer>
  );
}
