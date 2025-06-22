// PostgreSQL Database Configuration with Prisma
// This file exports all database services and connections

import { PrismaClient } from '@prisma/client';

// Re-export all services
export * from './services';

// Re-export Prisma client and types
export { PrismaClient } from '@prisma/client';

// =====================================
// SIMPLIFIED DATABASE CLIENT
// =====================================

export class DatabaseClient {
  private static instance: DatabaseClient;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  async connect() {
    try {
      console.log('🔄 Connecting to PostgreSQL database...');
      await this.prisma.$connect();
      console.log('✅ PostgreSQL database connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      console.log('🔄 Disconnecting from database...');
      await this.prisma.$disconnect();
      console.log('✅ Database disconnected');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
      throw error;
    }
  }

  async healthCheck() {
    const results: any = {
      timestamp: new Date().toISOString()
    };

    // PostgreSQL health check
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      results.postgresql = { status: 'healthy' };
    } catch (error) {
      results.postgresql = { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : String(error)
      };
    }

    return results;
  }

  // Get Prisma client for direct database operations
  getPrismaClient(): PrismaClient {
    return this.prisma;
  }
}

// =====================================
// CONVENIENCE EXPORTS
// =====================================

// Export default instance
export const db = DatabaseClient.getInstance();

// Simple connection helpers
export async function connectDatabase() {
  return await db.connect();
}

export async function disconnectDatabase() {
  return await db.disconnect();
}

// Health check
export async function healthCheck() {
  return await db.healthCheck();
}

// Get Prisma client instance
export function getPrismaClient(): PrismaClient {
  return db.getPrismaClient();
}
