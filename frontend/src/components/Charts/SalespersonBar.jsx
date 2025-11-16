import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function SalespersonBar({ data }) {
  const chartData = data.map((d) => ({
    name: d.salesperson,
    revenue: d.revenue
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        <XAxis dataKey="name" stroke="#334155" />
        <YAxis
          stroke="#334155"
          tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
        />

        <Tooltip
          formatter={(v) => `₹ ${Number(v).toLocaleString()}`}
          contentStyle={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px'
          }}
        />

        <defs>
          <linearGradient id="barGradientBlueCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.8} />
          </linearGradient>
        </defs>

        <Bar
          dataKey="revenue"
          barSize={28}
          radius={[8, 8, 0, 0]}
          fill="url(#barGradientBlueCyan)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
