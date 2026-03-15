import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Phone, X } from 'lucide-react';

export default function CrisisAlert({ onClose }) {
  return (
    <div className="rounded-2xl p-5 mb-4 fade-in"
      style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '2px solid #dc2626' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} color="white" />
          </div>
          <div>
            <h3 className="font-bold text-red-800 text-lg mb-1">You're not alone 💙</h3>
            <p className="text-red-700 text-sm mb-3">
              If you're having thoughts of hurting yourself, please reach out to a crisis counselor immediately. They're trained to help.
            </p>
            <div className="flex flex-col gap-2">
              <a href="tel:9152987821"
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold w-fit hover:bg-red-700 transition-colors">
                <Phone size={14} />
                iCall India: 9152987821
              </a>
              <a href="tel:18602662345"
                className="flex items-center gap-2 text-red-700 text-sm font-medium">
                <Phone size={12} />
                Vandrevala Foundation: 1860-2662-345
              </a>
              <a href="tel:9820466627"
                className="flex items-center gap-2 text-red-700 text-sm font-medium">
                <Phone size={12} />
                AASRA: 9820466627
              </a>
            </div>
            <Link to="/crisis" className="text-red-600 text-xs underline mt-2 block">
              View all crisis resources →
            </Link>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-red-400 hover:text-red-600">
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
