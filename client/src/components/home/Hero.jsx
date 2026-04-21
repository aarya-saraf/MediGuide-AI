import React from 'react';
import Button from '../ui/Button';
import { ArrowRight, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-60" />
            <div className="absolute top-20 right-20 -z-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="lg:w-1/2 space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            AI-Powered Healthcare v1.0
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                            Guiding Patients to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Right Care</span>, Early.
                        </h1>

                        <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                            An AI-powered platform that helps you understand your health risks early, connects you with the right specialists, and provides personalized preventive advice.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button href="/login" className="flex items-center justify-center gap-2 h-14 px-8 text-lg">
                                Login to Assess Health <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 pt-8 text-slate-500 text-sm">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-400">U{i}</div>
                                ))}
                                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600">+2k</div>
                            </div>
                            <p>Trusted by 2,000+ early adopters</p>
                        </div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 bg-white rounded-2xl shadow-2xl shadow-blue-200/50 border border-slate-100 p-2 overflow-hidden">
                            <div className="bg-slate-50 rounded-xl p-8 space-y-6 aspect-video flex flex-col justify-center items-center text-center">
                                {/* Placeholder for App Interface or Illustration */}
                                <div className="p-4 bg-blue-100 rounded-full mb-4">
                                    <ArrowRight className="w-12 h-12 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Health Risk Analysis</h3>
                                <p className="text-slate-500">Processing your vitals and history...</p>
                                <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="w-2/3 h-full bg-blue-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
