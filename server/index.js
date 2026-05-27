const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method === 'POST') console.log('Body:', { ...req.body, password: '***' });
    next();
});

// Basic Route

app.get('/', (req, res) => {
    res.send('MediGuide API is running');
});

// Routes
const patientRoutes = require('./routes/patient');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');

app.use('/api/patient', patientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);


// MongoDB Connection & Start Server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4 // Force IPv4
        });
        console.log('Connected to MongoDB Successfully!');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit if connection fails
    }
};

connectDB();


