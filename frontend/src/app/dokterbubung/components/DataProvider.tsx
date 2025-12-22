'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    Medicine,
    Prescription,
    Patient,
    Log,
    User,
    UserRole,
    HospitalContextType
} from '../types';
import { api } from '../utils/api';

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const useHospital = () => {
    const context = useContext(HospitalContext);
    if (!context) {
        throw new Error('useHospital must be used within HospitalProvider');
    }
    return context;
};

interface HospitalProviderProps {
    children: ReactNode;
}

export const HospitalProvider: React.FC<HospitalProviderProps> = ({ children }) => {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const [currentUser, setCurrentUser] = useState<User>({
        name: 'Dr. Izzati Muhimmah',
        role: 'doctor'
    });
    const [loading, setLoading] = useState(true);

    // Fetch all data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [medicinesData, prescriptionsData, patientsData, logsData] = await Promise.all([
                    api.getMedicines(),
                    api.getPrescriptions(),
                    api.getPatients(),
                    api.getLogs()
                ]);

                setMedicines(medicinesData || []);
                setPrescriptions(prescriptionsData || []);
                setPatients(patientsData || []);
                setLogs(logsData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Medicine actions
    const addMedicine = async (medicine: Medicine) => {
        try {
            const newMedicine = await api.createMedicine(medicine);
            setMedicines([...medicines, newMedicine]);
        } catch (error) {
            console.error('Error adding medicine:', error);
            throw error;
        }
    };

    const updateMedicineStock = async (id: string, amount: number) => {
        try {
            await api.restockMedicine(id, amount);
            // Refresh medicines
            const updatedMedicines = await api.getMedicines();
            setMedicines(updatedMedicines);
            // Refresh logs
            const updatedLogs = await api.getLogs();
            setLogs(updatedLogs);
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    };

    // Prescription actions
    const createPrescription = async (data: Omit<Prescription, 'id' | 'status' | 'historyLogs' | 'date'>) => {
        try {
            const payload = {
                patient_name: data.patientName,
                patient_dob: data.patientDob,
                allergies: data.allergies,
                doctor_name: data.doctorName,
                items: data.items.map(item => ({
                    medicine_id: item.medicineId,
                    name: item.name,
                    qty: item.qty,
                    price: item.price,
                    signa: item.signa
                }))
            };

            const newPrescription = await api.createPrescription(payload);
            setPrescriptions([...prescriptions, newPrescription]);
        } catch (error) {
            console.error('Error creating prescription:', error);
            throw error;
        }
    };

    const updatePrescriptionStatus = async (id: string, status: string) => {
        try {
            const action = status === 'Process' ? 'process' : 'finish';
            await api.updatePrescriptionStatus(id, action);

            // Refresh prescriptions, medicines, and logs
            const [updatedPrescriptions, updatedMedicines, updatedLogs] = await Promise.all([
                api.getPrescriptions(),
                api.getMedicines(),
                api.getLogs()
            ]);

            setPrescriptions(updatedPrescriptions);
            setMedicines(updatedMedicines);
            setLogs(updatedLogs);
        } catch (error) {
            console.error('Error updating prescription status:', error);
            throw error;
        }
    };

    // Patient actions
    const addPatient = async (patientData: Omit<Patient, 'id' | 'status'>) => {
        try {
            const payload = {
                name: patientData.name,
                dob: patientData.dob,
                allergies: patientData.allergies || '-'
            };

            const newPatient = await api.addPatient(payload);
            setPatients([...patients, newPatient]);
        } catch (error) {
            console.error('Error adding patient:', error);
            throw error;
        }
    };

    const removePatient = async (id: string) => {
        try {
            await api.removePatient(id);
            setPatients(patients.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error removing patient:', error);
            throw error;
        }
    };

    // Log actions
    const addLog = (logData: Omit<Log, 'id'>) => {
        // Logs are created automatically by backend, so just refresh
        api.getLogs().then(setLogs);
    };

    // User actions
    const switchUser = (role: UserRole) => {
        const userNames: Record<UserRole, string> = {
            doctor: 'Dr. Izzati Muhimmah',
            pharmacist: 'Apt. Budi Santoso',
            admin: 'Staff Gudang',
            public: 'Public Screen'
        };
        setCurrentUser({ name: userNames[role], role });
    };

    const value: HospitalContextType = {
        medicines,
        prescriptions,
        patients,
        logs,
        currentUser,
        addMedicine,
        updateMedicineStock,
        createPrescription,
        updatePrescriptionStatus,
        addPatient,
        removePatient,
        addLog,
        switchUser
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <HospitalContext.Provider value={value}>
            {children}
        </HospitalContext.Provider>
    );
};
