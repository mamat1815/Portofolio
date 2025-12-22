'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useHospital } from '../../components/DataProvider';
import { CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils';

export default function ApotekerVerificationPage() {
    const { prescriptions, updatePrescriptionStatus } = useHospital();
    const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending');

    const handleProcess = async (id: string) => {
        if (confirm('Mulai memproses resep ini?')) {
            try {
                await updatePrescriptionStatus(id, 'Process');
                alert('Resep berhasil diproses. Stok otomatis berkurang.');
            } catch (error) {
                alert('Gagal memproses resep');
            }
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <Sidebar />

            <main className="ml-64 pt-20 p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Verifikasi & Racik Resep</h2>

                <div className="space-y-4">
                    {pendingPrescriptions.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
                            <div className="text-slate-300 mb-4"><CheckCircle size={64} /></div>
                            <p className="text-slate-500 font-medium">Tidak ada resep yang perlu diverifikasi</p>
                        </div>
                    ) : (
                        pendingPrescriptions.map(p => (
                            <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 bg-yellow-50 border-b border-yellow-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-xl text-slate-800 mb-1">{p.id}</h3>
                                            <p className="text-slate-600">
                                                <span className="font-medium">{p.patientName}</span> • {p.patientDob}
                                            </p>
                                            {p.allergies && p.allergies !== '-' && (
                                                <p className="text-red-600 text-sm font-medium mt-1 bg-red-50 inline-block px-2 py-0.5 rounded">
                                                    ⚠ Alergi: {p.allergies}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-slate-500">Dr. {p.doctorName}</div>
                                            <div className="text-sm text-slate-500">{p.date}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-slate-200">
                                            <tr className="text-left text-slate-600">
                                                <th className="pb-3">Obat</th>
                                                <th className="pb-3 text-center">Jumlah</th>
                                                <th className="pb-3">Aturan Pakai</th>
                                                <th className="pb-3 text-right">Harga</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {p.items?.map((item, idx) => (
                                                <tr key={idx} className="text-slate-700">
                                                    <td className="py-3 font-medium">{item.name}</td>
                                                    <td className="py-3 text-center">
                                                        <span className="bg-slate-100 px-3 py-1 rounded text-xs font-bold">{item.qty}</span>
                                                    </td>
                                                    <td className="py-3 italic text-slate-500">{item.signa}</td>
                                                    <td className="py-3 text-right font-medium">{formatCurrency(item.price * item.qty)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-200">
                                        <div className="text-lg font-bold text-slate-800">
                                            Total: {formatCurrency(p.totalPrice)}
                                        </div>
                                        <button
                                            onClick={() => handleProcess(p.id)}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                                        >
                                            Proses & Racik Obat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
