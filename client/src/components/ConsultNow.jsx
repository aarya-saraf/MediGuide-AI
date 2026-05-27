"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Mic, Paperclip, MoreVertical, ChevronLeft, Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';
import FuturePrediction from './FuturePrediction';

const ConsultNow = ({ doctorId }) => {
    const [doctor, setDoctor] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingSeconds, setLoadingSeconds] = useState(0);
    const [patientData, setPatientData] = useState(null);
    const [showPrediction, setShowPrediction] = useState(false);
    const [predictionData, setPredictionData] = useState(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const messagesEndRef = useRef(null);
    const loadingTimerRef = useRef(null);

    // Handle mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch doctor details
    useEffect(() => {
        if (!doctorId) return;

        const fetchDoctor = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/doctors/id/${doctorId}`);
                const data = await response.json();
                setDoctor(data);
            } catch (error) {
                console.error("Failed to fetch doctor details:", error);
            }
        };

        fetchDoctor();
    }, [doctorId]);

    // Load patient data from localStorage on mount
    useEffect(() => {
        if (!doctor) return;

        const savedPatientData = localStorage.getItem('patientFormData');
        let parsed = null;
        if (savedPatientData) {
            try {
                parsed = JSON.parse(savedPatientData);
                setPatientData(parsed);
            } catch (e) {
                console.error('Failed to parse patient data:', e);
            }
        }

        // Tailor greeting based on whether assessment data is available
        const greeting = parsed
            ? `Hello! I'm ${doctor.name}, your ${doctor.specialty}. I've reviewed your health assessment — I can see you've reported symptoms including ${(parsed.symptoms || []).join(', ') || parsed.otherSymptoms || 'some concerns'}. How can I help you today?`
            : `Hello! I'm ${doctor.name}, your ${doctor.specialty}. I notice I don't have your health assessment on file yet. You can still ask me questions, but for the most personalized advice, please complete your health assessment first. How can I help you today?`;

        setMessages([{
            id: 1,
            text: greeting,
            sender: 'doctor',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    }, [doctor]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const newMessage = {
            id: messages.length + 1,
            text: inputText,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputText('');
        setIsLoading(true);
        setLoadingSeconds(0);

        // Tick every second so the user sees live feedback
        loadingTimerRef.current = setInterval(() => {
            setLoadingSeconds(s => s + 1);
        }, 1000);

        // 90s timeout — enough for the server to retry after a rate-limit delay
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000);

        try {
            const response = await fetch('http://localhost:5000/api/patient/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages,
                    patientData: patientData,
                    doctorName: doctor.name,
                    doctorSpecialty: doctor.specialty
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();

            if (data.success) {
                const doctorResponse = {
                    id: updatedMessages.length + 1,
                    text: data.response,
                    sender: 'doctor',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, doctorResponse]);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Chat error:', error);
            const isTimeout = error?.name === 'AbortError';
            const errorResponse = {
                id: updatedMessages.length + 1,
                text: isTimeout
                    ? "The doctor is taking unusually long to respond. Please try sending your message again."
                    : "I'm momentarily unavailable. Please try again in a few seconds.",
                sender: 'doctor',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            clearInterval(loadingTimerRef.current);
            setIsLoading(false);
            setLoadingSeconds(0);
        }
    };

    const handleEndConsultation = async () => {
        if (!patientData) {
            alert('No patient data available for prediction.');
            return;
        }

        setIsPredicting(true);

        try {
            const response = await fetch('http://localhost:5000/api/patient/future-prediction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData),
            });

            const data = await response.json();

            if (data.success) {
                setPredictionData(data.data);
                setShowPrediction(true);
            } else {
                throw new Error(data.error || 'Failed to get predictions');
            }
        } catch (error) {
            console.error('Prediction error:', error);
            alert('Failed to generate health predictions. Please try again.');
        } finally {
            setIsPredicting(false);
        }
    };

    if (!doctor) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    const doctorAvatar = doctor.name ? doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'DR';

    return (
        <div className="flex flex-col h-screen max-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Link href="/assessment" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                        {doctorAvatar}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{doctor.name}</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-green-600 font-medium truncate max-w-[150px]">{doctor.specialty} • Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <button className="p-2 hover:bg-slate-100 rounded-full hidden sm:block"><Phone className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-slate-100 rounded-full hidden sm:block"><Video className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical className="w-5 h-5" /></button>
                    <button
                        onClick={handleEndConsultation}
                        disabled={isPredicting}
                        className="ml-2 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50"
                    >
                        {isPredicting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">End & Predict</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {!patientData && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2">
                        <span className="text-amber-500 font-bold">⚠</span>
                        No health assessment found. <a href="/assessment" className="underline font-semibold hover:text-amber-900">Complete your assessment</a> for personalized advice.
                    </div>
                )}
                <div className="text-center text-xs text-slate-400 my-4">Today, {mounted ? new Date().toLocaleDateString() : '--/--/----'}</div>


                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl shadow-sm ${msg.sender === 'user'
                            ? 'bg-blue-100 text-slate-900 rounded-br-none border border-blue-200'
                            : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                            }`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-600' : 'text-slate-400'}`}>
                                {msg.time}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-bl-none p-4 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                <span className="text-sm text-slate-500">
                                    {loadingSeconds < 5
                                        ? `${doctor.name?.split(' ')[0]} is typing...`
                                        : loadingSeconds < 20
                                            ? `${doctor.name?.split(' ')[0]} is thinking... (${loadingSeconds}s)`
                                            : `Please wait, AI is processing... (${loadingSeconds}s)`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4 border-t border-slate-200">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"><Paperclip className="w-5 h-5" /></button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="w-full pl-5 pr-12 py-3 rounded-full border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-slate-50 text-slate-900 disabled:opacity-50"
                        />
                        <button
                            onClick={handleSendMessage}
                            className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!inputText.trim() || isLoading}
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>

                    <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"><Mic className="w-5 h-5" /></button>
                </div>
            </div>

            {/* 5-Year Prediction Modal */}
            {showPrediction && predictionData && (
                <FuturePrediction
                    data={predictionData}
                    onClose={() => setShowPrediction(false)}
                />
            )}
        </div>
    );
};

export default ConsultNow;
