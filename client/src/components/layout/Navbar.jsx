"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                            MediGuide
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
                        <Link href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</Link>
                        <Link href="#about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</Link>
                        <Link href="#contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Contact</Link>
                        <div className="flex items-center gap-4 ml-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors">
                                        <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{user.name?.split(' ')[0] || 'User'}</span>
                                    </div>
                                    <button onClick={handleLogout} className="px-5 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">Login</Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-xl p-4 flex flex-col gap-4 md:hidden border-t">
                        <Link href="/" className="p-3 hover:bg-slate-50 font-medium text-slate-700 rounded-lg">Home</Link>
                        <Link href="#features" className="p-3 hover:bg-slate-50 font-medium text-slate-700 rounded-lg">Features</Link>
                        <Link href="#about" className="p-3 hover:bg-slate-50 font-medium text-slate-700 rounded-lg">About</Link>
                        <Link href="#contact" className="p-3 hover:bg-slate-50 font-medium text-slate-700 rounded-lg">Contact</Link>
                        <hr className="my-2 border-slate-100" />
                        {user ? (
                            <>
                                <div className="p-3 flex items-center gap-3 bg-slate-50 rounded-lg">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="font-semibold text-slate-900">{user.name || 'User Profile'}</span>
                                </div>
                                <button onClick={handleLogout} className="p-3 text-center font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">Logout</button>
                            </>
                        ) : (
                            <Link href="/login" className="p-3 text-center font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">Login</Link>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
