const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const salesRouter = require('./routes/sales');
const uploadRouter = require('./routes/upload');   // ⭐ NEW

const app = express();
app.use(cors());
app.use(express.json());

// ------------------- Load CSV -------------------
let salesData = [];

const csvFilePath = path.join(__dirname, 'data', 'salesdata.csv');

function loadCSV() {
  salesData = [];
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => salesData.push(row))
    .on('end', () => console.log('🔄 CSV Reloaded. Rows:', salesData.length));
}

loadCSV(); // Initial load

// Re-load CSV whenever upload happens
app.post("/api/upload/reload", (req, res) => {
  loadCSV();
  res.json({ message: "CSV reloaded successfully" });
});

// Use upload API
app.use("/api/upload", uploadRouter);

// Attach data to request
app.use((req, res, next) => {
  req.salesData = salesData;
  next();
});

app.use('/api/sales', salesRouter);

// Root
app.get('/', (req, res) => res.send('Backend running'));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend on ${PORT}`));
