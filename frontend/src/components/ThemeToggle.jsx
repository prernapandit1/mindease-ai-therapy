import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../App';

export default function ThemeToggle({ className = '' }) {
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => setDark(!dark)}
      className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${className}`}
      style={{
        background: dark ? '#334155' : '#e2e8f0',
        color: dark ? '#f1f5f9' : '#0f172a',
        border: '1px solid var(--border)'
      }}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? (
        <>
          <Sun size={15} />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon size={15} />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
