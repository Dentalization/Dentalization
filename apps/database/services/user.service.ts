import { PrismaClient, User, UserRole, UserStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: UserStatus;
  avatar?: string;
}

export class UserService {
  static async createUser(data: CreateUserData): Promise<User> {
    return await prisma.user.create({
      data: {
        ...data,
        status: UserStatus.ACTIVE,
      },
    });
  }

  static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        adminProfile: true,
        dentistProfile: true,
        patientProfile: true,
      },
    });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        adminProfile: true,
        dentistProfile: true,
        patientProfile: true,
      },
    });
  }

  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async deleteUser(id: string): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  static async getAllUsers(role?: UserRole): Promise<User[]> {
    return await prisma.user.findMany({
      where: role ? { role } : undefined,
      include: {
        adminProfile: true,
        dentistProfile: true,
        patientProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  static async searchUsers(query: string): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        adminProfile: true,
        dentistProfile: true,
        patientProfile: true,
      },
    });
  }
}
