const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    degree: {
        type: String,
        trim: true
    },
    specialty: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    rating: {
        type: String, // From DP Score (e.g., 100%)
        trim: true
    },
    patientCount: {
        type: String, // From NPV Value (e.g., (30 patients))
        trim: true
    },
    fees: {
        type: String, // From Consult Fee (e.g., ₹1200)
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
