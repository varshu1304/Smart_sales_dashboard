import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function RevenueTrend({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="period" stroke="#334155" />
        <YAxis
          stroke="#334155"
          tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
        />
        <Tooltip
          formatter={(v) => `₹ ${Number(v).toLocaleString()}`}
          contentStyle={{ backgroundColor: '#f8fafc', borderRadius: '8px' }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#6366F1"
          strokeWidth={3}
          dot={{ r: 4, fill: '#6366F1' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
