
import { User, UserRole } from "@/contexts/AuthContext";

// Types
export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string; // ISO string
  time: string; // e.g., "9:00 AM"
  duration: number; // minutes
  status: "scheduled" | "completed" | "cancelled";
  reason: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string; // ISO string
  startTime: string; // e.g., "9:00 AM"
  endTime: string; // e.g., "9:30 AM"
  isBooked: boolean;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string; // ISO string
  title: string;
  content: string;
  type: "Lab Result" | "Consultation" | "Prescription" | "Radiology";
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string; // ISO string
  gender: "Male" | "Female" | "Other";
  contactNumber: string;
  address: string;
  medicalHistory: string[];
  allergies: string[];
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualifications: string[];
  experience: number; // years
  contactNumber: string;
  availableDays: string[]; // e.g., ["Monday", "Wednesday"]
  bio: string;
}

// Mock Data
const mockDoctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sarah Smith",
    email: "doctor@example.com",
    specialization: "Cardiology",
    qualifications: ["MD", "PhD", "FACC"],
    experience: 10,
    contactNumber: "+1 (555) 123-4567",
    availableDays: ["Monday", "Wednesday", "Friday"],
    bio: "Dr. Sarah Smith is a board-certified cardiologist with over 10 years of experience in treating cardiovascular diseases.",
  }
];

const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "John Doe",
    email: "patient@example.com",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    contactNumber: "+1 (555) 987-6543",
    address: "123 Main St, Anytown, USA",
    medicalHistory: ["Hypertension", "Asthma"],
    allergies: ["Penicillin"],
    bloodType: "O+",
  }
];

const mockAppointments: Appointment[] = [
  {
    id: "app1",
    doctorId: "d1",
    doctorName: "Dr. Sarah Smith",
    patientId: "p1",
    patientName: "John Doe",
    date: "2025-04-15",
    time: "10:00 AM",
    duration: 30,
    status: "scheduled",
    reason: "Annual checkup",
  },
  {
    id: "app2",
    doctorId: "d1",
    doctorName: "Dr. Sarah Smith",
    patientId: "p1",
    patientName: "John Doe",
    date: "2025-04-05",
    time: "2:00 PM",
    duration: 45,
    status: "completed",
    reason: "Chest pain",
  }
];

const mockReports: MedicalReport[] = [
  {
    id: "rep1",
    patientId: "p1",
    doctorId: "d1",
    doctorName: "Dr. Sarah Smith",
    date: "2025-04-05",
    title: "Annual Physical Examination",
    content: "Patient is in good health overall. Blood pressure: 120/80 mmHg. Heart rate: 72 BPM. No significant findings.",
    type: "Consultation",
  },
  {
    id: "rep2",
    patientId: "p1",
    doctorId: "d1",
    doctorName: "Dr. Sarah Smith",
    date: "2025-04-05",
    title: "Blood Test Results",
    content: "CBC: Normal\nCholesterol: 190 mg/dL (normal)\nGlucose: 95 mg/dL (normal)\nAll other parameters within normal range.",
    type: "Lab Result",
  }
];

const mockTimeSlots: TimeSlot[] = [
  {
    id: "ts1",
    doctorId: "d1",
    date: "2025-04-15",
    startTime: "9:00 AM",
    endTime: "9:30 AM",
    isBooked: false,
  },
  {
    id: "ts2",
    doctorId: "d1",
    date: "2025-04-15",
    startTime: "9:30 AM",
    endTime: "10:00 AM",
    isBooked: false,
  },
  {
    id: "ts3",
    doctorId: "d1",
    date: "2025-04-15",
    startTime: "10:00 AM",
    endTime: "10:30 AM",
    isBooked: true,
  },
  {
    id: "ts4",
    doctorId: "d1",
    date: "2025-04-15",
    startTime: "10:30 AM",
    endTime: "11:00 AM",
    isBooked: false,
  }
];

// Service functions
export const getPatientProfile = (patientId: string): Patient | undefined => {
  return mockPatients.find(p => p.id === patientId);
};

export const getDoctorProfile = (doctorId: string): Doctor | undefined => {
  return mockDoctors.find(d => d.id === doctorId);
};

export const getPatientAppointments = (patientId: string): Appointment[] => {
  return mockAppointments.filter(a => a.patientId === patientId);
};

export const getDoctorAppointments = (doctorId: string): Appointment[] => {
  return mockAppointments.filter(a => a.doctorId === doctorId);
};

export const getPatientReports = (patientId: string): MedicalReport[] => {
  return mockReports.filter(r => r.patientId === patientId);
};

export const getDoctorAvailability = (doctorId: string, date?: string): TimeSlot[] => {
  if (date) {
    return mockTimeSlots.filter(ts => ts.doctorId === doctorId && ts.date === date);
  }
  return mockTimeSlots.filter(ts => ts.doctorId === doctorId);
};

export const getDoctorPatients = (doctorId: string): Patient[] => {
  // Get unique patient IDs from appointments
  const patientIds = [...new Set(
    mockAppointments
      .filter(a => a.doctorId === doctorId)
      .map(a => a.patientId)
  )];
  
  // Return patient details for each ID
  return mockPatients.filter(p => patientIds.includes(p.id));
};

export const getPatientDetails = (patientId: string): {
  patient: Patient | undefined;
  appointments: Appointment[];
  reports: MedicalReport[];
} => {
  return {
    patient: getPatientProfile(patientId),
    appointments: getPatientAppointments(patientId),
    reports: getPatientReports(patientId),
  };
};
