export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  preferredLanguage: 'id' | 'en';
}
export type UserRole = 'patient' | 'dentist' | 'admin' | 'clinic_staff';
export interface Patient extends User {
  role: 'patient';
  medicalHistory?: MedicalHistory;
  emergencyContact?: EmergencyContact;
  insuranceInfo?: InsuranceInfo;
}
export interface Dentist extends User {
  role: 'dentist';
  licenseNumber: string;
  specializations: string[];
  clinicId?: string;
  yearsOfExperience: number;
  education: Education[];
  isVerified: boolean;
}
export interface MedicalHistory {
  allergies: string[];
  medications: string[];
  conditions: string[];
  previousTreatments: PreviousTreatment[];
  lastDentalVisit?: Date;
}
export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
}
export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  isActive: boolean;
}
export interface Education {
  institution: string;
  degree: string;
  year: number;
  country: string;
}
export interface PreviousTreatment {
  treatment: string;
  date: Date;
  dentist?: string;
  clinic?: string;
  notes?: string;
}
//# sourceMappingURL=user.d.ts.map
