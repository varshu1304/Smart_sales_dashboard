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
import Sidebar from "../components/Sidebar"; // 🆕 Sidebar added
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
  const [error, setError] = useState("");
  const [selectedPage, setSelectedPage] = useState("dashboard"); // 🆕 sidebar control

  // Fetch data whenever filters change
  useEffect(() => {
    if (selectedPage !== "dashboard") return; // fetch only for dashboard
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
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, selectedPage]);

  return (
    <div style={styles.layout}>
      {/* 🆕 Sidebar */}
      <Sidebar onSelect={setSelectedPage} />

      <div style={styles.main}>
        {selectedPage === "dashboard" && (
          <div className="dashboard-container">
            <h2
              style={{
                marginBottom: "10px",
                color: "#4f46e5",
                fontWeight: "bold",
              }}
            >
              Visualize, Analyze, and Grow 🚀
            </h2>

            {/* Filter Component */}
            <Filters filters={filters} setFilters={setFilters} />

            {loading && <p className="loading-text">Loading data...</p>}
            {error && <p className="error-text">{error}</p>}

            {/* KPI Section */}
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

                {/* Charts */}
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>📈 Revenue Trend</h3>
                    <RevenueTrend data={trend} />
                  </div>

                  <div className="right-charts">
                    <div className="chart-card">
                      <h3>🌍 Sales by Region</h3>
                      <RegionPie data={byRegion} />
                    </div>

                      <div className="chart-card">
                        <h3>🏅 Top Salespersons</h3>
                        <SalespersonBar data={bySales} />
                      </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 🆕 Other Pages */}
        {selectedPage === "reports" && (
          <div style={styles.pagePlaceholder}>📊 Reports Page</div>
        )}
        {selectedPage === "performance" && (
          <div style={styles.pagePlaceholder}>📈 Performance Page</div>
        )}
        {selectedPage === "settings" && (
          <div style={styles.pagePlaceholder}>⚙️ Settings Page</div>
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
    backgroundColor: "#f8fafc",
  },
  pagePlaceholder: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "bold",
    marginTop: "100px",
    color: "#4F46E5",
  },
};
