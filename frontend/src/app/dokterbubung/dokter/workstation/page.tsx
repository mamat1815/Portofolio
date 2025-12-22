'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useHospital } from '../../components/DataProvider';
import { Search, Plus, User, Pill, Trash2, UserPlus, X } from 'lucide-react';

export default function DokterWorkstationPage() {
    const { patients, medicines, addPatient, createPrescription } = useHospital();
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [cart, setCart] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [qty, setQty] = useState(1);
    const [signa, setSigna] = useState('');
    const [selectedMed, setSelectedMed] = useState<any>(null);

    // Modal state
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
    const [newPatientName, setNewPatientName] = useState('');
    const [newPatientDob, setNewPatientDob] = useState('');
    const [newPatientAllergies, setNewPatientAllergies] = useState('');

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = () => {
        if (!selectedMed && !searchTerm) return alert("Pilih obat terlebih dahulu!");

        let medToAdd = selectedMed;
        if (!medToAdd) {
            medToAdd = medicines.find(m => m.name.toLowerCase() === searchTerm.toLowerCase());
        }
        if (!medToAdd) return alert("Obat tidak ditemukan!");
        if (!signa) return alert("Isi aturan pakai!");

        setCart([...cart, { ...medToAdd, qty: parseInt(qty.toString()), signa }]);
        setQty(1);
        setSigna('');
        setSearchTerm('');
        setSelectedMed(null);
    };

    const handleSubmit = async () => {
        if (!selectedPatient || cart.length === 0) return;

        try {
            await createPrescription({
                patientName: selectedPatient.name,
                patientDob: selectedPatient.dob,
                allergies: selectedPatient.allergies,
                doctorName: 'Dr. Izzati Muhimmah',
                items: cart.map(item => ({
                    medicineId: item.id,
                    name: item.name,
                    qty: item.qty,
                    price: item.price,
                    signa: item.signa
                })),
                totalPrice: cart.reduce((acc, i) => acc + (i.price * i.qty), 0)
            });

            setCart([]);
            setSelectedPatient(null);
            alert("Resep berhasil dikirim ke Instalasi Farmasi!");
        } catch (error) {
            alert("Gagal membuat resep");
        }
    };

    const handleSaveNewPatient = async () => {
        if (!newPatientName || !newPatientDob) {
            alert("Nama dan Tanggal Lahir wajib diisi!");
            return;
        }

        try {
            await addPatient({
                name: newPatientName,
                dob: newPatientDob,
                allergies: newPatientAllergies || '-'
            });

            setNewPatientName('');
            setNewPatientDob('');
            setNewPatientAllergies('');
            setIsAddPatientOpen(false);
        } catch (error) {
            alert("Gagal menambah pasien");
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <Navbar />
            <Sidebar />

            <main className="ml-64 pt-20 p-8 h-screen overflow-hidden">
                <div className="flex h-full gap-6 relative">
                    {/* Modal Tambah Pasien */}
                    {isAddPatientOpen && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-xl">
                            <div className="bg-white rounded-xl shadow-2xl w-96 p-6">
                                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                        <UserPlus size={20} className="text-indigo-600" /> Pasien Baru
                                    </h3>
                                    <button onClick={() => setIsAddPatientOpen(false)} className="text-slate-400 hover:text-slate-600">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={newPatientName}
                                            onChange={(e) => setNewPatientName(e.target.value)}
                                            placeholder="Nama Pasien"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                                        <input
                                            type="date"
                                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={newPatientDob}
                                            onChange={(e) => setNewPatientDob(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Riwayat Alergi</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={newPatientAllergies}
                                            onChange={(e) => setNewPatientAllergies(e.target.value)}
                                            placeholder="Kosongkan jika tidak ada"
                                        />
                                    </div>

                                    <div className="pt-2 flex gap-3">
                                        <button
                                            onClick={() => setIsAddPatientOpen(false)}
                                            className="flex-1 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleSaveNewPatient}
                                            className="flex-1 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-bold shadow-lg shadow-indigo-200"
                                        >
                                            Simpan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Kolom Kiri: Daftar Pasien */}
                    <div className="w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <User size={18} className="text-indigo-600" /> Antrean Pasien
                            </h3>
                            <button
                                onClick={() => setIsAddPatientOpen(true)}
                                className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1.5 rounded-md shadow-sm"
                            >
                                <Plus size={14} /> Pasien
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {patients.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 text-sm">Belum ada pasien</div>
                            ) : (
                                patients.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedPatient(p)}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedPatient?.id === p.id
                                                ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                                                : 'bg-white border-slate-100 hover:border-indigo-300'
                                            }`}
                                    >
                                        <div className="flex justify-between">
                                            <span className="font-bold text-sm text-slate-800">{p.name}</span>
                                            <span className="text-xs font-mono text-slate-500">{p.id}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {p.dob} | Alergi: <span className="text-red-500 font-medium">{p.allergies}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Kolom Kanan: Input Resep */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                        {selectedPatient ? (
                            <>
                                <div className="p-6 border-b border-slate-100">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-800">{selectedPatient.name}</h2>
                                            <p className="text-sm text-slate-500">No RM: {selectedPatient.id} • Tgl Lahir: {selectedPatient.dob}</p>
                                        </div>
                                        <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                                            Alergi: {selectedPatient.allergies}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                                    {/* Form Tambah Obat */}
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm relative z-10">
                                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                            <Pill size={16} className="text-indigo-600" /> Tambah Obat ke Resep
                                        </label>
                                        <div className="flex gap-3 items-end">
                                            <div className="relative flex-1">
                                                <span className="text-xs text-slate-500 mb-1 block font-medium">Cari Obat</span>
                                                <input
                                                    className="w-full p-2.5 pl-9 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                                    placeholder="Ketik nama obat..."
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setSelectedMed(null);
                                                    }}
                                                />
                                                <Search size={16} className="absolute left-3 top-8 text-slate-400" />

                                                {searchTerm && !selectedMed && filteredMedicines.length > 0 && (
                                                    <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-slate-200 rounded-lg mt-1 max-h-48 overflow-y-auto z-50">
                                                        {filteredMedicines.map(m => (
                                                            <div
                                                                key={m.id}
                                                                className="p-2.5 hover:bg-indigo-50 cursor-pointer text-sm border-b border-slate-50 last:border-0"
                                                                onClick={() => {
                                                                    setSearchTerm(m.name);
                                                                    setSelectedMed(m);
                                                                }}
                                                            >
                                                                <div className="font-bold text-slate-700">{m.name}</div>
                                                                <div className="text-xs text-slate-500 flex justify-between mt-1">
                                                                    <span>{m.location}</span>
                                                                    <span className={m.stock < 10 ? 'text-red-500 font-bold' : 'text-green-600'}>Stok: {m.stock}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-24">
                                                <span className="text-xs text-slate-500 mb-1 block font-medium">Jumlah</span>
                                                <input
                                                    type="number" min="1"
                                                    className="w-full p-2.5 border border-slate-300 rounded-lg text-center"
                                                    value={qty}
                                                    onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                                                />
                                            </div>

                                            <div className="w-1/3">
                                                <span className="text-xs text-slate-500 mb-1 block font-medium">Aturan Pakai</span>
                                                <input
                                                    type="text"
                                                    placeholder="Cth: 3x1"
                                                    className="w-full p-2.5 border border-slate-300 rounded-lg"
                                                    value={signa}
                                                    onChange={(e) => setSigna(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && addToCart()}
                                                />
                                            </div>

                                            <button
                                                onClick={addToCart}
                                                className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tabel Resep */}
                                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                                <tr>
                                                    <th className="p-3 pl-4">Nama Obat</th>
                                                    <th className="p-3 text-center">Jml</th>
                                                    <th className="p-3">Aturan Pakai</th>
                                                    <th className="p-3 text-right pr-4">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {cart.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50">
                                                        <td className="p-3 pl-4 font-medium text-slate-700">{item.name}</td>
                                                        <td className="p-3 text-center">
                                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{item.qty}</span>
                                                        </td>
                                                        <td className="p-3 italic text-slate-500">{item.signa}</td>
                                                        <td className="p-3 text-right pr-4">
                                                            <button
                                                                onClick={() => {
                                                                    const newCart = [...cart];
                                                                    newCart.splice(idx, 1);
                                                                    setCart(newCart);
                                                                }}
                                                                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {cart.length === 0 && (
                                                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 italic">Belum ada obat dalam resep</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-slate-100 bg-slate-50 text-right flex justify-between items-center">
                                    <div className="text-sm text-slate-500 pl-2">
                                        Total Item: <span className="font-bold text-slate-800">{cart.length}</span>
                                    </div>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={cart.length === 0}
                                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
                                    >
                                        Kirim Resep Digital
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <div className="bg-slate-50 p-6 rounded-full mb-4">
                                    <User size={48} className="text-slate-300" />
                                </div>
                                <p className="text-lg font-medium text-slate-600">Pilih Pasien dari Antrean</p>
                                <p className="text-sm max-w-xs text-center mt-2">Silakan pilih nama pasien di panel kiri untuk mulai membuat resep.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
