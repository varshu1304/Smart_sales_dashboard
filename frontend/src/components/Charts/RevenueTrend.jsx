import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function RevenueTrend({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

        <XAxis dataKey="period" stroke="#334155" />
        <YAxis
          stroke="#334155"
          tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
        />

        <Tooltip
          formatter={(v) => `₹ ${Number(v).toLocaleString()}`}
          contentStyle={{
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #bae6fd'
          }}
        />

        {/* Soft Glow Line */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ r: 5, fill: '#3B82F6' }}
          filter="url(#glow)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
