/**
 * Authentication and User Types for Dentalization Mobile App
 * Based on the Prisma schema definitions
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  DENTIST = 'DENTIST',
  PATIENT = 'PATIENT'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional properties expected by the app
  isActive: boolean;
  preferredLanguage: string;
}

export interface Admin {
  id: string;
  userId: string;
  permissions: string[];
  department?: string;
  user?: User;
}

export interface Dentist {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization?: string;
  yearsOfExperience?: number;
  clinicName?: string;
  clinicAddress?: string;
  isVerified: boolean;
  user?: User;
}

export interface Patient {
  id: string;
  userId: string;
  dateOfBirth: Date;
  gender: Gender;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string;
  medicalHistory?: string;
  user?: User;
}
