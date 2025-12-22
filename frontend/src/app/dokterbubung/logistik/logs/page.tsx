'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useHospital } from '../../components/DataProvider';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function LogistikLogsPage() {
    const { logs } = useHospital();

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <Sidebar />

            <main className="ml-64 pt-20 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Laporan Mutasi Stok</h2>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-left font-semibold text-slate-600">Tanggal</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Tipe</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Nama Obat</th>
                                <th className="p-4 text-center font-semibold text-slate-600">Jumlah</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Referensi</th>
                                <th className="p-4 text-left font-semibold text-slate-600">PIC</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada mutasi</td></tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <td className="p-4 text-slate-600">{log.date}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${log.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {log.type === 'IN' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                                {log.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-slate-800">{log.medicineName}</td>
                                        <td className="p-4 text-center">
                                            <span className="bg-slate-100 px-3 py-1 rounded text-xs font-bold">{log.qty}</span>
                                        </td>
                                        <td className="p-4 text-slate-600">{log.ref}</td>
                                        <td className="p-4 text-slate-600">{log.pic}</td>
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
