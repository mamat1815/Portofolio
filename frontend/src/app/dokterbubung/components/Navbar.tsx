'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Settings, LogOut, ChevronDown, Activity } from 'lucide-react';
import { useHospital } from './DataProvider';
import { UserRole } from '../types';

export default function Navbar() {
    const { currentUser, switchUser } = useHospital();
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleSwitchRole = (role: UserRole) => {
        switchUser(role);
        setIsProfileOpen(false);

        const paths: Record<UserRole, string> = {
            doctor: '/dokterbubung/dokter',
            pharmacist: '/dokterbubung/apoteker',
            admin: '/dokterbubung/logistik',
            public: '/dokterbubung/antrean'
        };

        router.push(paths[role]);
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 fixed top-0 w-full z-50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                    <Activity size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-none">MediSync Pro</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Hospital System</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative cursor-pointer">
                    <Bell size={20} className="text-slate-500 hover:text-slate-700" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{currentUser.role === 'pharmacist' ? 'Apoteker' : currentUser.role === 'admin' ? 'Logistik' : currentUser.role === 'doctor' ? 'Dokter' : 'Public'}</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                            {currentUser.name.charAt(0)}
                        </div>
                        <ChevronDown size={16} className="text-slate-400" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="p-3 bg-slate-50 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase">Ganti Peran</p>
                            </div>
                            <div className="p-2">
                                <button onClick={() => handleSwitchRole('doctor')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md">
                                    Dokter (Poliklinik)
                                </button>
                                <button onClick={() => handleSwitchRole('pharmacist')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 rounded-md">
                                    Apoteker (Farmasi)
                                </button>
                                <button onClick={() => handleSwitchRole('admin')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-md">
                                    Logistik (Gudang)
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button onClick={() => handleSwitchRole('public')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-md">
                                    Layar Antrean (Publik)
                                </button>
                            </div>
                            <div className="p-2 bg-red-50 border-t border-red-100">
                                <button onClick={() => router.push('/dokterbubung')} className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 flex items-center gap-2">
                                    <LogOut size={14} /> Kembali ke Menu Utama
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
