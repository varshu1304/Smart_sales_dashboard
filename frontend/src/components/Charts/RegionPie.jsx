import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#A855F7'];

export default function RegionPie({ data }) {
  const pie = data.map((d) => ({ name: d.region, value: d.revenue }));
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={pie}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={90}
          label
        >
          {pie.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => `₹ ${Number(v).toLocaleString()}`} />
      </PieChart>
    </ResponsiveContainer>
  );
}
