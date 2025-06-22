import { PrismaClient, TreatmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTreatmentData {
  treatmentPlanId?: string;
  dentistId: string;
  name: string;
  description?: string;
  cost?: number;
  duration?: number;
  toothNumbers?: number[];
}

export interface UpdateTreatmentData {
  name?: string;
  description?: string;
  cost?: number;
  duration?: number;
  status?: TreatmentStatus;
  toothNumbers?: number[];
}

export class TreatmentService {
  static async createTreatment(data: CreateTreatmentData) {
    return await prisma.treatment.create({
      data: {
        ...data,
        status: TreatmentStatus.PLANNED,
      },
      include: {
        dentist: {
          include: { user: true },
        },
        treatmentPlan: true,
      },
    });
  }

  static async getTreatmentById(id: string) {
    return await prisma.treatment.findUnique({
      where: { id },
      include: {
        dentist: {
          include: { user: true },
        },
        treatmentPlan: true,
      },
    });
  }

  static async getTreatmentsByPlan(treatmentPlanId: string) {
    return await prisma.treatment.findMany({
      where: { treatmentPlanId },
      include: {
        dentist: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async updateTreatment(id: string, data: UpdateTreatmentData) {
    return await prisma.treatment.update({
      where: { id },
      data,
      include: {
        dentist: {
          include: { user: true },
        },
        treatmentPlan: true,
      },
    });
  }

  static async deleteTreatment(id: string) {
    return await prisma.treatment.delete({
      where: { id },
    });
  }

  static async updateTreatmentStatus(id: string, status: TreatmentStatus) {
    return await prisma.treatment.update({
      where: { id },
      data: { status },
    });
  }
}
