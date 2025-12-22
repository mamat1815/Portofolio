import { Medicine, Prescription, Patient, Log } from '../types';

// Initial mock data
export const INITIAL_MEDICINES: Medicine[] = [
    { id: 'OBT001', name: 'Amoxicillin 500mg', type: 'Tablet', stock: 50, price: 15000, expiry: '2026-05-20', location: 'Rak A1' },
    { id: 'OBT002', name: 'Paracetamol 500mg', type: 'Tablet', stock: 120, price: 5000, expiry: '2027-01-15', location: 'Rak A2' },
    { id: 'OBT003', name: 'OBH Combi Anak', type: 'Sirup', stock: 8, price: 25000, expiry: '2025-08-10', location: 'Rak B1' },
    { id: 'OBT004', name: 'Vitamin C 1000mg', type: 'Tablet', stock: 80, price: 45000, expiry: '2025-07-01', location: 'Rak C1' },
    { id: 'OBT005', name: 'Simvastatin 10mg', type: 'Tablet', stock: 5, price: 30000, expiry: '2025-11-05', location: 'Rak A3' },
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
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

export const INITIAL_PATIENT_QUEUE: Patient[] = [
    { id: 'P-001', name: 'Siti Aminah', dob: '1990-01-01', status: 'Waiting', allergies: 'Seafood' },
    { id: 'P-002', name: 'Rahmat Hidayat', dob: '1988-05-12', status: 'Waiting', allergies: '-' },
    { id: 'P-003', name: 'Joko Widodo', dob: '1975-10-20', status: 'Examining', allergies: 'Penicillin' },
];

export const INITIAL_LOGS: Log[] = [
    { id: 1, date: '2025-06-14', type: 'OUT', medicineName: 'Paracetamol 500mg', qty: 10, ref: 'RSP-8821', pic: 'Apoteker Jaga' }
];

// Helper functions
export const formatCurrency = (val: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

export const generatePrescriptionId = () =>
    `RSP-${Math.floor(1000 + Math.random() * 9000)}`;

export const generatePatientId = (currentCount: number) =>
    `P-${String(currentCount + 1).padStart(3, '0')}`;
