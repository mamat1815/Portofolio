'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function DokterPage() {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <Sidebar />

            <main className="ml-64 pt-20 p-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard Dokter</h2>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-sm mb-1">Pasien Menunggu</div>
                            <div className="text-3xl font-bold text-indigo-600">3</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-sm mb-1">Resep Hari Ini</div>
                            <div className="text-3xl font-bold text-green-600">12</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-sm mb-1">Total Pasien</div>
                            <div className="text-3xl font-bold text-blue-600">45</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Akses Cepat</h3>
                        <p className="text-slate-600 text-sm">
                            Gunakan menu sidebar untuk mengakses:
                        </p>
                        <ul className="mt-3 text-sm text-slate-600 space-y-2">
                            <li>• <strong>Workstation Poli</strong> - Kelola pasien dan buat resep digital</li>
                            <li>• <strong>Riwayat Resep</strong> - Lihat riwayat resep yang sudah dibuat</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
