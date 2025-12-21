'use client';

import React, { useState } from 'react';
import {
    Stethoscope, Pill, ClipboardList, Package, User, Activity,
    CheckCircle, Clock, AlertCircle, Plus, Search, ArrowUpRight,
    ArrowDownLeft, History, AlertTriangle, FileText, DollarSign,
    Menu, Bell, Settings, LogOut, ChevronDown, LayoutDashboard, Users, Trash2, UserPlus, X
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Medicine {
    id: string;
    name: string;
    type: string;
    stock: number;
    price: number;
    expiry: string;
    location: string;
}

interface PrescriptionItem {
    medicineId: string;
    name: string;
    qty: number;
    price: number;
    signa: string;
}

interface HistoryLog {
    status: string;
    time: string;
    note: string;
}

interface Prescription {
    id: string;
    patientName: string;
    patientDob: string;
    allergies: string;
    doctorName: string;
    date: string;
    status: string;
    totalPrice: number;
    items: PrescriptionItem[];
    historyLogs: HistoryLog[];
}

interface Patient {
    id: string;
    name: string;
    dob: string;
    status: string;
    allergies: string;
}

interface Log {
    id: number;
    date: string;
    type: string;
    medicineName: string;
    qty: number;
    ref: string;
    pic: string;
}

interface User {
    name: string;
    role: 'doctor' | 'pharmacist' | 'admin' | 'public';
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
}

// --- MOCK DATA ---
const INITIAL_MEDICINES = [
    { id: 'OBT001', name: 'Amoxicillin 500mg', type: 'Tablet', stock: 50, price: 15000, expiry: '2026-05-20', location: 'Rak A1' },
    { id: 'OBT002', name: 'Paracetamol 500mg', type: 'Tablet', stock: 120, price: 5000, expiry: '2027-01-15', location: 'Rak A2' },
    { id: 'OBT003', name: 'OBH Combi Anak', type: 'Sirup', stock: 8, price: 25000, expiry: '2025-08-10', location: 'Rak B1' },
    { id: 'OBT004', name: 'Vitamin C 1000mg', type: 'Tablet', stock: 80, price: 45000, expiry: '2025-07-01', location: 'Rak C1' },
    { id: 'OBT005', name: 'Simvastatin 10mg', type: 'Tablet', stock: 5, price: 30000, expiry: '2025-11-05', location: 'Rak A3' },
];

const INITIAL_PRESCRIPTIONS = [
    {
        id: 'RSP-8821',
        patientName: 'Budi Santoso',
        patientDob: '1985-04-12',
        allergies: 'Tidak ada',
        doctorName: 'Dr. Izzati Muhimmah',
        date: '2025-06-14',
        status: 'Selesai',
        totalPrice: 50000,
        items: [
            { medicineId: 'OBT002', name: 'Paracetamol 500mg', qty: 10, price: 5000, signa: '3x1 Sesudah makan' }
        ],
        historyLogs: [
            { status: 'Pending', time: '09:00', note: 'Resep dibuat dokter' },
            { status: 'Selesai', time: '09:30', note: 'Obat diserahkan' }
        ]
    }
];

// Simulasi Antrean Pasien di Poliklinik (Untuk Dokter)
const INITIAL_PATIENT_QUEUE = [
    { id: 'P-001', name: 'Siti Aminah', dob: '1990-01-01', status: 'Waiting', allergies: 'Seafood' },
    { id: 'P-002', name: 'Rahmat Hidayat', dob: '1988-05-12', status: 'Waiting', allergies: '-' },
    { id: 'P-003', name: 'Joko Widodo', dob: '1975-10-20', status: 'Examining', allergies: 'Penicillin' },
];

const INITIAL_LOGS = [
    { id: 1, date: '2025-06-14', type: 'OUT', medicineName: 'Paracetamol 500mg', qty: 10, ref: 'RSP-8821', pic: 'Apoteker Jaga' }
];

const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

// --- LAYOUT COMPONENTS ---

interface NavbarProps {
    currentUser: User;
    onSwitchUser: (role: User['role']) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onSwitchUser }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 fixed top-0 w-full z-50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg shadow-sm">
                    <Activity size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-lg text-slate-800 tracking-tight leading-none">MediSync Pro</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Hospital System</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative cursor-pointer">
                    <Bell size={20} className="text-slate-500 hover:text-slate-700" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                </div>

                {/* PROFILE DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{currentUser.role}</p>
                        </div>
                        <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                            {currentUser.name.charAt(0)}
                        </div>
                        <ChevronDown size={16} className="text-slate-400" />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="p-3 bg-slate-50 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase">Ganti Peran (Simulasi)</p>
                            </div>
                            <div className="p-2">
                                <button onClick={() => { onSwitchUser('doctor'); setIsProfileOpen(false) }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center gap-2">
                                    <Stethoscope size={16} /> Dokter (Poliklinik)
                                </button>
                                <button onClick={() => { onSwitchUser('pharmacist'); setIsProfileOpen(false) }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 rounded-md flex items-center gap-2">
                                    <Pill size={16} /> Apoteker (Farmasi)
                                </button>
                                <button onClick={() => { onSwitchUser('admin'); setIsProfileOpen(false) }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-md flex items-center gap-2">
                                    <Package size={16} /> Logistik (Gudang)
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button onClick={() => { onSwitchUser('public'); setIsProfileOpen(false) }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-md flex items-center gap-2">
                                    <Activity size={16} /> Layar Antrean (Publik)
                                </button>
                            </div>
                            <div className="p-2 bg-red-50 border-t border-red-100">
                                <button className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 flex items-center gap-2">
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};


interface SidebarProps {
    role: User['role'];
    activeView: string;
    setView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeView, setView }) => {
    const getMenus = (): MenuItem[] => {
        switch (role) {
            case 'doctor':
                return [
                    { id: 'dashboard', label: 'Dashboard Dokter', icon: LayoutDashboard },
                    { id: 'workstation', label: 'Workstation Poli', icon: Stethoscope },
                    { id: 'history', label: 'Riwayat Resep', icon: History },
                ];
            case 'pharmacist':
                return [
                    { id: 'dashboard', label: 'Dashboard Farmasi', icon: LayoutDashboard },
                    { id: 'verification', label: 'Verifikasi & Racik', icon: ClipboardList },
                    { id: 'pickup', label: 'Penyerahan Obat', icon: CheckCircle },
                ];
            case 'admin':
                return [
                    { id: 'dashboard', label: 'Dashboard Gudang', icon: LayoutDashboard },
                    { id: 'inventory', label: 'Stok Obat', icon: Package },
                    { id: 'logs', label: 'Laporan Mutasi', icon: FileText },
                ];
            default:
                return [];
        }
    };

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 fixed left-0 top-16 bottom-0 overflow-y-auto border-r border-slate-800">
            <div className="p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">Menu Utama</p>
                <div className="space-y-1">
                    {getMenus().map((menu) => (
                        <button
                            key={menu.id}
                            onClick={() => setView(menu.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${activeView === menu.id
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <menu.icon size={18} />
                            {menu.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
                <button className="flex items-center gap-3 text-sm text-slate-400 hover:text-white w-full px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors">
                    <Settings size={18} /> Pengaturan
                </button>
            </div>
        </aside>
    );
};

// --- DOCTOR WORKSTATION ---
interface DoctorWorkstationProps {
    medicines: Medicine[];
    onSubmitPrescription: (data: Omit<Prescription, 'id' | 'status' | 'historyLogs' | 'date'>) => void;
    patientQueue: Patient[];
    onAddPatient: (patientData: Omit<Patient, 'id' | 'status'>) => void;
}

const DoctorWorkstation: React.FC<DoctorWorkstationProps> = ({ medicines, onSubmitPrescription, patientQueue, onAddPatient }) => {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [cart, setCart] = useState<PrescriptionItem[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
    const [qty, setQty] = useState<number>(1);
    const [signa, setSigna] = useState<string>('');

    // State untuk Modal Tambah Pasien
    const [isAddPatientOpen, setIsAddPatientOpen] = useState<boolean>(false);
    const [newPatientName, setNewPatientName] = useState<string>('');
    const [newPatientDob, setNewPatientDob] = useState<string>('');
    const [newPatientAllergies, setNewPatientAllergies] = useState<string>('');

    const filteredMedicines = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const addToCart = () => {
        if (!selectedMed && !searchTerm) return alert("Pilih obat terlebih dahulu!");

        let medToAdd: Medicine | null | undefined = selectedMed;
        if (!medToAdd) {
            medToAdd = medicines.find(m => m.name.toLowerCase() === searchTerm.toLowerCase());
        }

        if (!medToAdd) return alert("Obat tidak ditemukan di database! Silakan pilih dari daftar.");
        if (!signa) return alert("Isi aturan pakai!");

        setCart([...cart, {
            medicineId: medToAdd.id,
            name: medToAdd.name,
            qty: parseInt(qty.toString()),
            price: medToAdd.price,
            signa
        }]);

        setQty(1);
        setSigna('');
        setSearchTerm('');
        setSelectedMed(null);
    };

    const handleSubmit = () => {
        if (!selectedPatient || cart.length === 0) return;
        onSubmitPrescription({
            patientName: selectedPatient.name,
            patientDob: selectedPatient.dob,
            allergies: selectedPatient.allergies,
            doctorName: 'Dr. Izzati Muhimmah',
            items: cart,
            totalPrice: cart.reduce((acc, i) => acc + (i.price * i.qty), 0)
        });
        setCart([]);
        setSelectedPatient(null);
        alert("Resep berhasil dikirim ke Instalasi Farmasi!");
    };

    const handleSaveNewPatient = () => {
        if (!newPatientName || !newPatientDob) {
            alert("Nama dan Tanggal Lahir wajib diisi!");
            return;
        }

        onAddPatient({
            name: newPatientName,
            dob: newPatientDob,
            allergies: newPatientAllergies || '-'
        });

        setNewPatientName('');
        setNewPatientDob('');
        setNewPatientAllergies('');
        setIsAddPatientOpen(false);
    };

    return (
        <div className="flex h-full gap-6 relative">
            {/* Modal Tambah Pasien */}
            {isAddPatientOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-xl">
                    <div className="bg-white rounded-xl shadow-2xl w-96 p-6 animate-in zoom-in-95 duration-200">
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
                                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300"
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
                        <Users size={18} className="text-indigo-600" /> Antrean
                    </h3>
                    <button
                        onClick={() => setIsAddPatientOpen(true)}
                        className="flex items-center gap-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1.5 rounded-md shadow-sm transition-colors"
                    >
                        <Plus size={14} /> Pasien
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {patientQueue.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">Belum ada pasien dalam antrean</div>
                    ) : (
                        patientQueue.map(p => (
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
                                <div className="text-xs text-slate-500 mt-1">Usia: {new Date().getFullYear() - new Date(p.dob).getFullYear()} Th | Alergi: <span className="text-red-500 font-medium">{p.allergies}</span></div>
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
                            {/* Form Tambah Obat (Nambah Resep) */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm relative z-10">
                                <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <Pill size={16} className="text-indigo-600" /> Tambah Obat ke Resep
                                </label>
                                <div className="flex gap-3 items-end">
                                    <div className="relative flex-1">
                                        <span className="text-xs text-slate-500 mb-1 block font-medium">Cari Obat (Nama)</span>
                                        <input
                                            className="w-full p-2.5 pl-9 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                            placeholder="Ketik nama obat..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setSelectedMed(null); // Reset jika ketik ulang
                                            }}
                                        />
                                        <Search size={16} className="absolute left-3 top-8 text-slate-400" />

                                        {/* Dropdown Suggestion */}
                                        {searchTerm && !selectedMed && (
                                            <div className="absolute top-full left-0 w-full bg-white shadow-xl border border-slate-200 rounded-lg mt-1 max-h-48 overflow-y-auto z-50">
                                                {filteredMedicines.length === 0 ? (
                                                    <div className="p-3 text-sm text-slate-400 italic">Obat tidak ditemukan</div>
                                                ) : (
                                                    filteredMedicines.map(m => (
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
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-24">
                                        <span className="text-xs text-slate-500 mb-1 block font-medium">Jumlah</span>
                                        <input
                                            type="number" min="1"
                                            className="w-full p-2.5 border border-slate-300 rounded-lg text-center"
                                            value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                                        />
                                    </div>

                                    <div className="w-1/3">
                                        <span className="text-xs text-slate-500 mb-1 block font-medium">Aturan Pakai (Signa)</span>
                                        <input
                                            type="text" placeholder="Cth: 3x1 Sesudah makan"
                                            className="w-full p-2.5 border border-slate-300 rounded-lg"
                                            value={signa} onChange={(e) => setSigna(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addToCart()}
                                        />
                                    </div>

                                    <button
                                        onClick={addToCart}
                                        className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
                                        title="Tambahkan Obat"
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
                                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-3 pl-4 font-medium text-slate-700">{item.name}</td>
                                                <td className="p-3 text-center">
                                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{item.qty}</span>
                                                </td>
                                                <td className="p-3 italic text-slate-500">{item.signa}</td>
                                                <td className="p-3 text-right pr-4">
                                                    <button
                                                        onClick={() => {
                                                            const newCart = [...cart]; newCart.splice(idx, 1); setCart(newCart);
                                                        }}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                                                        title="Hapus Item"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {cart.length === 0 && (
                                            <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic bg-white">Belum ada obat dalam daftar resep</td></tr>
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
                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                            >
                                <ClipboardList size={18} /> Kirim Resep Digital
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                            <User size={48} className="text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">Pilih Pasien dari Antrean</p>
                        <p className="text-sm max-w-xs text-center mt-2">Silakan pilih nama pasien di panel sebelah kiri untuk mulai membuat resep.</p>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- PHARMACIST DASHBOARD & WORKSTATION ---
interface PharmacistWorkstationProps {
    prescriptions: Prescription[];
    medicines: Medicine[];
    onProcess: (id: string) => void;
    onFinish: (id: string) => void;
    viewMode: string;
}

const PharmacistWorkstation: React.FC<PharmacistWorkstationProps> = ({ prescriptions, medicines, onProcess, onFinish, viewMode }) => {
    // viewMode: 'dashboard', 'verification', 'pickup'

    if (viewMode === 'dashboard') {
        const pending = prescriptions.filter(p => p.status === 'Pending').length;
        const process = prescriptions.filter(p => p.status === 'Process').length;
        return (
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
                        <p className="text-4xl font-bold text-green-600">{prescriptions.filter(p => p.status === 'Selesai').length}</p>
                    </div>
                </div>
            </div>
        );
    }

    const targetStatus = viewMode === 'verification' ? 'Pending' : (viewMode === 'pickup' ? 'Process' : 'Selesai');
    const filteredList = prescriptions.filter(p => viewMode === 'pickup' ? (p.status === 'Process' || p.status === 'Selesai') : p.status === targetStatus);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">
                    {viewMode === 'verification' ? 'Verifikasi & Peracikan' : 'Penyerahan Obat'}
                </h2>
            </div>
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                    <tr>
                        <th className="p-4">ID Resep</th>
                        <th className="p-4">Pasien</th>
                        <th className="p-4">Obat</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredList.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-400">Tidak ada data</td></tr>}
                    {filteredList.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-4 font-mono font-medium">{p.id}</td>
                            <td className="p-4 font-bold">{p.patientName}</td>
                            <td className="p-4">
                                {p.items.map((i, idx) => (
                                    <div key={idx} className="text-xs text-slate-600">{i.name} ({i.qty})</div>
                                ))}
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                    p.status === 'Process' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                    }`}>{p.status}</span>
                            </td>
                            <td className="p-4 text-right">
                                {p.status === 'Pending' && (
                                    <button onClick={() => onProcess(p.id)} className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-indigo-700">
                                        Proses
                                    </button>
                                )}
                                {p.status === 'Process' && (
                                    <button onClick={() => onFinish(p.id)} className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-green-700">
                                        Selesai & Panggil
                                    </button>
                                )}
                                {p.status === 'Selesai' && <span className="text-green-600 font-bold text-xs"><CheckCircle size={14} className="inline" /> Siap</span>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- ADMIN / LOGISTICS WORKSTATION ---
interface LogisticsWorkstationProps {
    medicines: Medicine[];
    logs: Log[];
    onRestock: (id: string, amount: number, name: string) => void;
    viewMode: string;
}

const LogisticsWorkstation: React.FC<LogisticsWorkstationProps> = ({ medicines, logs, onRestock, viewMode }) => {
    if (viewMode === 'dashboard') {
        const lowStock = medicines.filter(m => m.stock < 10).length;
        return (
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
                </div>
            </div>
        )
    }

    // Reuse logic from previous AdminView but simplified for new layout
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">{viewMode === 'inventory' ? 'Stok Obat' : 'Laporan Mutasi'}</h2>
            </div>
            {viewMode === 'inventory' ? (
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="p-4">Nama Item</th>
                            <th className="p-4 text-center">Stok</th>
                            <th className="p-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {medicines.map(m => (
                            <tr key={m.id}>
                                <td className="p-4">
                                    <div className="font-bold">{m.name}</div>
                                    <div className="text-xs text-slate-500">{m.location}</div>
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded font-bold ${m.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{m.stock}</span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => onRestock(m.id, 10, m.name)} className="text-indigo-600 font-bold hover:underline">+ Restock</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="p-4">
                    {logs.map((log, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-slate-50">
                            <span className="text-sm">{log.date} - <span className="font-bold">{log.medicineName}</span></span>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${log.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{log.type} {log.qty}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// --- PUBLIC QUEUE SCREEN (No Navbar/Sidebar) ---
interface PublicQueueScreenProps {
    prescriptions: Prescription[];
}

const PublicQueueScreen: React.FC<PublicQueueScreenProps> = ({ prescriptions }) => {
    const process = prescriptions.filter(p => p.status === 'Process');
    const ready = prescriptions.filter(p => p.status === 'Selesai');

    return (
        <div className="bg-slate-900 min-h-screen p-8 text-white">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">RS ISLAM INDONESIA</h1>
                <p className="text-slate-400 text-xl tracking-widest uppercase">Antrean Farmasi</p>
            </div>
            <div className="grid grid-cols-2 gap-8 h-[calc(100vh-200px)]">
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3"><Clock /> SEDANG DISIAPKAN</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {process.map(p => (
                            <div key={p.id} className="bg-blue-900/50 p-4 rounded-xl border border-blue-800/50">
                                <div className="text-3xl font-bold text-white">{p.id}</div>
                                <div className="text-blue-200 truncate">{p.patientName}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3"><CheckCircle /> SIAP DIANGKUT</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {ready.map(p => (
                            <div key={p.id} className="bg-green-900/50 p-4 rounded-xl border border-green-800/50 animate-pulse">
                                <div className="text-3xl font-bold text-white">{p.id}</div>
                                <div className="text-green-200 truncate">{p.patientName}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- MAIN APP ---
const App = () => {
    // Global State (Database Simulation)
    const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);
    const [logs, setLogs] = useState<Log[]>(INITIAL_LOGS);
    const [patientQueue, setPatientQueue] = useState<Patient[]>(INITIAL_PATIENT_QUEUE);

    // User Session State
    const [currentUser, setCurrentUser] = useState<User>({ name: 'Dr. Izzati Muhimmah', role: 'doctor' as const });
    const [activeView, setActiveView] = useState<string>('dashboard'); // dashboard | workstation | history | etc

    // --- ACTIONS ---
    const switchUser = (role: User['role']) => {
        setActiveView('dashboard'); // Reset view to dashboard on switch
        if (role === 'doctor') setCurrentUser({ name: 'Dr. Izzati Muhimmah', role: 'doctor' as const });
        else if (role === 'pharmacist') setCurrentUser({ name: 'Apt. Budi Santoso', role: 'pharmacist' as const });
        else if (role === 'admin') setCurrentUser({ name: 'Staff Gudang', role: 'admin' as const });
        else if (role === 'public') setCurrentUser({ name: 'Public Screen', role: 'public' as const });
    };

    const handleCreatePrescription = (data: Omit<Prescription, 'id' | 'status' | 'historyLogs' | 'date'>) => {
        const newId = `RSP-${Math.floor(1000 + Math.random() * 9000)}`;
        const newPrescription: Prescription = {
            id: newId,
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            historyLogs: [],
            ...data
        };
        setPrescriptions([...prescriptions, newPrescription]);
    };

    const handleAddPatient = (patientData: Omit<Patient, 'id' | 'status'>) => {
        const newId = `P-00${patientQueue.length + 1}`;
        const newPatient: Patient = {
            id: newId,
            status: 'Waiting',
            ...patientData
        };
        setPatientQueue([...patientQueue, newPatient]);
    };

    const handleProcessPrescription = (id: string) => {
        const pres = prescriptions.find(p => p.id === id);
        if (!pres) return;
        // Logic pengurangan stok sederhana
        const updatedMeds = medicines.map(m => {
            const item = pres.items.find(i => i.medicineId === m.id);
            return item ? { ...m, stock: m.stock - item.qty } : m;
        });
        setMedicines(updatedMeds);
        setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, status: 'Process' } : p));
    };

    const handleFinishPrescription = (id: string) => {
        setPrescriptions(prescriptions.map(p => p.id === id ? { ...p, status: 'Selesai' } : p));
    };

    const handleRestock = (id: string, amount: number, name: string) => {
        setMedicines(medicines.map(m => m.id === id ? { ...m, stock: m.stock + amount } : m));
        setLogs([...logs, { id: logs.length + 1, date: '2025-06-14', type: 'IN', medicineName: name, qty: amount, ref: 'Restock', pic: currentUser.name }]);
    };

    // --- RENDER LOGIC ---
    if (currentUser.role === 'public') {
        return <PublicQueueScreen prescriptions={prescriptions} />;
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
            <Navbar currentUser={currentUser} onSwitchUser={switchUser} />
            <Sidebar role={currentUser.role} activeView={activeView} setView={setActiveView} />

            <main className="ml-64 pt-20 p-8 h-screen overflow-hidden">
                {/* DOCTOR VIEWS */}
                {currentUser.role === 'doctor' && (
                    <>
                        {activeView === 'dashboard' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold">Halo, {currentUser.name}</h2>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-slate-500 text-sm mb-1">Pasien Menunggu</div>
                                        <div className="text-3xl font-bold text-indigo-600">{patientQueue.length}</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="text-slate-500 text-sm mb-1">Resep Hari Ini</div>
                                        <div className="text-3xl font-bold text-green-600">{prescriptions.length}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeView === 'workstation' && (
                            <DoctorWorkstation
                                medicines={medicines}
                                onSubmitPrescription={handleCreatePrescription}
                                patientQueue={patientQueue}
                                onAddPatient={handleAddPatient}
                            />
                        )}
                        {activeView === 'history' && <div className="p-10 text-center text-slate-400">Riwayat Resep akan muncul di sini</div>}
                    </>
                )}

                {/* PHARMACIST VIEWS */}
                {currentUser.role === 'pharmacist' && (
                    <PharmacistWorkstation
                        viewMode={activeView}
                        prescriptions={prescriptions}
                        medicines={medicines}
                        onProcess={handleProcessPrescription}
                        onFinish={handleFinishPrescription}
                    />
                )}

                {/* ADMIN VIEWS */}
                {currentUser.role === 'admin' && (
                    <LogisticsWorkstation
                        viewMode={activeView}
                        medicines={medicines}
                        logs={logs}
                        onRestock={handleRestock}
                    />
                )}
            </main>
        </div>
    );
};

export default App;