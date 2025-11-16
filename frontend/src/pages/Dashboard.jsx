import React, { useEffect, useState } from "react";
import {
  fetchSummary,
  fetchTrend,
  fetchByRegion,
  fetchBySalesperson,
} from "../api";

import RevenueTrend from "../components/Charts/RevenueTrend";
import RegionPie from "../components/Charts/RegionPie";
import SalespersonBar from "../components/Charts/SalespersonBar";
import Filters from "../components/Filters";
import Sidebar from "../components/Sidebar";
import Products from "../components/Products";
import Orders from "../components/Orders";


import "./Dashboard.css";

// KPI Component
function KPI({ title, value, color, isCurrency }) {
  return (
    <div className="kpi-card" style={{ borderTop: `5px solid ${color}` }}>
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">
        {isCurrency
          ? `₹ ${Number(value || 0).toLocaleString("en-IN")}`
          : Number(value || 0).toLocaleString("en-IN")}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [byRegion, setByRegion] = useState([]);
  const [bySales, setBySales] = useState([]);
  const [filters, setFilters] = useState({
    region: "",
    salesPerson: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPage, setSelectedPage] = useState("dashboard");

  // Fetch dashboard data
  useEffect(() => {
    if (selectedPage !== "dashboard") return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [sum, tr, reg, sal] = await Promise.all([
          fetchSummary(filters),
          fetchTrend(filters),
          fetchByRegion(filters),
          fetchBySalesperson(filters),
        ]);

        setSummary(sum || {});
        setTrend(tr || []);
        setByRegion(reg || []);
        setBySales(sal || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, selectedPage]);

  // -------------------------------
  // 📤 Upload Excel Handler
  // -------------------------------
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✔ Excel uploaded successfully!");
        window.location.reload();
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar onSelect={setSelectedPage} />

      <div style={styles.main}>
        {selectedPage === "dashboard" && (
          <div className="dashboard-container">

            <div style={styles.topBar}>
              <h2 style={styles.heading}>Visualize, Analyze, and Grow 🚀</h2>

              {/* ⭐ Upload button moved here: right corner */}
              <div>
                <label
                  htmlFor="excelUpload"
                  style={styles.uploadBtn}
                >
                  {uploading ? "Uploading..." : "📤 Upload Excel"}
                </label>

                <input
                  id="excelUpload"
                  type="file"
                  accept=".xlsx, .xls"
                  style={{ display: "none" }}
                  onChange={handleUpload}
                />
              </div>
            </div>

            {/* Filters under top bar */}
            <Filters filters={filters} setFilters={setFilters} />

            {loading && <p className="loading-text">Loading data...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && (
              <>
                <div className="kpi-section">
                  <KPI
                    title="Total Revenue"
                    value={summary?.totalRevenue}
                    color="#4F46E5"
                    isCurrency={true}
                  />
                  <KPI
                    title="Total Sales"
                    value={summary?.totalDeals}
                    color="#10B981"
                    isCurrency={false}
                  />
                  <KPI
                    title="Avg Deal Value"
                    value={summary?.avgDeal}
                    color="#F59E0B"
                    isCurrency={true}
                  />
                </div>

                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Revenue Trend</h3>
                    <RevenueTrend data={trend} />
                  </div>

                  <div className="right-charts">
                    <div className="chart-card">
                      <h3>Sales by Region</h3>
                      <RegionPie data={byRegion} />
                    </div>

                    <div className="chart-card">
                      <h3>Top Salespersons</h3>
                      <SalespersonBar data={bySales} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {selectedPage === "products" && (
          <div style={styles.pageContainer}>
            <Products />
          </div>
        )}

        {selectedPage === "orders" && (
          <div style={styles.pageContainer}>
            <Orders />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
  },
  main: {
    marginLeft: "230px",
    flexGrow: 1,
    padding: "20px",
    background: "#f8fafc",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  heading: {
    margin: 0,
    color: "#4f46e5",
    fontWeight: "bold",
  },
  uploadBtn: {
    background: "#4F46E5",
    color: "white",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  pageContainer: {
    marginTop: "0",
  },
};
