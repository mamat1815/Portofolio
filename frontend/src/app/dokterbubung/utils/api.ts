// API Client for DokterBubung Backend
import { Medicine, Prescription, Patient, Log } from '../types';

// API_BASE_URL already includes /hospital, so don't add it again!
// API base url itu pasti pakai /hospital karena di settingan railway cuman sampai api
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
    // Medicines
// Medicines
getMedicines: async (): Promise<Medicine[]> => {
    // Debugging: Log URL yang terbentuk
    console.log("Mencoba fetch ke URL:", `${API_BASE_URL}/hospital/medicines`);

    const res = await fetch(`${API_BASE_URL}/hospital/medicines`);
    
    // Debugging: Cek status errornya
    if (!res.ok) {
        console.error("Gagal Fetch! Status Code:", res.status);
        console.error("Pesan Error dari Server:", await res.text()); // Baca pesan errornya
        throw new Error(`Gagal ambil obat. Status: ${res.status}`);
    }
    
    return res.json();
},

    createMedicine: async (medicine: Medicine): Promise<Medicine> => {
        const res = await fetch(`${API_BASE_URL}/hospital/medicines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicine)
        });
        if (!res.ok) throw new Error('Failed to create medicine');
        return res.json();
    },

    restockMedicine: async (id: string, amount: number): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/hospital/medicines/${id}/restock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        if (!res.ok) throw new Error('Failed to restock medicine');
    },

    // Prescriptions
    getPrescriptions: async (): Promise<Prescription[]> => {
        const res = await fetch(`${API_BASE_URL}/hospital/prescriptions`);
        if (!res.ok) throw new Error('Failed to fetch prescriptions');
        return res.json();
    },

    createPrescription: async (data: {
        patient_name: string;
        patient_dob: string;
        allergies: string;
        doctor_name: string;
        items: Array<{
            medicine_id: string;
            name: string;
            qty: number;
            price: number;
            signa: string;
        }>;
    }): Promise<Prescription> => {
        const res = await fetch(`${API_BASE_URL}/hospital/prescriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create prescription');
        return res.json();
    },

    updatePrescriptionStatus: async (id: string, action: 'process' | 'finish'): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/hospital/prescriptions/${id}/status?action=${action}`, {
            method: 'PUT'
        });
        if (!res.ok) throw new Error('Failed to update prescription status');
    },

    // Patients
    getPatients: async (): Promise<Patient[]> => {
        const res = await fetch(`${API_BASE_URL}/hospital/patients`);
        if (!res.ok) throw new Error('Failed to fetch patients');
        return res.json();
    },

    addPatient: async (data: {
        name: string;
        dob: string;
        allergies: string;
    }): Promise<Patient> => {
        const res = await fetch(`${API_BASE_URL}/hospital/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to add patient');
        return res.json();
    },

    removePatient: async (id: string): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/hospital/patients/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to remove patient');
    },

    // Logs
    getLogs: async (): Promise<Log[]> => {
        const res = await fetch(`${API_BASE_URL}/hospital/logs`);
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
    }
};
