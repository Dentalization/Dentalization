// Appointment and scheduling types
export interface Appointment {
  id: string;
  patientId: string;
  dentistId: string;
  clinicId?: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledAt: Date;
  duration: number; // in minutes
  reason: string;
  notes?: string;
  isVirtual: boolean;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancelReason?: string;
}

export type AppointmentType =
  | 'consultation'
  | 'cleaning'
  | 'filling'
  | 'extraction'
  | 'root_canal'
  | 'crown'
  | 'bridge'
  | 'implant'
  | 'orthodontics'
  | 'emergency'
  | 'follow_up'
  | 'virtual_consultation';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export interface AvailabilitySlot {
  id: string;
  dentistId: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  appointmentId?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  isAvailable: boolean;
  price?: number;
}

export interface ScheduleTemplate {
  id: string;
  dentistId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:mm format
  endTime: string;
  breakTimes: BreakTime[];
  isActive: boolean;
}

export interface BreakTime {
  startTime: string;
  endTime: string;
  reason?: string;
}
