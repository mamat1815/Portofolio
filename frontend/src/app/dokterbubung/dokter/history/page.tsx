'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useHospital } from '../../components/DataProvider';
import { formatCurrency } from '../../utils';

export default function DokterHistoryPage() {
    const { prescriptions } = useHospital();

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <Sidebar />

            <main className="ml-64 pt-20 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Riwayat Resep Digital</h2>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-left font-semibold text-slate-600">ID Resep</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Pasien</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Tanggal</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Item</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Total</th>
                                <th className="p-4 text-center font-semibold text-slate-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {prescriptions.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada resep</td></tr>
                            ) : (
                                prescriptions.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-mono font-bold text-indigo-600">{p.id}</td>
                                        <td className="p-4">
                                            <div className="font-medium text-slate-800">{p.patientName}</div>
                                            <div className="text-xs text-slate-500">{p.patientDob}</div>
                                        </td>
                                        <td className="p-4 text-slate-600">{p.date}</td>
                                        <td className="p-4 text-slate-600">{p.items?.length || 0} item</td>
                                        <td className="p-4 font-bold text-slate-800">{formatCurrency(p.totalPrice)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'Selesai' ? 'bg-green-100 text-green-700' :
                                                    p.status === 'Process' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
