'use client';

import React, { useEffect } from 'react';
import { useHospital } from '../components/DataProvider';
import { Clock, CheckCircle } from 'lucide-react';

export default function AntreanPage() {
    const { prescriptions, switchUser } = useHospital();

    // Switch to public role when entering this page
    useEffect(() => {
        switchUser('public');
    }, [switchUser]);

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
                    <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                        <Clock /> SEDANG DISIAPKAN
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {process.length === 0 ? (
                            <div className="col-span-2 text-center text-slate-500 py-10">Tidak ada resep yang sedang diproses</div>
                        ) : (
                            process.map(p => (
                                <div key={p.id} className="bg-blue-900/50 p-4 rounded-xl border border-blue-800/50">
                                    <div className="text-3xl font-bold text-white">{p.id}</div>
                                    <div className="text-blue-200 truncate">{p.patientName}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
                        <CheckCircle /> SIAP DIAMBIL
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {ready.length === 0 ? (
                            <div className="col-span-2 text-center text-slate-500 py-10">Tidak ada resep yang siap</div>
                        ) : (
                            ready.map(p => (
                                <div key={p.id} className="bg-green-900/50 p-4 rounded-xl border border-green-800/50 animate-pulse">
                                    <div className="text-3xl font-bold text-white">{p.id}</div>
                                    <div className="text-green-200 truncate">{p.patientName}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
