const express = require('express');
const router = express.Router();
const { predictHealthRisks } = require('../services/healthPrediction');
const { generateChatResponse } = require('../services/chatService');
const { predictFutureDiseases } = require('../services/futurePrediction');

// POST /api/patient/assess
router.post('/assess', async (req, res) => {
    try {
        const patientData = req.body;

        // Basic validation
        if (!patientData.age || !patientData.gender) {
            return res.status(400).json({ error: "Missing required fields (age, gender)" });
        }

        // Call AI Service
        const aiResponse = await predictHealthRisks(patientData);

        // --- MONGODB INTEGRATION ---
        // Save assessment result if requested (optionally anonymized)
        const PatientRecord = require('../models/PatientRecord');
        const newRecord = new PatientRecord({
            userId: patientData.userId || null,
            patientData: {
                age: patientData.age,
                gender: patientData.gender,
                height: patientData.height,
                weight: patientData.weight,
                symptoms: patientData.symptoms,
                otherSymptoms: patientData.otherSymptoms,
                medicalHistory: patientData.medicalHistory,
                otherDiseases: patientData.otherDiseases,
                sleepHours: patientData.sleepHours,
                stressLevel: patientData.stressLevel,
                activityLevel: patientData.activityLevel,
                dietType: patientData.dietType
            },
            aiResults: aiResponse
        });

        await newRecord.save();
        // ---------------------------

        res.json({
            success: true,
            data: aiResponse,
            recordId: newRecord._id,
            timestamp: new Date().toISOString()
        });


    } catch (error) {
        console.error("Assessment Error:", error);
        res.status(500).json({
            error: "Failed to process health assessment",
            details: error.message
        });
    }
});

// POST /api/patient/chat - AI-powered doctor chat
router.post('/chat', async (req, res) => {
    try {
        const { messages, patientData, doctorName, doctorSpecialty } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array is required" });
        }

        const response = await generateChatResponse(messages, patientData, doctorName, doctorSpecialty);

        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({
            error: "Failed to generate chat response",
            details: error.message
        });
    }
});

// POST /api/patient/future-prediction - 5-year disease prediction
router.post('/future-prediction', async (req, res) => {
    try {
        const patientData = req.body;

        if (!patientData.age || !patientData.gender) {
            return res.status(400).json({ error: "Missing required patient data" });
        }

        const predictions = await predictFutureDiseases(patientData);

        res.json({
            success: true,
            data: predictions,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Future Prediction Error:", error);
        res.status(500).json({
            error: "Failed to generate future predictions",
            details: error.message
        });
    }
});

module.exports = router;


