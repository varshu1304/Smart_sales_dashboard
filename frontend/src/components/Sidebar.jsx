// src/components/Sidebar.jsx
import React from "react";
import { FaTachometerAlt, FaChartLine, FaFileAlt, FaCog } from "react-icons/fa";

const Sidebar = ({ onSelect }) => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>SmartSales</h2>
      <ul style={styles.menu}>
        <li style={styles.item} onClick={() => onSelect("dashboard")}>
          <FaTachometerAlt style={styles.icon} /> Dashboard
        </li>
        <li style={styles.item} onClick={() => onSelect("performance")}>
          <FaChartLine style={styles.icon} /> Performance
        </li>
        <li style={styles.item} onClick={() => onSelect("reports")}>
          <FaFileAlt style={styles.icon} /> Reports
        </li>
        <li style={styles.item} onClick={() => onSelect("settings")}>
          <FaCog style={styles.icon} /> Settings
        </li>
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "230px",
    height: "100vh",
    backgroundColor: "white",
    color: "#00000",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    position: "fixed",
    left: 0,
    top: 0,
  },
  logo: {
    marginBottom: "40px",
    fontSize: "20px",
    fontWeight: "bold",
    textAlign: "center",
  },
  menu: {
    listStyleType: "none",
    padding: 0,
  },
  item: {
    padding: "12px 15px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "background 0.2s",
  },
  icon: {
    marginRight: "10px",
  },
};

export default Sidebar;
