import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateAdminData {
  userId: string;
  permissions: string[];
}

export interface UpdateAdminData {
  permissions?: string[];
}

export class AdminService {
  static async createAdmin(data: CreateAdminData) {
    return await prisma.admin.create({
      data,
      include: {
        user: true,
      },
    });
  }

  static async getAdminById(id: string) {
    return await prisma.admin.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  static async getAdminByUserId(userId: string) {
    return await prisma.admin.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  static async updateAdmin(id: string, data: UpdateAdminData) {
    return await prisma.admin.update({
      where: { id },
      data,
      include: {
        user: true,
      },
    });
  }

  static async deleteAdmin(id: string) {
    return await prisma.admin.delete({
      where: { id },
    });
  }

  static async getAllAdmins() {
    return await prisma.admin.findMany({
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
}
