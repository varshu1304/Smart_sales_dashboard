const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '..', 'data', 'salesdata.csv');

// Utility to read and parse CSV
function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(DATA_PATH)
      .pipe(csv())
      .on('data', (data) => {
        data.UnitsSold = parseInt(data.UnitsSold || 0, 10);
        data['UnitPrice(INR)'] = parseFloat(data['UnitPrice(INR)'] || 0);
        data['TotalAmount(INR)'] = parseFloat(data['TotalAmount(INR)'] || 0);
        results.push(data);
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// Helper: apply filters (region, salesPerson, status)
function applyFilters(data, filters) {
  return data.filter((row) => {
    if (filters.region && row.Region !== filters.region) return false;
    if (filters.salesPerson && row.SalesPerson !== filters.salesPerson)
      return false;
    if (filters.status && row.Status !== filters.status) return false;
    return true;
  });
}

// 🟢 GET /api/sales — paginated data (with optional filters)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const pageSize = Math.min(parseInt(req.query.pageSize || '200', 10), 1000);
  try {
    let all = await readCSV();
    all = applyFilters(all, req.query);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    res.json({
      total: all.length,
      page,
      pageSize,
      data: all.slice(start, end),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 GET /api/sales/summary — KPI values (filtered)
router.get('/summary', async (req, res) => {
  try {
    let all = await readCSV();
    all = applyFilters(all, req.query);

    const totalRevenue = all.reduce((s, r) => s + (r['TotalAmount(INR)'] || 0), 0);
    const totalDeals = all.length;
    const avgDeal = totalDeals ? Math.round(totalRevenue / totalDeals) : 0;
    const winCount = all.filter(
      (r) => (r.Status || '').toLowerCase() === 'closed-won'
    ).length;
    const winRate = totalDeals
      ? Math.round((winCount / totalDeals) * 10000) / 100
      : 0;

    res.json({ totalRevenue, totalDeals, avgDeal, winCount, winRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 GET /api/sales/trend — revenue grouped by month/year (filtered)
router.get('/trend', async (req, res) => {
  try {
    const period = req.query.period || 'monthly';
    let all = await readCSV();
    all = applyFilters(all, req.query);

    const map = {};
    all.forEach((r) => {
      const d = new Date(r.Date);
      if (isNaN(d)) return;
      const key =
        period === 'monthly'
          ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          : `${d.getFullYear()}`;
      map[key] = (map[key] || 0) + (r['TotalAmount(INR)'] || 0);
    });

    const arr = Object.keys(map)
      .sort()
      .map((k) => ({ period: k, revenue: map[k] }));

    res.json(arr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 GET /api/sales/by-region — revenue grouped by region (filtered)
router.get('/by-region', async (req, res) => {
  try {
    let all = await readCSV();
    all = applyFilters(all, req.query);

    const map = {};
    all.forEach((r) => {
      const key = r.Region || 'Unknown';
      map[key] = (map[key] || 0) + (r['TotalAmount(INR)'] || 0);
    });
    const arr = Object.keys(map).map((k) => ({ region: k, revenue: map[k] }));

    res.json(arr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 GET /api/sales/by-salesperson — revenue grouped by salesperson (filtered)
router.get('/by-salesperson', async (req, res) => {
  try {
    let all = await readCSV();
    all = applyFilters(all, req.query);

    const map = {};
    all.forEach((r) => {
      const key = r.SalesPerson || 'Unknown';
      map[key] = (map[key] || 0) + (r['TotalAmount(INR)'] || 0);
    });
    const arr = Object.keys(map)
      .map((k) => ({ salesperson: k, revenue: map[k] }))
      .sort((a, b) => b.revenue - a.revenue);

    res.json(arr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
