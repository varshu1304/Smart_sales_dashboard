// src/components/Sidebar.jsx
import React, { useState } from "react";
import {
  MdDashboard,
  MdBarChart,
  MdAssessment,
  MdSettings,
  MdShoppingBag,
  MdMenu,
} from "react-icons/md";
import "./Sidebar.css";

export default function Sidebar({ onSelect }) {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { id: "dashboard", name: "Dashboard", icon: <MdDashboard /> },
    { id: "products", name: "Products", icon: <MdShoppingBag /> },
    { id: "orders", name: "Orders", icon: <MdAssessment /> },
    { id: "performance", name: "Report", icon: <MdBarChart /> },
    { id: "settings", name: "Settings", icon: <MdSettings /> },
  ];

  const handleSelect = (id) => {
    setActive(id);
    onSelect(id);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* collapse toggle button */}
      <button
        className="collapse-btn"
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <MdMenu />
      </button>

      <ul className="sidebar-menu">
        {menu.map((item) => (
          <li
            key={item.id}
            className={`sidebar-item ${active === item.id ? "active" : ""}`}
            onClick={() => handleSelect(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="label">{item.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
