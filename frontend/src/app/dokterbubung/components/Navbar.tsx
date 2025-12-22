'use client';

import React, { useState } from 'react';
import { useHospital } from './DataProvider';
import { useRouter, usePathname } from 'next/navigation';
import { User, Bell, Menu, LogOut, Home } from 'lucide-react';

export default function Navbar() {
    const { currentUser, switchUser } = useHospital();
    const router = useRouter();
    const pathname = usePathname();
    const [showProfile, setShowProfile] = useState(false);

    const roleNames = {
        doctor: 'Dokter',
        pharmacist: 'Apoteker',
        admin: 'Logistik',
        public: 'Layar Antrean'
    };

    const handleRoleSwitch = (role: 'doctor' | 'pharmacist' | 'admin' | 'public') => {
        switchUser(role);
        const routes = {
            doctor: '/dokterbubung/dokter',
            pharmacist: '/dokterbubung/apoteker',
            admin: '/dokterbubung/logistik',
            public: '/dokterbubung/antrean'
        };
        router.push(routes[role]);
        setShowProfile(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-2xl z-40 backdrop-blur-sm">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Left: Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-black text-white">RS</span>
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg tracking-tight">RS Islam Indonesia</h1>
                        <p className="text-indigo-100 text-xs font-medium">Sistem Informasi Rumah Sakit</p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Back to Menu */}
                    {!pathname.includes('/dokterbubung/antrean') && pathname !== '/dokterbubung' && (
                        <button
                            onClick={() => router.push('/dokterbubung')}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-lg"
                        >
                            <Home size={18} />
                            Menu
                        </button>
                    )}

                    {/* Notification Bell */}
                    <button className="relative p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg transition-all shadow-lg">
                        <Bell size={20} className="text-white" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold shadow-lg animate-pulse">
                            3
                        </span>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfile(!showProfile)}
                            className="flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg transition-all shadow-lg"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <User size={18} className="text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-bold text-sm">{currentUser.name}</p>
                                <p className="text-indigo-100 text-xs">{roleNames[currentUser.role]}</p>
                            </div>
                        </button>

                        {showProfile && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden">
                                {/* Profile Header */}
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold">{currentUser.name}</p>
                                            <p className="text-xs text-indigo-100">{roleNames[currentUser.role]}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Role Switcher */}
                                <div className="p-3">
                                    <p className="text-xs font-bold text-slate-500 mb-2 px-2">GANTI ROLE</p>
                                    {currentUser.role !== 'doctor' && (
                                        <button
                                            onClick={() => handleRoleSwitch('doctor')}
                                            className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                                        >
                                            🩺 Dokter
                                        </button>
                                    )}
                                    {currentUser.role !== 'pharmacist' && (
                                        <button
                                            onClick={() => handleRoleSwitch('pharmacist')}
                                            className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                                        >
                                            💊 Apoteker
                                        </button>
                                    )}
                                    {currentUser.role !== 'admin' && (
                                        <button
                                            onClick={() => handleRoleSwitch('admin')}
                                            className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                                        >
                                            📦 Logistik
                                        </button>
                                    )}
                                    {currentUser.role !== 'public' && (
                                        <button
                                            onClick={() => handleRoleSwitch('public')}
                                            className="w-full text-left px-3 py-2 hover:bg-indigo-50 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                                        >
                                            📺 Layar Antrean
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
