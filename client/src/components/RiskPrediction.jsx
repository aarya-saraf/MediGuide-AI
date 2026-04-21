"use client";
import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Download, UserPlus, Info, TrendingUp } from 'lucide-react';
import Button from './ui/Button';
import DoctorRecommendation from './DoctorRecommendation';
import FuturePrecautions from './FuturePrecautions';

const RiskPrediction = ({ data }) => {
    const [showFuture, setShowFuture] = useState(false);
    const { risks, summary } = data;

    const getRiskColor = (level) => {
        switch (level.toLowerCase()) {
            case 'high': return 'text-red-600 bg-red-100 border-red-200';
            case 'medium': return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'low': return 'text-green-600 bg-green-100 border-green-200';
            default: return 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    const getProgressColor = (level) => {
        switch (level.toLowerCase()) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-orange-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            {/* Summary Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <Info className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">AI Health Analysis</h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">{summary}</p>
            </div>

            {/* Risk Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {risks.map((risk, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-slate-900">{risk.condition}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getRiskColor(risk.level)}`}>
                                {risk.level} Risk
                            </span>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-500">Risk Probability</span>
                                <span className="font-semibold text-slate-700">{risk.riskPercentage}%</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${getProgressColor(risk.level)}`} style={{ width: `${risk.riskPercentage}%` }}></div>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {risk.reason}
                        </p>

                        <div>
                            <h4 className="font-semibold text-slate-900 text-sm mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" /> Prevention
                            </h4>
                            <ul className="text-sm text-slate-600 space-y-1 ml-1">
                                {risk.prevention.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2">• {tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-b border-slate-100 pb-8">
                <Button className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" /> Consult Doctor Now
                </Button>
                <Button variant="secondary" onClick={() => setShowFuture(true)} className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    <TrendingUp className="w-5 h-5" /> 5-Year Future Prediction
                </Button>
            </div>

            {/* Doctor Recommendations */}
            <DoctorRecommendation risks={risks} />

            <p className="text-center text-xs text-slate-400 mt-8">
                Disclaimer: This AI-generated report is for information purposes only and does not constitute a medical diagnosis. Please consult a professional.
            </p>

            {/* Future Precautions Full-Screen Modal */}
            {showFuture && (
                <div className="fixed inset-0 z-50 bg-[#f8fafc] overflow-y-auto">
                    <div className="absolute top-4 right-4 z-[60]">
                        <button 
                            onClick={() => setShowFuture(false)}
                            className="p-3 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 hover:text-red-700 font-bold transition-all border border-red-100 ring-4 ring-white"
                        >
                            ✕ Close Dashboard
                        </button>
                    </div>
                    <FuturePrecautions />
                </div>
            )}
        </div>
    );
};

export default RiskPrediction;
