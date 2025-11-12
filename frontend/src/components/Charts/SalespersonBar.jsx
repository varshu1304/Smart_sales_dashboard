import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function SalespersonBar({ data }) {
  const chartData = data.map((d) => ({ name: d.salesperson, revenue: d.revenue }));
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#334155" />
        <YAxis stroke="#334155" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
        <Tooltip formatter={(v) => `₹ ${Number(v).toLocaleString()}`} />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#EC4899" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <Bar dataKey="revenue" barSize={25} fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
