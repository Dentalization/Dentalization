// Main export file for shared types
export * from './user';
export * from './appointment';
export * from './ai';
export * from './payment';
export * from './api';

// Re-export commonly used types with aliases
export type { User, Patient, Dentist } from './user';

export type { Appointment } from './appointment';

export type { AIAnalysis } from './ai';

export type { Payment } from './payment';

export type { ApiResponse } from './api';
