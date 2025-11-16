import React, { useEffect, useState } from "react";
import { fetchProducts, fetchProductSummary } from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";
import "./Products.css";

export default function Products() {
  const [summary, setSummary] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const [sum, prod] = await Promise.all([
          fetchProductSummary(),
          fetchProducts(),
        ]);
        setSummary(sum);
        setProducts(prod);
      } catch (err) {
        console.error("Error loading product data:", err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const COLORS = ["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#3B82F6"];

  return (
    <div className="products-container">
      <h2>Product Analytics</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          {/* KPI CARDS */}
          <div className="kpi-section">
            <div className="kpi-card">
              <h3>Total Products</h3>
              <p>{summary.totalProducts || 0}</p>
            </div>
            <div className="kpi-card">
              <h3>Total Units Sold</h3>
              <p>{summary.totalUnits || 0}</p>
            </div>
            <div className="kpi-card">
              <h3>Total Revenue</h3>
              <p>₹ {summary.totalRevenue?.toLocaleString("en-IN") || 0}</p>
            </div>
          </div>

          {/* CHARTS GRID */}
          <div className="charts-grid">
            {/* BAR CHART */}
            <div className="chart-card">
              <h3>Revenue by Product</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={products.slice(0, 8)}
                  margin={{ top: 20, right: 40, left: 30, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="product"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(v) => `₹ ${v.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#6366F1" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PIE CHART */}
            <div className="chart-card">
              <h3>Revenue by Category</h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={summary.byCategory || []}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {(summary.byCategory || []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `₹ ${v.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-card">
            <h3>Product Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Revenue (₹)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td>{p.product}</td>
                    <td>{p.category}</td>
                    <td>{p.units}</td>
                    <td>{p.revenue.toLocaleString("en-IN")}</td>
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
