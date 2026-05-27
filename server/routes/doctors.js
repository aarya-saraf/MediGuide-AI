const express = require('express');
const router = express.Router();
const doctorService = require('../services/doctorService');

// GET all doctors
router.get('/', async (req, res) => {
    try {
        const filters = {
            search: req.query.search,
            specialty: req.query.specialty,
            city: req.query.city,
            limit: req.query.limit || 20,
            page: req.query.page || 1
        };

        const result = await doctorService.getDoctors(filters);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ message: 'Server error while fetching doctors' });
    }
});

// GET recommended doctors (unique recommendations persisted)
router.get('/recommend', async (req, res) => {
    try {
        console.log('[DOCTORS] /recommend called - query:', req.query);
        const count = parseInt(req.query.count) || 3;
        const specialty = req.query.specialty || '';
        const specialties = specialty ? specialty.split(',').map(s => s.trim()).filter(Boolean) : [];
        const recommended = await doctorService.recommendDoctors(count, specialties);
        res.status(200).json({ doctors: recommended });
    } catch (error) {
        console.error('Error fetching recommended doctors:', error);
        res.status(500).json({ message: 'Server error while fetching recommendations' });
    }
});

// GET a specific doctor by numeric ID
// Constrain the route to digits so string routes like '/recommend' don't match
router.get('/id/:id', async (req, res) => {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);
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
