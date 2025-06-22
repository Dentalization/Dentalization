import { PrismaClient, AppointmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateAppointmentData {
  patientId: string;
  dentistId: string;
  startTime: Date;
  endTime: Date;
  title: string;
  description?: string;
  reminderTime?: Date;
}

export interface UpdateAppointmentData {
  startTime?: Date;
  endTime?: Date;
  title?: string;
  description?: string;
  status?: AppointmentStatus;
  reminderTime?: Date;
}

export class AppointmentService {
  static async createAppointment(data: CreateAppointmentData) {
    return await prisma.appointment.create({
      data: {
        ...data,
        status: AppointmentStatus.SCHEDULED,
      },
      include: {
        patient: {
          include: { user: true },
        },
        dentist: {
          include: { user: true },
        },
      },
    });
  }

  static async getAppointmentById(id: string) {
    return await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: { user: true },
        },
        dentist: {
          include: { user: true },
        },
      },
    });
  }

  static async updateAppointment(id: string, data: UpdateAppointmentData) {
    return await prisma.appointment.update({
      where: { id },
      data,
      include: {
        patient: {
          include: { user: true },
        },
        dentist: {
          include: { user: true },
        },
      },
    });
  }

  static async deleteAppointment(id: string) {
    return await prisma.appointment.delete({
      where: { id },
    });
  }

  static async getAppointmentsByPatient(patientId: string) {
    return await prisma.appointment.findMany({
      where: { patientId },
      include: {
        dentist: {
          include: { user: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  static async getAppointmentsByDentist(dentistId: string) {
    return await prisma.appointment.findMany({
      where: { dentistId },
      include: {
        patient: {
          include: { user: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  static async getAppointmentsByDateRange(startDate: Date, endDate: Date) {
    return await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        patient: {
          include: { user: true },
        },
        dentist: {
          include: { user: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  static async updateAppointmentStatus(id: string, status: AppointmentStatus) {
    return await prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
