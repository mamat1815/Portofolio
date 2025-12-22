'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stethoscope, Pill, Package, Activity, Sparkles } from 'lucide-react';

export default function DokterBubungLanding() {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const roles = [
        {
            id: 'doctor',
            name: 'Dokter',
            description: 'Poliklinik & Resep Digital',
            icon: Stethoscope,
            emoji: '🩺',
            color: 'from-blue-500 to-blue-700',
            hoverColor: 'hover:from-blue-600 hover:to-blue-800',
            path: '/dokterbubung/dokter'
        },
        {
            id: 'pharmacist',
            name: 'Apoteker',
            description: 'Verifikasi & Penyerahan Obat',
            icon: Pill,
            emoji: '💊',
            color: 'from-green-500 to-green-700',
            hoverColor: 'hover:from-green-600 hover:to-green-800',
            path: '/dokterbubung/apoteker'
        },
        {
            id: 'admin',
            name: 'Logistik',
            description: 'Manajemen Stok & Gudang',
            icon: Package,
            emoji: '📦',
            color: 'from-orange-500 to-orange-700',
            hoverColor: 'hover:from-orange-600 hover:to-orange-800',
            path: '/dokterbubung/logistik'
        },
        {
            id: 'public',
            name: 'Layar Antrean',
            description: 'Display Publik Farmasi',
            icon: Activity,
            emoji: '📺',
            color: 'from-purple-500 to-purple-700',
            hoverColor: 'hover:from-purple-600 hover:to-purple-800',
            path: '/dokterbubung/antrean'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            opacity: Math.random() * 0.5 + 0.2
                        }}
                    />
                ))}
            </div>

            {/* Gradient Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative min-h-screen flex items-center justify-center p-6">
                <div className="max-w-6xl w-full">
                    {/* Header with Animation */}
                    <div className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
                        <div className="inline-flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-2xl">
                            <Sparkles className="text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} size={24} />
                            <span className="text-white font-bold text-sm uppercase tracking-wider">Sistem Informasi Rumah Sakit</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-gradient">
                            RS Islam Indonesia
                        </h1>

                        <p className="text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed font-light">
                            Platform manajemen rumah sakit terintegrasi untuk efisiensi pelayanan kesehatan
                        </p>
                    </div>

                    {/* Role Cards Grid with Staggered Animation */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {roles.map((role, index) => (
                            <div
                                key={role.id}
                                onClick={() => router.push(role.path)}
                                className={`group relative cursor-pointer transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    }`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                <div className={`relative bg-gradient-to-br ${role.color} ${role.hoverColor} rounded-2xl p-8 shadow-2xl border border-white/20 backdrop-blur-sm
                                    transform transition-all duration-500 hover:scale-105 hover:shadow-3xl hover:-translate-y-2
                                    before:absolute before:inset-0 before:rounded-2xl before:bg-white/0 before:transition-all before:duration-500
                                    hover:before:bg-white/10`}>

                                    {/* Animated Emoji Icon */}
                                    <div className="text-center mb-6 relative">
                                        <div className="text-7xl mb-4 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 inline-block">
                                            {role.emoji}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <role.icon className="text-white/20 absolute transition-all duration-500 group-hover:scale-150 group-hover:rotate-12" size={80} />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-black text-white mb-3 text-center group-hover:scale-105 transition-transform duration-300">
                                        {role.name}
                                    </h2>

                                    <p className="text-sm text-white/90 text-center font-medium leading-relaxed">
                                        {role.description}
                                    </p>

                                    {/* Animated Arrow */}
                                    <div className="mt-6 flex justify-center">
                                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center
                                            transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                                            <span className="text-white text-lg font-bold transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                                        </div>
                                    </div>

                                    {/* Shine Effect on Hover */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                        bg-gradient-to-tr from-transparent via-white/20 to-transparent 
                                        transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer with Animation */}
                    <div className={`mt-16 text-center transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <p className="text-indigo-300 text-sm font-medium">
                            Pilih role untuk memulai
                        </p>
                    </div>
                </div>
            </div>

            {/* Global CSS for animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}} />
        </div>
    );
}
