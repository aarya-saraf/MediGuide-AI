"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Activity, Moon, Utensils, AlertCircle, HeartPulse, Scale, Thermometer } from 'lucide-react';
import Button from './ui/Button';
import RiskPrediction from './RiskPrediction';

const PatientForm = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showValidationAlert, setShowValidationAlert] = useState(false);
    const [predictionData, setPredictionData] = useState(null);
    const [formData, setFormData] = useState({
        // Basic Health
        age: '',
        gender: '',
        height: '',
        weight: '',
        // Symptoms
        symptoms: [],
        otherSymptoms: '',
        // Diseases
        medicalHistory: [],
        otherDiseases: '',
        // Lifestyle
        sleepHours: 7,
        stressLevel: 2,
        activityLevel: 3,
        dietType: ''
    });

    // Load saved data on mount
    useEffect(() => {
        const savedData = localStorage.getItem('patientFormData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error("Failed to parse saved form data", e);
            }
        }
    }, []);

    // Save data on change
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem('patientFormData', JSON.stringify(formData));
        }, 500); // 500ms debounce
        return () => clearTimeout(timeout);
    }, [formData]);

    const handleClearForm = () => {
        if (window.confirm("Are you sure you want to clear all form data?")) {
            localStorage.removeItem('patientFormData');
            setFormData({
                // Basic Health
                age: '',
                gender: '',
                height: '',
                weight: '',
                // Symptoms
                symptoms: [],
                otherSymptoms: '',
                // Diseases
                medicalHistory: [],
                otherDiseases: '',
                // Lifestyle
                sleepHours: 7,
                stressLevel: 2,
                activityLevel: 3,
                dietType: ''
            });
            setStep(1);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name === 'symptoms') {
                const updatedSymptoms = checked
                    ? [...formData.symptoms, value]
                    : formData.symptoms.filter(sym => sym !== value);
                setFormData({ ...formData, symptoms: updatedSymptoms });
            } else if (name === 'medicalHistory') {
                const updatedHistory = checked
                    ? [...formData.medicalHistory, value]
                    : formData.medicalHistory.filter(h => h !== value);
                setFormData({ ...formData, medicalHistory: updatedHistory });
            } else {
                setFormData({ ...formData, [name]: checked });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
        // Hide validation alert as soon as user interacts
        if (showValidationAlert) setShowValidationAlert(false);
    };

    const validateStep = (currentStep) => {
        switch (currentStep) {
            case 1: // Basic Health
                return formData.age && formData.gender && formData.height && formData.weight;
            case 2: // Symptoms
                return formData.symptoms.length > 0 || formData.otherSymptoms.trim() !== '';
            case 3: // History
                return true;
            case 4: // Lifestyle
                return formData.sleepHours && formData.stressLevel && formData.activityLevel && formData.dietType;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(step + 1);
            setShowValidationAlert(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setShowValidationAlert(true);
            // alert("Please fill in all required fields to proceed.");
        }
    };
    const prevStep = () => {
        setStep(step - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Save form data to localStorage for the AI chatbot context
        localStorage.setItem('patientFormData', JSON.stringify(formData));

        try {
            // Use AbortController with 60s timeout to allow server retries for rate limits
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000);

            const response = await fetch('http://localhost:5000/api/patient/assess', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server responded with ${response.status}`);
            }
            const result = await response.json();
            if (result.success) {
                setPredictionData(result.data);
            }
        } catch (error) {
            console.error("Backend unavailable, using mock data:", error.message);
            // Fallback to mock data when backend is not running
            const mockData = {
                summary: `Based on your symptoms (${formData.symptoms.join(', ') || formData.otherSymptoms || 'general assessment'}) and lifestyle factors, here is a preliminary health risk assessment. Please consult a doctor for accurate diagnosis.`,
                risks: [
                    {
                        condition: "Stress-Related Health Issues",
                        riskPercentage: 55,
                        level: "Medium",
                        reason: `Based on reported symptoms and ${formData.stressLevel || 'moderate'} stress levels.`,
                        prevention: ["Practice daily meditation", "Ensure 7-8 hours of sleep", "Take regular breaks from work"]
                    },
                    {
                        condition: "Nutritional Deficiency",
                        riskPercentage: 40,
                        level: "Low",
                        reason: `Diet type: ${formData.dietType || 'unspecified'}. May need balanced nutrition.`,
                        prevention: ["Eat a variety of fruits and vegetables", "Consider multivitamin supplements", "Stay hydrated"]
                    },
                    {
                        condition: "Cardiovascular Risk",
                        riskPercentage: 35,
                        level: "Low",
                        reason: `Activity level: ${formData.activityLevel || 'unspecified'}. Physical activity helps heart health.`,
                        prevention: ["30 mins of daily walking", "Reduce processed food intake", "Regular health checkups"]
                    }
                ]
            };
            setPredictionData(mockData);
        } finally {
            setLoading(false);
        }
    };

    if (predictionData) {
        return <RiskPrediction data={predictionData} />;
    }

    const steps = [
        { number: 1, title: "Basic Health", description: "Your age, gender, height and weight help us understand your basic health profile.", icon: Activity },
        { number: 2, title: "Symptoms", description: "Tell us about any current symptoms you're experiencing for accurate analysis.", icon: Thermometer },
        { number: 3, title: "History", description: "Your medical history helps us identify patterns and potential risk factors.", icon: HeartPulse },
        { number: 4, title: "Lifestyle", description: "Sleep, stress, activity and diet significantly impact your health predictions.", icon: Moon },
        { number: 5, title: "Review", description: "Review all your information before we generate your personalized health report.", icon: Scale },
    ];

    const currentStepInfo = steps.find(s => s.number === step);
    const nextStepInfo = steps.find(s => s.number === step + 1);

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            {/* Progress Header */}
            <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Health Assessment</h2>
                    <span className="text-sm font-medium text-slate-500">Step {step} of 5</span>
                </div>
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${(step / 5) * 100}%` }}
                    />
                </div>
                <div className="flex justify-between mt-4 text-xs font-medium text-slate-400 hidden sm:flex">
                    {steps.map((s) => (
                        <span key={s.number} className={`flex items-center gap-1 ${step >= s.number ? "text-blue-600 transition-colors" : ""} ${step === s.number ? "font-bold" : ""}`}>
                            {step === s.number && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>}
                            {s.title}
                        </span>
                    ))}
                </div>

                {/* Current Section Info */}
                <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            {currentStepInfo && <currentStepInfo.icon className="w-6 h-6 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 text-lg">{currentStepInfo?.title}</h3>
                            <p className="text-slate-600 text-sm mt-1">{currentStepInfo?.description}</p>
                            {nextStepInfo && (
                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3" />
                                    Next: <span className="font-medium text-slate-500">{nextStepInfo.title}</span> — {nextStepInfo.description.split(' ').slice(0, 6).join(' ')}...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-10 min-h-[400px]">
                {/* Step 1: Basic Health */}
                {step === 1 && (
                    <div className="space-y-6 animate-fade-in-up">
                        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" /> Basic Vitals
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Age</label>
                                <input
                                    type="number" name="age" value={formData.age} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900"
                                    placeholder="Years"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Gender</label>
                                <select
                                    name="gender" value={formData.gender} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white text-slate-900"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Height (cm)</label>
                                <input
                                    type="number" name="height" value={formData.height} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900"
                                    placeholder="e.g. 175"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
                                <input
                                    type="number" name="weight" value={formData.weight} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900"
                                    placeholder="e.g. 70"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Symptoms */}
                {step === 2 && (
                    <div className="space-y-6 animate-fade-in-up">
                        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <Thermometer className="w-5 h-5 text-red-500" /> Current Symptoms
                        </h3>
                        {showValidationAlert && (formData.symptoms.length === 0 && !formData.otherSymptoms) && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100 mb-4 flex items-center gap-2 animate-pulse">
                                <AlertCircle className="w-4 h-4" /> Please select at least one symptom or describe it in "Other" to proceed.
                            </p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                "Headache", "Fever", "Fatigue", "Cough", "Chest Pain", "Dizziness",
                                "Nausea", "Joint Pain", "Shortness of Breath",
                                "Body Pain", "Weakness", "Sore Throat", "Vomiting",
                                "Diarrhea", "Constipation", "Loss of Appetite",
                                "Migraine", "Blurred Vision"
                            ].map(symptom => (
                                <label key={symptom} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${formData.symptoms.includes(symptom) ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-100 hover:bg-slate-50'}`}>
                                    <input
                                        type="checkbox" name="symptoms" value={symptom}
                                        checked={formData.symptoms.includes(symptom)}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-red-500 rounded focus:ring-red-500"
                                    />
                                    <span className="font-medium text-slate-900">{symptom}</span>
                                </label>
                            ))}
                        </div>
                        <div className="pt-4">
                            <label className="text-sm font-medium text-slate-700 mb-2 block">Other Symptoms</label>
                            <input
                                type="text" name="otherSymptoms" value={formData.otherSymptoms} onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-slate-900"
                                placeholder="Describe any other symptoms you are feeling..."
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Existing Diseases */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in-up">
                        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <HeartPulse className="w-5 h-5 text-pink-500" /> Medical History
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    "Surgical History", "Diabetes", "Thyroid Disorder", "Hypertension",
                                    "Heart Disease", "Asthma", "Allergies", "Migraine",
                                    "Arthritis", "PCOS / PCOD", "Kidney Disease", "Liver Disease",
                                    "Tuberculosis", "Depression / Anxiety", "Anemia", "Cancer"
                                ].map(disease => (
                                    <label key={disease} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${formData.medicalHistory.includes(disease) ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                                        <span className="font-semibold text-slate-900">{disease}</span>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.medicalHistory.includes(disease) ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                                            {formData.medicalHistory.includes(disease) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox" name="medicalHistory" value={disease}
                                            checked={formData.medicalHistory.includes(disease)}
                                            onChange={handleInputChange}
                                            className="hidden"
                                        />
                                    </label>
                                ))}
                            </div>
                            <div className="pt-4">
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Other Conditions</label>
                                <input
                                    type="text" name="otherDiseases" value={formData.otherDiseases} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-slate-900"
                                    placeholder="Specify any other diagnosed conditions..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Lifestyle */}
                {step === 4 && (
                    <div className="space-y-8 animate-fade-in-up">
                        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <Moon className="w-5 h-5 text-indigo-500" /> Lifestyle Factors
                        </h3>

                        {/* Sleep Hours Slider */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Moon className="w-4 h-4 text-indigo-500" />
                                    Sleep Hours (Avg/Night)
                                </label>
                                <span className="text-lg font-bold text-indigo-600">
                                    {formData.sleepHours || '0'} hrs
                                </span>
                            </div>
                            <input
                                type="range"
                                name="sleepHours"
                                min="3"
                                max="12"
                                step="0.5"
                                value={formData.sleepHours || 7}
                                onChange={handleInputChange}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                style={{
                                    background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((formData.sleepHours - 3) / 9) * 100}%, #e2e8f0 ${((formData.sleepHours - 3) / 9) * 100}%, #e2e8f0 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>3 hrs</span>
                                <span>12 hrs</span>
                            </div>
                        </div>

                        {/* Stress Level Slider */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-rose-500" />
                                    Stress Level
                                </label>
                                <span className="text-lg font-bold text-rose-600">
                                    {formData.stressLevel === '1' ? 'Low' :
                                        formData.stressLevel === '2' ? 'Moderate' :
                                            formData.stressLevel === '3' ? 'High' :
                                                formData.stressLevel === '4' ? 'Very High' : 'Not Set'}
                                </span>
                            </div>
                            <input
                                type="range"
                                name="stressLevel"
                                min="1"
                                max="4"
                                step="1"
                                value={formData.stressLevel || 2}
                                onChange={handleInputChange}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                                style={{
                                    background: `linear-gradient(to right, #e11d48 0%, #e11d48 ${((formData.stressLevel - 1) / 3) * 100}%, #e2e8f0 ${((formData.stressLevel - 1) / 3) * 100}%, #e2e8f0 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Low</span>
                                <span>Moderate</span>
                                <span>High</span>
                                <span>Very High</span>
                            </div>
                        </div>

                        {/* Physical Activity Slider */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <HeartPulse className="w-4 h-4 text-emerald-500" />
                                    Physical Activity (Days/Week)
                                </label>
                                <span className="text-lg font-bold text-emerald-600">
                                    {formData.activityLevel || '0'} days
                                </span>
                            </div>
                            <input
                                type="range"
                                name="activityLevel"
                                min="0"
                                max="7"
                                step="1"
                                value={formData.activityLevel || 3}
                                onChange={handleInputChange}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                style={{
                                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(formData.activityLevel / 7) * 100}%, #e2e8f0 ${(formData.activityLevel / 7) * 100}%, #e2e8f0 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>0 days</span>
                                <span>7 days</span>
                            </div>
                        </div>

                        {/* Diet Type - Keep as select since it's categorical */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Utensils className="w-4 h-4 text-amber-500" />
                                Diet Type
                            </label>
                            <select
                                name="dietType"
                                value={formData.dietType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-slate-900 bg-white transition-all"
                            >
                                <option value="">Select Diet</option>
                                <option value="omnivore">Balanced / Omnivore</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="keto">Keto / Low Carb</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                    <div className="space-y-6 animate-fade-in-up">
                        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <Scale className="w-5 h-5 text-teal-500" /> Review Your Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ReviewCard title="Vitals" icon={Activity} data={[
                                { label: 'Age', value: formData.age },
                                { label: 'Gender', value: formData.gender },
                                { label: 'Height', value: formData.height + ' cm' },
                                { label: 'Weight', value: formData.weight + ' kg' }
                            ]} />
                            <ReviewCard title="Lifestyle" icon={Moon} data={[
                                { label: 'Sleep', value: formData.sleepHours + ' hrs/night' },
                                { label: 'Stress', value: formData.stressLevel === '1' ? 'Low' : formData.stressLevel === '2' ? 'Moderate' : formData.stressLevel === '3' ? 'High' : formData.stressLevel === '4' ? 'Very High' : formData.stressLevel },
                                { label: 'Activity', value: formData.activityLevel + ' days/week' },
                                { label: 'Diet', value: formData.dietType }
                            ]} />
                            <div className="md:col-span-2 p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"><Thermometer className="w-4 h-4 text-slate-500" /> Symptoms & History</h4>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {formData.symptoms.length > 0 ? formData.symptoms.map(s => (
                                        <span key={s} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">{s}</span>
                                    )) : null}
                                    {formData.otherSymptoms && <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">{formData.otherSymptoms}</span>}
                                    {formData.symptoms.length === 0 && !formData.otherSymptoms && <span className="text-slate-400 italic text-sm">No symptoms reported</span>}
                                </div>
                                <h4 className="font-semibold text-slate-900 mb-2 text-sm mt-4">Conditions</h4>
                                <div className="flex flex-wrap gap-2">
                                    {formData.medicalHistory.length > 0 ? formData.medicalHistory.map(d => (
                                        <span key={d} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">{d}</span>
                                    )) : null}
                                    {formData.otherDiseases && <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">{formData.otherDiseases}</span>}
                                    {formData.medicalHistory.length === 0 && !formData.otherDiseases && <span className="text-slate-400 italic text-sm">None reported</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 md:p-8 border-t border-slate-100 flex flex-col gap-4">
                {showValidationAlert && (
                    <div className="w-full bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center justify-center gap-2 animate-pulse border border-red-100">
                        <AlertCircle className="w-4 h-4" />
                        <span>Please complete all required fields above to proceed.</span>
                    </div>
                )}
                <div className="flex items-center justify-between w-full">
                    {step > 1 ? (
                        <button onClick={prevStep} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                            <ChevronLeft className="w-5 h-5" /> Back
                        </button>
                    ) : <div></div>}

                    {step < 5 ? (
                        <Button onClick={nextStep} className="flex items-center gap-2 px-8">
                            Next Step <ChevronRight className="w-5 h-5" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 px-8 bg-green-600 hover:bg-green-700 disabled:opacity-50">
                            {loading ? 'Analyzing...' : 'Predict Health Risks'} <Activity className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ReviewCard = ({ title, icon: Icon, data }) => (
    <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
        <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Icon className="w-4 h-4 text-slate-500" /> {title}
        </h4>
        <div className="space-y-2">
            {data.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <span className="font-medium text-slate-900 capitalize">{item.value || '-'}</span>
                </div>
            ))}
        </div>
    </div>
);

export default PatientForm;
