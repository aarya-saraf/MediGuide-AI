"use client";
import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import { User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'contact') {
            // Only allow numbers and max 10 digits
            const re = /^[0-9\b]+$/;
            if (value === '' || (re.test(value) && value.length <= 10)) {
                setFormData({ ...formData, [name]: value });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isLogin && formData.contact.length !== 10) {
            alert("Please enter a valid 10-digit contact number.");
            return;
        }

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log(isLogin ? "Login Successful:" : "Signup Successful:", data);
                // Store user info in localStorage
                localStorage.setItem('user', JSON.stringify(data.user || { id: data.userId, name: formData.name, email: formData.email }));
                window.location.href = '/dashboard';
            } else {
                alert(data.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Auth Error:", error);
            alert("Could not connect to the server. Please ensure the backend is running.");
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row animate-fade-in-up">

                {/* Left Side - Image/Brand */}
                <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <Link href="/" className="text-2xl font-bold mb-2 block">MediGuide</Link>
                        <p className="text-blue-100">Your AI Health Companion</p>
                    </div>
                    <div className="relative z-10 space-y-4">
                        <h2 className="text-4xl font-bold leading-tight">
                            {isLogin ? "Welcome Back!" : "Join Our Community"}
                        </h2>
                        <p className="text-blue-100">
                            {isLogin ? "Access your health history and consult with top doctors." : "Start your journey towards a healthier life today."}
                        </p>
                    </div>
                    {/* Decorative Circles */}
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full opacity-50 blur-2xl"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400 rounded-full opacity-50 blur-2xl"></div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-1/2 p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">
                        {isLogin ? "Sign In to Account" : "Create New Account"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <div className="relative">
                                        <User className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                        <input
                                            type="text" name="name"
                                            value={formData.name} onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Contact Number</label>
                                    <div className="relative">
                                        <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                        <input
                                            type="tel" name="contact"
                                            value={formData.contact} onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="email" name="email"
                                    value={formData.email} onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                                <input
                                    type="password" name="password"
                                    value={formData.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-900"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full flex justify-center items-center gap-2 mt-4">
                            {isLogin ? "Sign In" : "Sign Up"} <ArrowRight className="w-4 h-4" />
                        </Button>

                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-slate-600 text-sm">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-600 font-bold ml-1 hover:underline outline-none"
                            >
                                {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
