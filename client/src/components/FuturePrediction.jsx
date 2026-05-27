"use client";
import React from 'react';
import { AlertTriangle, Shield, Clock, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FuturePrediction = ({ data, onClose }) => {
    const { currentHealthAnalysis, precautions, predictions, healthImprovementTips } = data;

    const getRiskColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'very high': return 'text-red-700 bg-red-100 border-red-300';
            case 'high': return 'text-red-600 bg-red-50 border-red-200';
            case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getProgressColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'very high': return 'bg-red-600';
            case 'high': return 'bg-red-500';
            case 'moderate': return 'bg-orange-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-slate-400';
        }
    };

    const getTimeframeColor = (timeframe) => {
        if (timeframe?.includes('1-2')) return 'bg-red-100 text-red-700';
        if (timeframe?.includes('2-3')) return 'bg-orange-100 text-orange-700';
        return 'bg-blue-100 text-blue-700';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-8 h-8" />
                                <h2 className="text-2xl font-bold">3-Year Health Prediction</h2>
                            </div>
                            <p className="text-purple-100 text-sm">AI-powered analysis based on your health profile</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Current Health Analysis */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            Current Health Analysis
                        </h3>
                        <p className="text-slate-600 leading-relaxed">{currentHealthAnalysis}</p>
                    </div>

                    {/* Precautions */}
                    {precautions && precautions.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                            <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Precautions
                            </h3>
                            <div className="space-y-3">
                                {precautions.map((precaution, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <p className="text-amber-800">{precaution}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Health Improvement Tips */}
                    {healthImprovementTips && healthImprovementTips.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                            <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Health Improvement Tips
                            </h3>
                            <div className="space-y-3">
                                {healthImprovementTips.map((tip, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        <p className="text-green-800">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Disease Predictions */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4 text-lg">3-Year Future Health Risk Prediction</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {predictions?.map((prediction, index) => (
                                <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <h4 className="font-bold text-slate-900 text-lg">{prediction.disease}</h4>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskColor(prediction.riskLevel)}`}>
                                                {prediction.riskLevel}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTimeframeColor(prediction.timeframe)}`}>
                                                <Clock className="w-3 h-3 inline mr-1" />
                                                {prediction.timeframe}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Risk Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-500">Risk Level</span>
                                            <span className="font-semibold text-slate-700">{prediction.riskPercentage}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${getProgressColor(prediction.riskLevel)}`}
                                                style={{ width: `${prediction.riskPercentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Reasoning */}
                                    <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
                                        {prediction.reasoning}
                                    </p>

                                    {/* Early Warnings */}
                                    {prediction.earlyWarnings && prediction.earlyWarnings.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3 text-orange-500" />
                                                Early Warning Signs
                                            </h5>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                {prediction.earlyWarnings.map((warning, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <ArrowRight className="w-3 h-3 mt-1 text-orange-400 flex-shrink-0" />
                                                        {warning}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Prevention */}
                                    {prediction.precautions && prediction.precautions.length > 0 && (
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                Precautions
                                            </h5>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                                {prediction.precautions.map((tip, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <span className="text-green-500">•</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                        <Link
                            href="/dashboard"
                            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-center hover:bg-indigo-700 transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-slate-100 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Continue Consultation
                        </button>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-center text-xs text-slate-400">
                        Disclaimer: These predictions are AI-generated based on your health profile and are for informational purposes only.
                        They do not constitute a medical diagnosis. Please consult a healthcare professional for personalized advice.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FuturePrediction;
