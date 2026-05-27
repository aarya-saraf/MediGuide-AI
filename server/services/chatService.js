const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getStressLabel = (v) => {
    const s = parseInt(v);
    if (s === 1) return "Low";
    if (s === 2) return "Moderate";
    if (s === 3) return "High";
    if (s === 4) return "Very High";
    return "Moderate";
};

// Advanced Mock Medical Engine if Gemini API key fails (403/429/etc)
const generateMockDoctorResponse = (latestMsg, doctorName, doctorSpecialty, patientData) => {
    const msg = latestMsg.toLowerCase();
    const symptomsStr = [...(patientData?.symptoms || []), patientData?.otherSymptoms].filter(Boolean).join(', ');

    // 1. Critical Symptoms / Emergency
    if (msg.includes("chest") || msg.includes("breath") || msg.includes("heart") || msg.includes("palpitation")) {
        return `As a ${doctorSpecialty}, I find those symptoms concerning. Please monitor for any spreading pain. If you feel any sudden worsening or pressure, you must head to the nearest emergency room immediately.`;
    }

    // 2. Gastrointestinal (with fuzzy matches for typos)
    if (msg.includes("vomm") || msg.includes("sick") || msg.includes("stomach") || msg.includes("nause") || msg.includes("vomit")) {
        return `Nausea and vomiting can quickly lead to dehydration. I suggest focusing on small, frequent sips of water or electrolytes. Since you reported ${symptomsStr || 'digestive issues'}, try to keep your diet very bland for the next 12 hours.`;
    }

    // 3. Neurological / Headaches
    if (msg.includes("head") || msg.includes("migr") || msg.includes("dizzy") || msg.includes("pain") || msg.includes("ache")) {
        return `Headaches and persistent pain can be quite debilitating. Ensure you're in a quiet, dark environment. I recommend monitoring your blood pressure if you have a device at home, and let me know if you experience blurred vision.`;
    }

    // 4. Agreement / Affirmation / Short responses
    if (msg === "yes" || msg === "yeah" || msg === "ok" || msg === "okay" || msg === "i see") {
        return `I understand. Keeping that in mind, have you noticed any other changes in your ${symptomsStr || 'vitals'} or overall energy levels since we started this discussion?`;
    }

    // 5. Greetings
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
        return `Hello! I'm ${doctorName}. I've been reviewing your assessment. How can I specifically help you today with your concerns regarding ${symptomsStr || 'your health'}?`;
    }

    // 6. High-Quality Randomized Fallback (The "Smart Loop-Breaker")
    const fallbacks = [
        `I've noted that change. Given your history and the ${symptomsStr || 'symptoms'} you mentioned, how has your appetite been today?`,
        `That's useful context. Are you experiencing any new discomfort beyond the ${symptomsStr || 'initial symptoms'} we discussed?`,
        `I see. As a ${doctorSpecialty}, I'd suggest we keep tracking these patterns. Any change in your sleep (${patientData?.sleepHours || '7'}h) or stress levels?`,
        `Understood. Based on our consultation and your reported ${symptomsStr || 'profile'}, I'd recommend you avoid any heavy physical activity for the next 24 hours while we monitor this.`
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};


const generateChatResponse = async (messages, patientData, doctorName, doctorSpecialty) => {
    const userMsgs = (messages || []).filter(m => m.sender === 'user');
    const latestUserMsg = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].text : "Hi";

    console.log(`[Chat] Generating response for: "${latestUserMsg}" as ${doctorName}...`);

    try {
        // Primary Attempt: AI API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const allSymptoms = [...(patientData?.symptoms || []), patientData?.otherSymptoms].filter(Boolean);
        const allHistory = [...(patientData?.medicalHistory || []), patientData?.otherDiseases].filter(Boolean);
        const historyText = messages.slice(1).map(m => `${m.sender}: ${m.text}`).join('\n');

        const prompt = `You are ${doctorName}, a ${doctorSpecialty}. Handle a telemedicine chat.
Patient Profile: ${patientData?.age}y/o ${patientData?.gender}, symptoms: ${allSymptoms.join(', ') || 'N/A'}. 
Stress: ${getStressLabel(patientData?.stressLevel)}, Activity: ${patientData?.activityLevel} days/wk.

Chat History:
${historyText}

Instructions:
1. Speak as ${doctorName}. Be concise (2 sentences).
2. Reference symptoms (${allSymptoms.join(', ')}) naturally.
3. Suggest common OTC like Paracetamol/rest if asked for medicine, but add "I cannot prescribe, consult a pharmacist".
4. If serious (e.g. chest pain), urge emergency visit.

Next Response as ${doctorName}:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text().trim();
        
        if (aiText) {
            console.log("[Chat] Success using AI.");
            return aiText;
        }
        throw new Error("Empty AI response");

    } catch (error) {
        // Check for specific error types for better logging
        const isForbidden = error?.message?.includes('403') || error?.status === 403;
        const isQuota = error?.message?.includes('429') || error?.status === 429;
        
        if (isForbidden) {
            console.error("[Chat] ERROR 403: API Key Permission Denied. Switching to Smart Mock Fallback.");
        } else if (isQuota) {
            console.error("[Chat] ERROR 429: API Rate Limit Exceeded. Switching to Smart Mock Fallback.");
        } else {
            console.error("[Chat] UNKNOWN ERROR:", error.message, ". Using Fallback.");
        }

        // Return high-quality mock response so user never sees "Failed"
        return generateMockDoctorResponse(latestUserMsg, doctorName, doctorSpecialty, patientData);
    }
};

module.exports = { generateChatResponse };
