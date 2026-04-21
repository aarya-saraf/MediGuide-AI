const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional if some assessments are anonymous
    },
    patientData: {
        age: Number,
        gender: String,
        height: Number,
        weight: Number,
        symptoms: [String],
        otherSymptoms: String,
        medicalHistory: [String],
        otherDiseases: String,
        sleepHours: Number,
        stressLevel: Number,
        activityLevel: Number,
        dietType: String
    },
    aiResults: {
        risks: [{
            condition: String,
            riskPercentage: Number,
            level: String,
            reason: String,
            prevention: [String]
        }],
        summary: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);

module.exports = PatientRecord;
