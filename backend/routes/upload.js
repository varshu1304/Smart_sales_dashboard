const express = require("express");
const multer = require("multer");
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");

const router = express.Router();

// Upload folder
const upload = multer({ dest: "uploads/" });

// Path to overwrite main CSV
const csvPath = path.join(__dirname, "../data/salesdata.csv");

// Upload + Convert XLSX → CSV
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert to CSV
    const csvData = xlsx.utils.sheet_to_csv(sheet);

    // Save to salesdata.csv
    fs.writeFileSync(csvPath, csvData);

    // Delete temp upload
    fs.unlinkSync(req.file.path);

    console.log("📌 Excel uploaded → CSV updated!");

    return res.json({
      message: "Excel uploaded successfully & dashboard updated!",
    });

  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ error: "Failed to upload & convert file" });
  }
});

module.exports = router;
