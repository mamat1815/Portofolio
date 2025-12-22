// API Client for DokterBubung Backend
import { Medicine, Prescription, Patient, Log } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/hospital';

export const api = {
    // Medicines
    getMedicines: async (): Promise<Medicine[]> => {
        const res = await fetch(`${API_BASE_URL}/medicines`);
        if (!res.ok) throw new Error('Failed to fetch medicines');
        return res.json();
    },

    createMedicine: async (medicine: Medicine): Promise<Medicine> => {
        const res = await fetch(`${API_BASE_URL}/medicines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicine)
        });
        if (!res.ok) throw new Error('Failed to create medicine');
        return res.json();
    },

    restockMedicine: async (id: string, amount: number): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/medicines/${id}/restock`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });
        if (!res.ok) throw new Error('Failed to restock medicine');
    },

    // Prescriptions
    getPrescriptions: async (): Promise<Prescription[]> => {
        const res = await fetch(`${API_BASE_URL}/prescriptions`);
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
        const res = await fetch(`${API_BASE_URL}/prescriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create prescription');
        return res.json();
    },

    updatePrescriptionStatus: async (id: string, action: 'process' | 'finish'): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/prescriptions/${id}/status?action=${action}`, {
            method: 'PUT'
        });
        if (!res.ok) throw new Error('Failed to update prescription status');
    },

    // Patients
    getPatients: async (): Promise<Patient[]> => {
        const res = await fetch(`${API_BASE_URL}/patients`);
        if (!res.ok) throw new Error('Failed to fetch patients');
        return res.json();
    },

    addPatient: async (data: {
        name: string;
        dob: string;
        allergies: string;
    }): Promise<Patient> => {
        const res = await fetch(`${API_BASE_URL}/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to add patient');
        return res.json();
    },

    removePatient: async (id: string): Promise<void> => {
        const res = await fetch(`${API_BASE_URL}/patients/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to remove patient');
    },

    // Logs
    getLogs: async (): Promise<Log[]> => {
        const res = await fetch(`${API_BASE_URL}/logs`);
        if (!res.ok) throw new Error('Failed to fetch logs');
        return res.json();
    }
};
