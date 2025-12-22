'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useHospital } from '../../components/DataProvider';
import { AlertTriangle, Package } from 'lucide-react';
import { formatCurrency } from '../../utils';

export default function LogistikInventoryPage() {
    const { medicines, updateMedicineStock } = useHospital();
    const [selectedMed, setSelectedMed] = useState<any>(null);
    const [restockAmount, setRestockAmount] = useState(0);

    const handleRestock = async () => {
        if (!selectedMed || restockAmount <= 0) return;

        try {
            await updateMedicineStock(selectedMed.id, restockAmount);
            alert(`Berhasil menambah stok ${selectedMed.name} sebanyak ${restockAmount}`);
            setSelectedMed(null);
            setRestockAmount(0);
        } catch (error) {
            alert('Gagal update stok');
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <Sidebar />

            <main className="ml-64 pt-20 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Manajemen Stok Obat</h2>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-left font-semibold text-slate-600">ID</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Nama Obat</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Tipe</th>
                                <th className="p-4 text-center font-semibold text-slate-600">Stok</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Lokasi</th>
                                <th className="p-4 text-left font-semibold text-slate-600">Harga</th>
                                <th className="p-4 text-right font-semibold text-slate-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {medicines.map(m => (
                                <tr key={m.id} className={`hover:bg-slate-50 ${m.stock < 10 ? 'bg-red-50' : ''}`}>
                                    <td className="p-4 font-mono text-slate-600">{m.id}</td>
                                    <td className="p-4 font-medium text-slate-800">{m.name}</td>
                                    <td className="p-4 text-slate-600">{m.type}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${m.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {m.stock < 10 && <AlertTriangle size={12} className="inline mr-1" />}
                                            {m.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600">{m.location}</td>
                                    <td className="p-4 text-slate-700 font-medium">{formatCurrency(m.price)}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedMed(m);
                                                setRestockAmount(10);
                                            }}
                                            className="text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold"
                                        >
                                            Restock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Restock Modal */}
                {selectedMed && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-2xl w-96 p-6">
                            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                                <Package className="text-orange-600" size={24} />
                                <h3 className="font-bold text-lg text-slate-800">Restock Obat</h3>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm text-slate-500 mb-1">Nama Obat</div>
                                <div className="font-bold text-slate-800 text-lg">{selectedMed.name}</div>
                            </div>

                            <div className="mb-4">
                                <div className="text-sm text-slate-500 mb-1">Stok Saat Ini</div>
                                <div className="text-3xl font-black text-slate-800">{selectedMed.stock}</div>
                            </div>

                            <div className="mb-6">
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Jumlah Tambahan</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full p-3 border border-slate-300 rounded-lg text-lg font-bold text-center focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={restockAmount}
                                    onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedMed(null)}
                                    className="flex-1 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleRestock}
                                    className="flex-1 py-2.5 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-bold shadow-lg shadow-orange-200"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
