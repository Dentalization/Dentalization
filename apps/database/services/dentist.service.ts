import { PrismaClient, Dentist } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateDentistData {
  userId: string;
  licenseNumber: string;
  specialization: string[];
  yearsOfExperience?: number;
  bio?: string;
  education?: string;
  certifications?: string[];
}

export interface UpdateDentistData {
  licenseNumber?: string;
  specialization?: string[];
  yearsOfExperience?: number;
  bio?: string;
  education?: string;
  certifications?: string[];
}

export class DentistService {
  static async createDentist(data: CreateDentistData) {
    return await prisma.dentist.create({
      data,
      include: {
        user: true,
      },
    });
  }

  static async getDentistById(id: string) {
    return await prisma.dentist.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  static async getDentistByUserId(userId: string) {
    return await prisma.dentist.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  static async updateDentist(id: string, data: UpdateDentistData) {
    return await prisma.dentist.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  static async deleteDentist(id: string) {
    return await prisma.dentist.delete({
      where: { id },
    });
  }

  static async getAllDentists() {
    return await prisma.dentist.findMany({
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

  static async searchDentists(query: string) {
    return await prisma.dentist.findMany({
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
            licenseNumber: { contains: query, mode: 'insensitive' },
          },
        ],
      },
      include: {
        user: true,
      },
    });
  }
}
