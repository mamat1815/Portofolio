'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useHospital } from '../components/DataProvider';

export default function ApotekerPage() {
    const { prescriptions } = useHospital();

    const pending = prescriptions.filter(p => p.status === 'Pending').length;
    const process = prescriptions.filter(p => p.status === 'Process').length;
    const completed = prescriptions.filter(p => p.status === 'Selesai').length;

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <Sidebar />

            <main className="ml-64 pt-20 p-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard Farmasi</h2>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                            <h3 className="text-yellow-800 font-bold mb-2">Menunggu Verifikasi</h3>
                            <p className="text-4xl font-bold text-yellow-600">{pending}</p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <h3 className="text-blue-800 font-bold mb-2">Sedang Diracik</h3>
                            <p className="text-4xl font-bold text-blue-600">{process}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                            <h3 className="text-green-800 font-bold mb-2">Siap Diambil</h3>
                            <p className="text-4xl font-bold text-green-600">{completed}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Akses Cepat</h3>
                        <p className="text-slate-600 text-sm">
                            Gunakan menu sidebar untuk mengakses:
                        </p>
                        <ul className="mt-3 text-sm text-slate-600 space-y-2">
                            <li>• <strong>Verifikasi & Racik</strong> - Verifikasi resep dan proses peracikan</li>
                            <li>• <strong>Penyerahan Obat</strong> - Kelola penyerahan obat ke pasien</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
