const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET all doctors
// You can also add query params to filter by specialty, location, etc.
router.get('/', async (req, res) => {
    try {
        const { search, specialty, city, limit = 20, page = 1 } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (specialty) {
            query.specialty = { $regex: specialty, $options: 'i' };
        }
        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }

        const doctors = await Doctor.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
            
        const total = await Doctor.countDocuments(query);

        res.status(200).json({
            doctors,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error while fetching doctors' });
    }
});

// GET a specific doctor by ID
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
