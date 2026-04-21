const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper: delay for ms milliseconds
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const predictHealthRisks = async (patientData) => {
  const modelName = "gemini-1.5-flash-latest"; // Using 1.5-flash for higher stability & quota
  const model = genAI.getGenerativeModel({ model: modelName });

  // Build a complete symptom list from both checkboxes and free-text
  const allSymptoms = [
    ...(patientData.symptoms || []),
    ...(patientData.otherSymptoms ? [patientData.otherSymptoms] : [])
  ].filter(Boolean);

  const symptomsList = allSymptoms.length > 0 ? allSymptoms.join(', ') : 'None reported';

  const existingConditions = [
    ...(patientData.medicalHistory || []),
    ...(patientData.otherDiseases ? [patientData.otherDiseases] : [])
  ].filter(Boolean);

  const conditionsList = existingConditions.length > 0 ? existingConditions.join(', ') : 'None reported';

  // Calculate BMI for extra context
  const heightM = patientData.height / 100;
  const bmi = (patientData.weight / (heightM * heightM)).toFixed(1);

  const prompt = `
    You are a medical AI risk analyzer. Analyze this patient's data and generate 3-5 health risk predictions.
    
    PATIENT PROFILE:
    - Age: ${patientData.age} years old
    - Gender: ${patientData.gender}
    - Height: ${patientData.height} cm | Weight: ${patientData.weight} kg | BMI: ${bmi}
    
    CURRENT SYMPTOMS: ${symptomsList}
    
    EXISTING CONDITIONS / MEDICAL HISTORY: ${conditionsList}

    LIFESTYLE FACTORS:
    - Sleep: ${patientData.sleepHours} hours/night
    - Stress Level: ${patientData.stressLevel} (scale 1-4, where 1=Low, 4=Very High)
    - Physical Activity: ${patientData.activityLevel} days/week
    - Diet Type: ${patientData.dietType}

    CRITICAL INSTRUCTIONS:
    1. Each risk MUST be directly based on the patient's specific symptoms (${symptomsList}) and existing conditions (${conditionsList}).
    2. Risk percentages must reflect the actual severity — if someone reports "Chest Pain" + has "Hypertension", cardiovascular risk should be HIGH (60-85%).
    3. Connect each risk to the specific symptoms and conditions reported. Do NOT generate generic risks unrelated to the patient's data.
    4. The "reason" field must explicitly mention which of the patient's symptoms/conditions contribute to this risk.
    5. Prevention tips must be actionable and specific to the patient's lifestyle factors.
    6. The summary must reference the patient's actual symptoms and conditions, not be generic text.

    Return ONLY a valid JSON object (no markdown, no explanation, no backticks) in this exact structure:
    {
      "risks": [
        {
          "condition": "Specific Condition Name",
          "riskPercentage": 0-100,
          "level": "Low" | "Medium" | "High",
          "reason": "Explanation referencing patient's specific symptoms and conditions",
          "prevention": ["Specific tip 1", "Specific tip 2", "Specific tip 3"]
        }
      ],
      "summary": "Personalized health outlook referencing the patient's actual symptoms and conditions"
    }

    IMPORTANT: Do NOT diagnose. Return ONLY raw JSON. No markdown fencing.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    console.log(`AI Prediction attempt 1...`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cleanup markdown fencing if Gemini adds it
    let jsonString = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    // Try to extract JSON if there's extra text around it
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }

    const parsed = JSON.parse(jsonString);

    // Validate the response structure
    if (!parsed.risks || !Array.isArray(parsed.risks) || parsed.risks.length === 0) {
      throw new Error("AI returned invalid risk data structure");
    }

    console.log(`AI Prediction succeeded with ${parsed.risks.length} risks`);
    return parsed;

  } catch (error) {
    const isForbidden = error?.message?.includes('403') || error?.status === 403;
    if (isForbidden) {
        console.error("AI Service Error: 403 Forbidden (Check API Key Permissions)");
    } else {
        console.error("AI Service Error:", error.message);
    }

    // SMART FALLBACK: Generate valid response structure using local logic if AI fails
    console.log("Switching to Smart Fallback protocol...");

    const allSymptomsFallback = [...(patientData.symptoms || []), patientData.otherSymptoms].filter(Boolean);
    const symptomsStr = allSymptomsFallback.join(', ').toLowerCase();

    // Generate risk based on actual symptoms
    const fallbackRisks = [];

    // --- Enhanced Symptom-to-Disease Mapping ---
    const symptomMap = [
      {
        triggers: ['fever', 'chills', 'sweating'],
        condition: "Potential Viral Infection / Malaria",
        risk: 75,
        level: "High",
        reason: "Reported high fever and chills are classic signs of viral infections or mosquito-borne diseases like Malaria.",
        prevention: ["Monitor temperature every 4 hours", "Stay hydrated with electrolytes", "Consult a doctor for blood tests"]
      },
      {
        triggers: ['chest pain', 'shortness of breath', 'palpitations'],
        condition: "Cardiovascular Strain",
        risk: 80,
        level: "High",
        reason: "Chest pain and breathing difficulties are serious symptoms requiring immediate medical attention.",
        prevention: ["Avoid physical exertion immediately", "Monitor blood pressure", "Seek emergency care if pain persists"]
      },
      {
        triggers: ['headache', 'nausea', 'dizziness', 'sensitivity to light'],
        condition: "Migraine / Neurological Stress",
        risk: 60,
        level: "Medium",
        reason: "Combination of headache and nausea often indicates migraines or severe tension headaches.",
        prevention: ["Rest in a dark, quiet room", "Limit screen time", "Maintain regular sleep schedule"]
      },
      {
        triggers: ['cough', 'runny nose', 'sore throat', 'congestion'],
        condition: "Respiratory Infection (Flu/Cold)",
        risk: 65,
        level: "Medium",
        reason: "Upper respiratory symptoms suggest a cold or influenza virus.",
        prevention: ["Steam inhalation", "Warm saline gargle", "Isolate to prevent spreading"]
      },
      {
        triggers: ['stomach pain', 'vomiting', 'diarrhea', 'bloating'],
        condition: "Gastrointestinal Distress",
        risk: 55,
        level: "Medium",
        reason: "Digestive symptoms may indicate food poisoning, gastritis, or viral gastroenteritis.",
        prevention: ["Eat bland foods (BRAT diet)", "Avoid dairy and spicy foods", "Drink plenty of water"]
      },
      {
        triggers: ['joint pain', 'muscle pain', 'swelling'],
        condition: "Musculoskeletal Inflammation",
        risk: 50,
        level: "Medium",
        reason: "Persistent joint or muscle pain can signal inflammation, arthritis, or overexertion.",
        prevention: ["Apply hot/cold packs", "Gentle stretching", "Rest affected areas"]
      }
    ];

    // Check for specific matches
    let symptomMatches = 0;
    symptomMap.forEach(rule => {
      const hasMatch = rule.triggers.some(trigger => symptomsStr.includes(trigger));
      if (hasMatch) {
        fallbackRisks.push({
          condition: rule.condition,
          riskPercentage: rule.risk,
          level: rule.level,
          reason: rule.reason,
          prevention: rule.prevention
        });
        symptomMatches++;
      }
    });

    // If no specific symptoms matched but symptoms exist, add a general one
    if (symptomMatches === 0 && allSymptomsFallback.length > 0) {
      fallbackRisks.push({
        condition: "Undiagnosed Symptom Pattern",
        riskPercentage: 40,
        level: "Medium",
        reason: `Symptoms reported (${symptomsStr}) require clinical evaluation to rule out underlying causes.`,
        prevention: ["Track symptom severity", "Consult a general physician", "Maintain general hygiene"]
      });
    }

    // Protocol: Lifestyle factors (Always add at least one lifestyle risk if valid)
    // Recalculate BMI for fallback context if needed, or use the 'bmi' variable from outer scope
    const bmiFallbackValue = parseFloat(bmi); // Use the already calculated BMI from the outer scope
    if (patientData.stressLevel > 2 || patientData.sleepHours < 6) {
      fallbackRisks.push({
        condition: "Lifestyle-Induced Fatigue",
        riskPercentage: 55,
        level: "Medium",
        reason: `High stress and low sleep (${patientData.sleepHours}h) compromise immunity and recovery.`,
        prevention: ["Prioritize 7h+ sleep", "Daily stress management", "Reduce caffeine intake"]
      });
    } else if (bmiFallbackValue > 25 || patientData.activityLevel < 2) {
      fallbackRisks.push({
        condition: "Metabolic Concern",
        riskPercentage: 45,
        level: "Low",
        reason: "Sedentary lifestyle factors may increase long-term metabolic risks.",
        prevention: ["Increase daily activity", "Regular health screenings", "Balanced nutritional intake"]
      });
    }

    // Ensure we have at least 2 risks
    if (fallbackRisks.length < 2) {
      fallbackRisks.push({
        condition: "General Health Maintenance",
        riskPercentage: 15,
        level: "Low",
        reason: "Routine health monitoring is recommended even with mild symptoms.",
        prevention: ["Annual physical exam", "Stay up to date with vaccinations", "Balanced diet"]
      });
    }

    return {
      risks: fallbackRisks.slice(0, 4), // Return top 4 risks
      summary: `(Preliminary Analysis) Based on your symptoms of ${symptomsStr}, we have identified potential matches for ${fallbackRisks.map(r => r.condition).join(' or ')}. Please consult a doctor for confirmation.`
    };
  }
};

module.exports = { predictHealthRisks };
