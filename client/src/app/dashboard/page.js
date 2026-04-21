"use client";
import React from 'react';
import Button from '../../components/ui/Button';
import { User, Activity, Calendar } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                {/* Welcome Header */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back, Patient!</h1>
                        <p className="text-slate-600">Ready to check your health status today?</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Profile Status</p>
                            <p className="font-bold text-blue-700">Active Member</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold">New Assessment</h2>
                            <p className="text-blue-100 max-w-sm">Take a quick AI-powered health checkup to analyze risks and get recommendations.</p>
                            <Button href="/assessment" variant="secondary" className="mt-4 border-none text-blue-800 hover:bg-white/90">
                                Get Started <span className="ml-2">→</span>
                            </Button>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Your Consultations</h2>
                            <p className="text-slate-600">View past sessions or schedule a new appointment with a specialist.</p>
                            <Button href="#" variant="outline" className="mt-4 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 w-full md:w-auto">
                                View History
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
