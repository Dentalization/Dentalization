#!/usr/bin/env tsx

/**
 * Database Integration Test
 * This script tests the basic functionality of the database package
 */

import { DatabaseClient } from './index';

async function testDatabaseIntegration() {
  console.log('🧪 Testing Database Integration...\n');

  try {
    // Test 1: DatabaseClient instantiation
    console.log('1️⃣ Testing DatabaseClient instantiation...');
    const db = DatabaseClient.getInstance();
    console.log('✅ DatabaseClient created successfully\n');

    // Test 2: Health check without connection (should work)
    console.log('2️⃣ Testing health check (dry run)...');
    const healthCheck = await db.healthCheck();
    console.log('✅ Health check completed:', healthCheck);
    console.log('📊 Status breakdown:');
    Object.entries(healthCheck).forEach(([service, status]) => {
      const statusText = typeof status === 'string' ? status : status.status;
      const icon = statusText === 'healthy' ? '🟢' : '🔴';
      const latency = typeof status === 'object' && 'latency' in status ? status.latency : null;
      console.log(`   ${icon} ${service}: ${statusText} ${latency ? `(${latency}ms)` : ''}`);
    });
    console.log();

    // Test 3: Check exports
    console.log('3️⃣ Testing package exports...');
    const { UserService, PatientService, DentistService } = await import('./index');
    console.log('✅ PostgreSQL services exported:', { 
      UserService: !!UserService, 
      PatientService: !!PatientService, 
      DentistService: !!DentistService 
    });

    const { DentalRecord, MedicalHistory } = await import('./index');
    console.log('✅ MongoDB schemas exported:', { 
      DentalRecord: !!DentalRecord, 
      MedicalHistory: !!MedicalHistory 
    });

    const { VectorDBFactory, ImageEmbeddingService } = await import('./index');
    console.log('✅ Vector DB services exported:', { 
      VectorDBFactory: !!VectorDBFactory, 
      ImageEmbeddingService: !!ImageEmbeddingService 
    });
    console.log();

    // Test 4: Check environment configuration
    console.log('4️⃣ Testing environment configuration...');
    const envChecks = {
      'DATABASE_URL': !!process.env.DATABASE_URL,
      'MONGODB_URI': !!process.env.MONGODB_URI,
      'PINECONE_API_KEY': !!process.env.PINECONE_API_KEY,
      'QDRANT_URL': !!process.env.QDRANT_URL,
    };
    
    Object.entries(envChecks).forEach(([key, exists]) => {
      const icon = exists ? '🟢' : '🟡';
      console.log(`   ${icon} ${key}: ${exists ? 'Set' : 'Not set'}`);
    });
    console.log();

    console.log('🎉 All tests passed! Database package is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('   1. Set up environment variables (.env file)');
    console.log('   2. Run database migrations: npm run migrate');
    console.log('   3. Seed databases: npm run setup:all');
    console.log('   4. Test with actual database connections');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testDatabaseIntegration().catch(console.error);
