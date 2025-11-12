import React from "react";

const KPI = ({ title, value }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <h2 style={styles.value}>{value}</h2>
    </div>
  );
};

const styles = {
  card: {
    flex: "1",
    minWidth: "260px",
    padding: "20px",
    margin: "10px",
    borderRadius: "12px",
    background: "#ffffff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  title: {
    color: "#3b3b3b",
    fontSize: "15px",
    fontWeight: "500",
    marginBottom: "10px",
    textAlign: "center",
  },
  value: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0C3B2E",
    margin: 0,
  },
};

// Optional: Add hover animation (works in modern browsers)
styles.card[':hover'] = {
  transform: "translateY(-4px)",
  boxShadow: "0 6px 14px rgba(0,0,0,0.1)",
};

export default KPI;
