import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// =====================================
// PRISMA CLIENT SETUP
// =====================================

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// =====================================
// DATABASE CONNECTION HELPERS
// =====================================

export const connectPostgreSQL = async () => {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    throw error;
  }
};

export const disconnectPostgreSQL = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ PostgreSQL disconnected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL disconnection failed:', error);
  }
};

// =====================================
// USER MANAGEMENT SERVICES
// =====================================

export class UserService {
  static async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'PATIENT' | 'DENTIST' | 'ADMIN';
    phone?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
      }
    });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        patient: true,
        dentist: {
          include: {
            clinic: true
          }
        }
      }
    });
  }

  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        patient: true,
        dentist: {
          include: {
            clinic: true
          }
        }
      }
    });
  }

  static async updateUser(id: string, data: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  }>) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        phone: true,
        avatar: true,
        updatedAt: true,
      }
    });
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLogin: new Date() }
    });
  }
}

// =====================================
// PATIENT SERVICES
// =====================================

export class PatientService {
  static async createPatient(userId: string, data: {
    dateOfBirth?: Date;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    bloodType?: string;
    allergies?: string;
    medications?: string;
  }) {
    return prisma.patient.create({
      data: {
        userId,
        ...data,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          }
        }
      }
    });
  }

  static async getPatientByUserId(userId: string) {
    return prisma.patient.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
          }
        },
        appointments: {
          include: {
            dentist: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  }
                },
                clinic: true,
              }
            }
          },
          orderBy: {
            scheduledAt: 'desc'
          }
        }
      }
    });
  }

  static async updatePatient(userId: string, data: Partial<{
    dateOfBirth: Date;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    address: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    bloodType: string;
    allergies: string;
    medications: string;
  }>) {
    return prisma.patient.update({
      where: { userId },
      data,
    });
  }
}

// =====================================
// DENTIST SERVICES
// =====================================

export class DentistService {
  static async createDentist(userId: string, data: {
    licenseNumber: string;
    specializations?: string[];
    yearsExperience?: number;
    education?: string;
    university?: string;
    graduationYear?: number;
    clinicName?: string;
    clinicAddress?: string;
    verificationDocs?: string[];
  }) {
    return prisma.dentist.create({
      data: {
        userId,
        ...data,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          }
        }
      }
    });
  }

  static async getDentistByUserId(userId: string) {
    return prisma.dentist.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatar: true,
          }
        },
        clinic: true,
        appointments: {
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                    phone: true,
                  }
                }
              }
            }
          },
          orderBy: {
            scheduledAt: 'desc'
          }
        }
      }
    });
  }

  static async updateDentist(userId: string, data: Partial<{
    specializations: string[];
    yearsExperience: number;
    education: string;
    university: string;
    graduationYear: number;
    clinicName: string;
    clinicAddress: string;
    isVerified: boolean;
    verifiedAt: Date;
    verificationDocs: string[];
    clinicId: string;
  }>) {
    return prisma.dentist.update({
      where: { userId },
      data,
    });
  }

  static async verifyDentist(userId: string) {
    return prisma.dentist.update({
      where: { userId },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
      }
    });
  }

  static async getVerifiedDentists() {
    return prisma.dentist.findMany({
      where: { isVerified: true },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          }
        },
        clinic: true,
      }
    });
  }
}

// =====================================
// APPOINTMENT SERVICES
// =====================================

export class AppointmentService {
  static async createAppointment(data: {
    patientId: string;
    dentistId: string;
    scheduledAt: Date;
    duration?: number;
    type: 'CONSULTATION' | 'CLEANING' | 'FILLING' | 'EXTRACTION' | 'ROOT_CANAL' | 'CROWN' | 'BRIDGE' | 'ORTHODONTICS' | 'SURGERY' | 'EMERGENCY' | 'FOLLOW_UP';
    notes?: string;
    estimatedCost?: number;
  }) {
    return prisma.appointment.create({
      data,
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
              }
            }
          }
        },
        dentist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            },
            clinic: true,
          }
        }
      }
    });
  }

  static async getAppointmentById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
              }
            }
          }
        },
        dentist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            },
            clinic: true,
          }
        },
        payments: true,
      }
    });
  }

  static async updateAppointmentStatus(id: string, status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW') {
    return prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }

  static async getAppointmentsByPatient(patientId: string) {
    return prisma.appointment.findMany({
      where: { patientId },
      include: {
        dentist: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            },
            clinic: true,
          }
        },
        payments: true,
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    });
  }

  static async getAppointmentsByDentist(dentistId: string) {
    return prisma.appointment.findMany({
      where: { dentistId },
      include: {
        patient: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              }
            }
          }
        },
        payments: true,
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    });
  }
}

// =====================================
// SESSION MANAGEMENT
// =====================================

export class SessionService {
  static async createSession(data: {
    userId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
  }) {
    return prisma.session.create({
      data,
    });
  }

  static async getSessionByToken(accessToken: string) {
    return prisma.session.findUnique({
      where: { accessToken },
      include: {
        user: {
          include: {
            patient: true,
            dentist: true,
          }
        }
      }
    });
  }

  static async deleteSession(accessToken: string) {
    return prisma.session.delete({
      where: { accessToken },
    });
  }

  static async deleteExpiredSessions() {
    return prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
}

// =====================================
// HEALTH CHECK
// =====================================

export const healthCheck = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() };
  }
};
