const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[DEV_SERVER] ${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Mount doctor routes without requiring MongoDB
const doctorRoutes = require('./routes/doctors');
app.use('/api/doctors', doctorRoutes);

const PORT = process.env.DEV_API_PORT || 5001;
app.listen(PORT, () => {
  console.log(`Dev API server running on http://localhost:${PORT}`);
});
