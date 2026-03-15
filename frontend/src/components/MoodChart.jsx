import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-3 py-2 text-sm shadow-lg"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
        <p className="font-semibold">{label}</p>
        <p style={{ color: '#059669' }}>Mood: {payload[0]?.value}/10</p>
      </div>
    );
  }
  return null;
};

export default function MoodChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-2xl"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
          No mood data yet. Start logging! 📊
        </p>
      </div>
    );
  }

  const chartData = data.map(entry => ({
    date: format(parseISO(entry.created_at), 'MMM d'),
    score: entry.score,
    tags: entry.emotion_tags?.join(', ')
  }));

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="score" stroke="#059669" strokeWidth={2}
            fill="url(#moodGradient)" dot={{ fill: '#059669', r: 3 }} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
