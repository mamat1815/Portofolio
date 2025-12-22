'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Stethoscope, History, ClipboardList, CheckCircle, Package, FileText, Settings } from 'lucide-react';
import { useHospital } from './DataProvider';
import { MenuItem } from '../types';

export default function Sidebar() {
    const { currentUser } = useHospital();
    const router = useRouter();
    const pathname = usePathname();

    const getMenus = (): MenuItem[] => {
        switch (currentUser.role) {
            case 'doctor':
                return [
                    { id: '/', label: 'Dashboard Dokter', icon: LayoutDashboard },
                    { id: '/workstation', label: 'Workstation Poli', icon: Stethoscope },
                    { id: '/history', label: 'Riwayat Resep', icon: History },
                ];
            case 'pharmacist':
                return [
                    { id: '/', label: 'Dashboard Farmasi', icon: LayoutDashboard },
                    { id: '/verification', label: 'Verifikasi & Racik', icon: ClipboardList },
                    { id: '/pickup', label: 'Penyerahan Obat', icon: CheckCircle },
                ];
            case 'admin':
                return [
                    { id: '/', label: 'Dashboard Gudang', icon: LayoutDashboard },
                    { id: '/inventory', label: 'Stok Obat', icon: Package },
                    { id: '/logs', label: 'Laporan Mutasi', icon: FileText },
                ];
            default:
                return [];
        }
    };

    const menus = getMenus();
    const basePath = pathname?.split('/').slice(0, 3).join('/') || '';

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 fixed left-0 top-16 bottom-0 overflow-y-auto border-r border-slate-800">
            <div className="p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">Menu Utama</p>
                <div className="space-y-1">
                    {menus.map((menu) => {
                        const Icon = menu.icon;
                        const fullPath = basePath + menu.id;
                        const isActive = pathname === fullPath;

                        return (
                            <button
                                key={menu.id}
                                onClick={() => router.push(fullPath)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                <Icon size={18} />
                                {menu.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="absolute bottom-0 w-full p-4 border-t border-slate-800 bg-slate-900">
                <button className="flex items-center gap-3 text-sm text-slate-400 hover:text-white w-full px-3 py-2 hover:bg-slate-800 rounded-lg transition-colors">
                    <Settings size={18} /> Pengaturan
                </button>
            </div>
        </aside>
    );
}
