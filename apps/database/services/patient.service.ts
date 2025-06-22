import { PrismaClient, Patient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePatientData {
  userId: string;
  dateOfBirth?: Date;
  gender?: Gender;
  address?: string;
  emergencyContact?: string;
  insurance?: string;
}

export interface UpdatePatientData {
  dateOfBirth?: Date;
  gender?: Gender;
  address?: string;
  emergencyContact?: string;
  insurance?: string;
}

export class PatientService {
  static async createPatient(data: CreatePatientData) {
    return await prisma.patient.create({
      data,
      include: {
        user: true,
      },
    });
  }

  static async getPatientById(id: string) {
    return await prisma.patient.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  static async getPatientByUserId(userId: string) {
    return await prisma.patient.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  static async updatePatient(id: string, data: UpdatePatientData) {
    return await prisma.patient.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  static async deletePatient(id: string) {
    return await prisma.patient.delete({
      where: { id },
    });
  }

  static async getAllPatients() {
    return await prisma.patient.findMany({
      include: {
        user: true,
      },
      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
    });
  }

  static async searchPatients(query: string) {
    return await prisma.patient.findMany({
      where: {
        OR: [
          {
            user: {
              firstName: { contains: query, mode: 'insensitive' },
            },
          },
          {
            user: {
              lastName: { contains: query, mode: 'insensitive' },
            },
          },
          {
            user: {
              email: { contains: query, mode: 'insensitive' },
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });
  }
}
