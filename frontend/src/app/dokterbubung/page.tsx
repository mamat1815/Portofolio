'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, Pill, Package, Activity } from 'lucide-react';

export default function DokterBubungLanding() {
    const router = useRouter();

    const roles = [
        {
            id: 'doctor',
            name: 'Dokter',
            description: 'Poliklinik & Resep Digital',
            icon: Stethoscope,
            color: 'from-blue-500 to-blue-700',
            path: '/dokterbubung/dokter'
        },
        {
            id: 'pharmacist',
            name: 'Apoteker',
            description: 'Verifikasi & Penyerahan Obat',
            icon: Pill,
            color: 'from-green-500 to-green-700',
            path: '/dokterbubung/apoteker'
        },
        {
            id: 'admin',
            name: 'Logistik',
            description: 'Manajemen Stok & Gudang',
            icon: Package,
            color: 'from-orange-500 to-orange-700',
            path: '/dokterbubung/logistik'
        },
        {
            id: 'public',
            name: 'Layar Antrean',
            description: 'Display Publik Farmasi',
            icon: Activity,
            color: 'from-purple-500 to-purple-700',
            path: '/dokterbubung/antrean'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-5xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
                            <Activity size={32} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2">
                        MediSync Pro
                    </h1>
                    <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold">
                        Hospital Management System
                    </p>
                </div>

                {/* Role Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <button
                                key={role.id}
                                onClick={() => router.push(role.path)}
                                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-slate-300 overflow-hidden"
                            >
                                {/* Background Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${role.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {role.name}
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        {role.description}
                                    </p>
                                </div>

                                {/* Arrow Icon */}
                                <div className="absolute bottom-4 right-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-300">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-slate-400 text-xs">
                    <p>Demo Hospital Management System • DokterBubung v1.0</p>
                </div>
            </div>
        </div>
    );
}