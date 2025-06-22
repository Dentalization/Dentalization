import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePaymentData {
  patientId: string;
  amount: number;
  description?: string;
  paymentMethod?: string;
  dueDate?: Date;
}

export interface UpdatePaymentData {
  amount?: number;
  description?: string;
  paymentMethod?: string;
  dueDate?: Date;
  paidDate?: Date;
}

export class PaymentService {
  static async createPayment(data: CreatePaymentData) {
    return await prisma.payment.create({
      data,
      include: {
        patient: {
          include: { user: true },
        },
      },
    });
  }

  static async getPaymentById(id: string) {
    return await prisma.payment.findUnique({
      where: { id },
      include: {
        patient: {
          include: { user: true },
        },
      },
    });
  }

  static async getPaymentsByPatient(patientId: string) {
    return await prisma.payment.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updatePayment(id: string, data: UpdatePaymentData) {
    return await prisma.payment.update({
      where: { id },
      data,
      include: {
        patient: {
          include: { user: true },
        },
      },
    });
  }

  static async deletePayment(id: string) {
    return await prisma.payment.delete({
      where: { id },
    });
  }

  static async markPaymentAsPaid(id: string) {
    return await prisma.payment.update({
      where: { id },
      data: {
        paidDate: new Date(),
      },
    });
  }
}
