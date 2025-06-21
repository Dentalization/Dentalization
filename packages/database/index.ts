// Hybrid Database Configuration
// This file exports all database services and connections

import { connectPostgreSQL, disconnectPostgreSQL, prisma } from './postgresql';
import { connectMongoDB, disconnectMongoDB } from './mongodb/schemas';
import { VectorDBFactory, ImageEmbeddingService } from './vector';

// Re-export PostgreSQL services
export * from './postgresql';

// Re-export MongoDB schemas and services
export * from './mongodb/schemas';

// Re-export Vector DB services
export * from './vector';

// =====================================
// UNIFIED DATABASE CLIENT
// =====================================

export class DatabaseClient {
  private static instance: DatabaseClient;
  private vectorDB: any;
  private imageEmbeddingService: ImageEmbeddingService | null = null;

  private constructor() {}

  static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  async connect(options: {
    vectorDBType?: 'pinecone' | 'qdrant' | 'weaviate';
  } = {}) {
    try {
      console.log('🔄 Connecting to databases...');

      // Connect to PostgreSQL
      await connectPostgreSQL();

      // Connect to MongoDB
      await connectMongoDB();

      // Connect to Vector Database
      const vectorDBType = options.vectorDBType || 
        (process.env.PINECONE_API_KEY ? 'pinecone' : 'qdrant');
      
      this.vectorDB = VectorDBFactory.create(vectorDBType);
      await this.vectorDB.connect();

      // Initialize image embedding service
      this.imageEmbeddingService = new ImageEmbeddingService(this.vectorDB);

      console.log('✅ All databases connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      console.log('🔄 Disconnecting from databases...');

      // Disconnect from PostgreSQL
      await disconnectPostgreSQL();

      // Disconnect from MongoDB
      await disconnectMongoDB();

      // Disconnect from Vector Database
      if (this.vectorDB) {
        await this.vectorDB.disconnect();
      }

      console.log('✅ All databases disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
    }
  }

  getImageEmbeddingService(): ImageEmbeddingService {
    if (!this.imageEmbeddingService) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.imageEmbeddingService;
  }

  async healthCheck() {
    const results: {
      postgresql: { status: string; error?: string };
      mongodb: { status: string; error?: string };
      vectordb: { status: string; error?: string };
      timestamp: string;
    } = {
      postgresql: { status: 'unknown' },
      mongodb: { status: 'unknown' },
      vectordb: { status: 'unknown' },
      timestamp: new Date().toISOString()
    };

    try {
      // PostgreSQL health check
      await prisma.$queryRaw`SELECT 1`;
      results.postgresql = { status: 'healthy' };
    } catch (error) {
      results.postgresql = { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }

    try {
      // MongoDB health check
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        results.mongodb = { status: 'healthy' };
      } else {
        results.mongodb = { status: 'unhealthy', error: 'Not connected' };
      }
    } catch (error) {
      results.mongodb = { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }

    try {
      // Vector DB health check
      if (this.vectorDB) {
        await this.vectorDB.getStats();
        results.vectordb = { status: 'healthy' };
      } else {
        results.vectordb = { status: 'unhealthy', error: 'Not connected' };
      }
    } catch (error) {
      results.vectordb = { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }

    return results;
  }
}

// =====================================
// CONVENIENCE EXPORTS
// =====================================

// Default database client instance
export const db = DatabaseClient.getInstance();

// Quick access to services
export { 
  UserService, 
  PatientService, 
  DentistService, 
  AppointmentService, 
  SessionService 
} from './postgresql';

export { 
  DentalRecord, 
  MedicalHistory, 
  TreatmentTemplate 
} from './mongodb/schemas';

// =====================================
// INITIALIZATION HELPER
// =====================================

export const initializeDatabase = async (options?: {
  vectorDBType?: 'pinecone' | 'qdrant' | 'weaviate';
}) => {
  try {
    await db.connect(options);
    console.log('🎉 Database initialization completed');
    return db;
  } catch (error) {
    console.error('💥 Database initialization failed:', error);
    throw error;
  }
};

// Graceful shutdown
export const shutdownDatabase = async () => {
  try {
    await db.disconnect();
    console.log('👋 Database shutdown completed');
  } catch (error) {
    console.error('💥 Database shutdown failed:', error);
  }
};
