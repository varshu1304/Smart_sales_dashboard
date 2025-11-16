import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#06B6D4', '#0EA5E9', '#38BDF8', '#0284C7', '#0BC5EA'];

export default function RegionPie({ data }) {
  const pie = data.map((d) => ({ name: d.region, value: d.revenue }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={pie}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={90}
          label
        >
          {pie.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          formatter={(v) => `₹ ${Number(v).toLocaleString()}`}
          contentStyle={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
