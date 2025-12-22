// TypeScript type definitions untuk DokterBubung Hospital Management System

export interface Medicine {
    id: string;
    name: string;
    type: string;
    stock: number;
    price: number;
    expiry: string;
    location: string;
}

export interface PrescriptionItem {
    medicineId: string;
    name: string;
    qty: number;
    price: number;
    signa: string;
}

export interface HistoryLog {
    status: string;
    time: string;
    note: string;
}

export interface Prescription {
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

export interface Patient {
    id: string;
    name: string;
    dob: string;
    status: string;
    allergies: string;
}

export interface Log {
    id: number;
    date: string;
    type: string;
    medicineName: string;
    qty: number;
    ref: string;
    pic: string;
}

export type UserRole = 'doctor' | 'pharmacist' | 'admin' | 'public';

export interface User {
    name: string;
    role: UserRole;
}

export interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
}

// Context types
export interface HospitalContextType {
    medicines: Medicine[];
    prescriptions: Prescription[];
    patients: Patient[];
    logs: Log[];
    currentUser: User;

    // Actions
    addMedicine: (medicine: Medicine) => void;
    updateMedicineStock: (id: string, amount: number) => void;

    createPrescription: (data: Omit<Prescription, 'id' | 'status' | 'historyLogs' | 'date'>) => void;
    updatePrescriptionStatus: (id: string, status: string) => void;

    addPatient: (patient: Omit<Patient, 'id' | 'status'>) => void;
    removePatient: (id: string) => void;

    addLog: (log: Omit<Log, 'id'>) => void;

    switchUser: (role: UserRole) => void;
}
