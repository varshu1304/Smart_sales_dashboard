import React from "react";

const Filters = ({ filters, setFilters }) => {
  // Update filter values on change
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.container}>
      {/* Region Filter */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Region:</label>
        <select
          name="region"
          value={filters.region}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">All Regions</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </select>
      </div>

      {/* Salesperson Filter */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Salesperson:</label>
        <select
          name="salesPerson"
          value={filters.salesPerson}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">All Salespersons</option>
          <option value="Rahul">Rahul</option>
          <option value="Meera">Meera</option>
          <option value="Aditya">Aditya</option>
          <option value="Sneha">Sneha</option>
        </select>
      </div>

      {/* Status Filter */}
      <div style={styles.filterGroup}>
        <label style={styles.label}>Status:</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="Closed-Won">Closed Won</option>
          <option value="Closed-Lost">Closed Lost</option>
          <option value="In Progress">In Progress</option>
        </select>
      </div>
    </div>
  );
};

// Inline styles for modern design
const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginBottom: "20px",
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    minWidth: "160px",
  },
  label: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "4px",
    fontWeight: "600",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#f9fafb",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

// Add hover effect dynamically
styles.select[':hover'] = {
  borderColor: "#6366F1",
};

export default Filters;
