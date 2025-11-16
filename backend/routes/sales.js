// backend/routes/sales.js

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// ✅ Load dataset
const csvPath = path.join(__dirname, "../data/salesdata.csv");
let salesData = [];

fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (row) => salesData.push(row))
  .on("end", () => console.log("✅ Sales dataset loaded successfully!"));

// Middleware
router.use((req, res, next) => {
  req.salesData = salesData;
  next();
});

// Helper
function applyFilters(data, filters) {
  return data.filter((row) => {
    if (filters.region && row.Region !== filters.region) return false;
    if (filters.salesPerson && row.SalesPerson !== filters.salesPerson) return false;
    if (filters.status && row.Status !== filters.status) return false;
    return true;
  });
}

// ------------------- DASHBOARD ROUTES -------------------

router.get("/", (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const pageSize = Math.min(parseInt(req.query.pageSize || "200", 10), 1000);
    const all = applyFilters(req.salesData, req.query);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    res.json({
      total: all.length,
      page,
      pageSize,
      data: all.slice(start, end),
    });
  } catch (err) {
    console.error("Error in /sales:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/summary", (req, res) => {
  try {
    const all = applyFilters(req.salesData, req.query);
    const totalRevenue = all.reduce((s, r) => s + (parseFloat(r["TotalAmount(INR)"]) || 0), 0);
    const totalDeals = all.length;
    const avgDeal = totalDeals ? Math.round(totalRevenue / totalDeals) : 0;
    const winCount = all.filter((r) => (r.Status || "").toLowerCase() === "closed-won").length;
    const winRate = totalDeals ? Math.round((winCount / totalDeals) * 10000) / 100 : 0;

    res.json({ totalRevenue, totalDeals, avgDeal, winCount, winRate });
  } catch (err) {
    console.error("Error in /summary:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/trend", (req, res) => {
  try {
    const all = applyFilters(req.salesData, req.query);
    const map = {};

    all.forEach((r) => {
      const d = new Date(r.Date);
      if (isNaN(d)) return;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + (parseFloat(r["TotalAmount(INR)"]) || 0);
    });

    const arr = Object.keys(map)
      .sort()
      .map((k) => ({ period: k, revenue: map[k] }));

    res.json(arr);
  } catch (err) {
    console.error("Error in /trend:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/by-region", (req, res) => {
  try {
    const all = applyFilters(req.salesData, req.query);
    const map = {};

    all.forEach((r) => {
      const key = r.Region || "Unknown";
      map[key] = (map[key] || 0) + (parseFloat(r["TotalAmount(INR)"]) || 0);
    });

    const arr = Object.keys(map).map((k) => ({ region: k, revenue: map[k] }));
    res.json(arr);
  } catch (err) {
    console.error("Error in /by-region:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/by-salesperson", (req, res) => {
  try {
    const all = applyFilters(req.salesData, req.query);
    const map = {};

    all.forEach((r) => {
      const key = r.SalesPerson || "Unknown";
      map[key] = (map[key] || 0) + (parseFloat(r["TotalAmount(INR)"]) || 0);
    });

    const arr = Object.keys(map)
      .map((k) => ({ salesperson: k, revenue: map[k] }))
      .sort((a, b) => b.revenue - a.revenue);

    res.json(arr);
  } catch (err) {
    console.error("Error in /by-salesperson:", err);
    res.status(500).json({ error: err.message });
  }
});

// ------------------- ✅ FIXED PRODUCT ROUTES -------------------

router.get("/products", (req, res) => {
  try {
    const all = req.salesData;
    const map = {};

    all.forEach(r => {
      const name = r.Product || "Unknown";
      const category = r.ProductCategory || "Other"; // ✅ FIXED
      const units = parseInt(r.UnitsSold || 0); // ✅ FIXED
      const revenue = parseFloat(r["TotalAmount(INR)"] || 0);

      if (!map[name]) map[name] = { product: name, category, units: 0, revenue: 0 };
      map[name].units += units;
      map[name].revenue += revenue;
    });

    const arr = Object.values(map).sort((a, b) => b.revenue - a.revenue);
    res.json(arr);
  } catch (err) {
    console.error("Error in /products:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/product-summary", (req, res) => {
  try {
    const all = req.salesData;

    const totalProducts = new Set(all.map(r => r.Product)).size;
    const totalUnits = all.reduce((s, r) => s + (parseInt(r.UnitsSold) || 0), 0); // ✅ FIXED
    const totalRevenue = all.reduce((s, r) => s + (parseFloat(r["TotalAmount(INR)"]) || 0), 0);

    const byCategoryMap = {};
    all.forEach(r => {
      const cat = r.ProductCategory || "Other"; // ✅ FIXED
      byCategoryMap[cat] = (byCategoryMap[cat] || 0) + (parseFloat(r["TotalAmount(INR)"]) || 0);
    });

    const byCategory = Object.entries(byCategoryMap).map(([category, revenue]) => ({
      category,
      revenue
    }));

    res.json({ totalProducts, totalUnits, totalRevenue, byCategory });
  } catch (err) {
    console.error("Error in /product-summary:", err);
    res.status(500).json({ error: err.message });
  }
});
// ------------------- ORDER ROUTES -------------------

router.get("/orders", (req, res) => {
  try {
    const all = req.salesData;

    const orders = all.map((r) => ({
      orderId: r.OrderID,
      date: r.Date,
      region: r.Region,
      client: r.ClientName,
      product: r.Product,
      category: r.ProductCategory,
      units: parseInt(r.UnitsSold) || 0,
      unitPrice: parseFloat(r["UnitPrice(INR)"]) || 0,
      total: parseFloat(r["TotalAmount(INR)"]) || 0,
      salesperson: r.SalesPerson,
      status: r.Status,
    }));

    res.json(orders);
  } catch (err) {
    console.error("Error in /orders:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/orders/summary", (req, res) => {
  try {
    const all = req.salesData;
    const totalOrders = all.length;
    const totalRevenue = all.reduce((s, r) => s + (parseFloat(r["TotalAmount(INR)"]) || 0), 0);
    const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
    const closedWon = all.filter((r) => (r.Status || "").toLowerCase() === "closed-won").length;
    const winRate = totalOrders ? Math.round((closedWon / totalOrders) * 10000) / 100 : 0;

    const byStatus = {};
    all.forEach((r) => {
      const status = r.Status || "Unknown";
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    const statusData = Object.entries(byStatus).map(([status, count]) => ({ status, count }));

    res.json({ totalOrders, totalRevenue, avgOrderValue, winRate, statusData });
  } catch (err) {
    console.error("Error in /orders/summary:", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/sales-vs-orders", (req, res) => {
  try {
    const all = applyFilters(req.salesData, req.query);
    const map = {};

    all.forEach(r => {
      const d = new Date(r.Date);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      if (!map[key]) map[key] = { period: key, orders: 0, revenue: 0 };

      map[key].orders += 1;
      map[key].revenue += parseFloat(r["TotalAmount(INR)"]) || 0;
    });

    res.json(Object.values(map).sort((a, b) => a.period.localeCompare(b.period)));
  } catch (err) {
    console.error("Error in /sales-vs-orders", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/top-regions", (req, res) => {
  try {
    const all = applyFilters(req.salesData, req.query);

    const map = {};
    all.forEach(r => {
      const region = r.Region || "Unknown";
      map[region] = (map[region] || 0) + (parseFloat(r["TotalAmount(INR)"]) || 0);
    });

    const result = Object.entries(map)
      .map(([region, revenue]) => ({ region, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5 only

    res.json(result);
  } catch (err) {
    console.error("Error in /top-regions", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/growth-trend", (req, res) => {
  try {
    const all = applyFilters(req.salesData, req.query);
    const map = {};

    all.forEach(r => {
      const d = new Date(r.Date);
      if (isNaN(d)) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + (parseFloat(r["TotalAmount(INR)"]) || 0);
    });

    const sorted = Object.keys(map).sort();
    const result = [];

    for (let i = 0; i < sorted.length; i++) {
      const month = sorted[i];
      const revenue = map[month];
      const prev = i === 0 ? null : map[sorted[i - 1]];
      const growth = prev ? ((revenue - prev) / prev) * 100 : 0;

      result.push({
        period: month,
        revenue,
        growth: Number(growth.toFixed(2)),
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Error in /growth-trend", err);
    res.status(500).json({ error: err.message });
  }
});

async function refreshSalesData() {
    try {
        const res = await fetch("http://localhost:5000/api/sales/summary");
        const data = await res.json();

        // Update totals
        document.getElementById("totalRevenue").innerText = data.totalRevenue;
        document.getElementById("totalQuantity").innerText = data.totalQuantity;
        document.getElementById("averagePrice").innerText = data.averagePrice;

        // 🔄 Refresh table or charts here also if you have them
        loadTable();
        loadCharts();

        console.log("Dashboard refreshed after upload.");
    } catch (err) {
        console.error("Error refreshing dashboard:", err);
    }
}


module.exports = router;
