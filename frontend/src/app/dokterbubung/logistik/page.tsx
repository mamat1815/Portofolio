'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useHospital } from '../components/DataProvider';
import { AlertTriangle } from 'lucide-react';

export default function LogistikPage() {
    const { medicines } = useHospital();
    const lowStock = medicines.filter(m => m.stock < 10).length;

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <Sidebar />

            <main className="ml-64 pt-20 p-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800">Dashboard Logistik</h2>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-center gap-4">
                            <AlertTriangle className="text-red-500" size={32} />
                            <div>
                                <h3 className="text-red-800 font-bold mb-1">Stok Kritis</h3>
                                <p className="text-3xl font-bold text-red-600">{lowStock} <span className="text-sm font-normal text-red-400">Items</span></p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-sm mb-1">Total Obat</div>
                            <div className="text-3xl font-bold text-slate-600">{medicines.length}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-slate-500 text-sm mb-1">Mutasi Hari Ini</div>
                            <div className="text-3xl font-bold text-slate-600">5</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Akses Cepat</h3>
                        <p className="text-slate-600 text-sm">
                            Gunakan menu sidebar untuk mengakses:
                        </p>
                        <ul className="mt-3 text-sm text-slate-600 space-y-2">
                            <li>• <strong>Stok Obat</strong> - Kelola inventori dan restock obat</li>
                            <li>• <strong>Laporan Mutasi</strong> - Lihat history mutasi stok</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
