// PostgreSQL-only database package for Dentalization
export { PrismaClient } from '@prisma/client';

// Re-export Prisma types (will be available after generation)
export type * from '@prisma/client';

// Initialize and export Prisma client
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export services (commented out for now due to type issues)
// export * from './services';

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Database connection management
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
}

// Export individual services
export { UserService } from './services/user.service';
export { PatientService } from './services/patient.service';
export { DentistService } from './services/dentist.service';
export { AdminService } from './services/admin.service';
export { AppointmentService } from './services/appointment.service';
// Temporarily commented out due to type issues
// export { DentalRecordService } from './services/dental-record.service';
// export { TreatmentService } from './services/treatment.service';
// export { PaymentService } from './services/payment.service';
