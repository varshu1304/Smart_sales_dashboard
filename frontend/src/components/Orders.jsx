// src/components/Orders.jsx

import React, { useEffect, useState } from "react";
import { fetchOrders, fetchOrderSummary } from "../api";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import "./Orders.css"; // FIXED — use correct CSS

export default function Orders() {
  const [summary, setSummary] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

  useEffect(() => {
    const load = async () => {
      try {
        const [sum, ord] = await Promise.all([fetchOrderSummary(), fetchOrders()]);
        setSummary(sum);
        setOrders(ord);
      } catch (e) {
        console.error("Error loading orders:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="orders-container">
      <h2 className="orders-title"> Order Analytics</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="kpi-section">
            <div className="kpi-card">
              <h3>Total Orders</h3>
              <p>{summary.totalOrders || 0}</p>
            </div>
            <div className="kpi-card">
              <h3>Total Revenue</h3>
              <p>₹ {summary.totalRevenue?.toLocaleString("en-IN") || 0}</p>
            </div>
            <div className="kpi-card">
              <h3>Avg Order Value</h3>
              <p>₹ {summary.avgOrderValue?.toLocaleString("en-IN") || 0}</p>
            </div>
            <div className="kpi-card">
              <h3>Win Rate</h3>
              <p>{summary.winRate || 0}%</p>
            </div>
          </div>

          {/* CHARTS */}
          <div className="charts-grid">
            <div className="chart-card">
              <h3> Orders by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={summary.statusData || []}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={50}
                    outerRadius={90}
                    label
                  >
                    {(summary.statusData || []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3> Revenue by Salesperson</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orders}>
                  <XAxis dataKey="salesperson" />
                  <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`} />
                  <Tooltip formatter={(v) => `₹ ${v.toLocaleString()}`} />
                  <Bar dataKey="total" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-card">
            <h3>🧾 Order Details</h3>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Region</th>
                  <th>Client</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Units</th>
                  <th>Revenue (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice(0, 8).map((o, i) => (
                  <tr key={i}>
                    <td>{o.orderId}</td>
                    <td>{o.date}</td>
                    <td>{o.region}</td>
                    <td>{o.client}</td>
                    <td>{o.product}</td>
                    <td>{o.category}</td>
                    <td>{o.units}</td>
                    <td>{o.total.toLocaleString("en-IN")}</td>
                    <td>{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
