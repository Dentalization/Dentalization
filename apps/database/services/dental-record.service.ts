import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DentalRecordService {
  static async createDentalRecord(data: {
    patientId: string;
    dentistId: string;
    visitDate: Date;
    chiefComplaint?: string;
    examination?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
    toothChart?: any;
    xrayImages?: string[];
    photos?: string[];
    documents?: string[];
  }) {
    return await prisma.dentalRecord.create({
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

  static async getDentalRecordById(id: string) {
    return await prisma.dentalRecord.findUnique({
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

  static async getDentalRecordsByPatient(patientId: string) {
    return await prisma.dentalRecord.findMany({
      where: { patientId },
      include: {
        dentist: {
          include: { user: true },
        },
      },
      orderBy: { visitDate: 'desc' },
    });
  }

  static async updateDentalRecord(id: string, data: {
    chiefComplaint?: string;
    examination?: string;
    diagnosis?: string;
    treatment?: string;
    notes?: string;
    toothChart?: any;
    xrayImages?: string[];
    photos?: string[];
    documents?: string[];
  }) {
    return await prisma.dentalRecord.update({
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

  static async deleteDentalRecord(id: string) {
    return await prisma.dentalRecord.delete({
      where: { id },
    });
  }
}
