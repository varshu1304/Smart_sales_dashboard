const express = require('express');
const cors = require('cors');
const salesRouter = require('./routes/sales');

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/sales', salesRouter);

// Root test route
app.get('/', (req, res) => {
  res.send('✅ Sales Analytics Backend Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend listening on port ${PORT}`));
