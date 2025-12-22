'use client';

import React from 'react';
import Navbar from '../../components/Sidebar';
import Sidebar from '../../components/Sidebar';
import { useHospital } from '../../components/DataProvider';
import { Package } from 'lucide-react';

export default function ApotekerPickupPage() {
    const { prescriptions, updatePrescriptionStatus } = useHospital();
    const processPrescriptions = prescriptions.filter(p => p.status === 'Process');

    const handleFinish = async (id: string) => {
        if (confirm('Konfirmasi obat sudah diserahkan ke pasien?')) {
            try {
                await updatePrescriptionStatus(id, 'Selesai');
                alert('Transaksi selesai');
            } catch (error) {
                alert('Gagal menyelesaikan transaksi');
            }
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <Sidebar />

            <main className="ml-64 pt-20 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Penyerahan Obat</h2>

                <div className="grid grid-cols-2 gap-6">
                    {processPrescriptions.length === 0 ? (
                        <div className="col-span-2 bg-white rounded-xl p-12 text-center border border-slate-200">
                            <div className="text-slate-300 mb-4"><Package size={64} /></div>
                            <p className="text-slate-500 font-medium">Tidak ada resep yang sedang diracik</p>
                        </div>
                    ) : (
                        processPrescriptions.map(p => (
                            <div key={p.id} className="bg-white rounded-xl border border-blue-200 shadow-lg overflow-hidden">
                                <div className="p-6 bg-blue-50 border-b border-blue-100">
                                    <div className="font-mono text-3xl font-black text-blue-900 mb-2">{p.id}</div>
                                    <div className="text-lg font-bold text-slate-800">{p.patientName}</div>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-2 mb-4">
                                        {p.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm border-b border-slate-100 pb-2">
                                                <span className="text-slate-700">{item.name}</span>
                                                <span className="font-bold text-slate-800">{item.qty}x</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handleFinish(p.id)}
                                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200"
                                    >
                                        Selesai & Serahkan
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
