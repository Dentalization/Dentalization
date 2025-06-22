/**
 * Quick test to verify database package integration with mobile app
 * Run this with: npx tsx src/utils/testDatabaseIntegration.ts
 */

import { testDatabaseConnection } from './databaseTest';

async function runTest() {
  console.log('🚀 Testing Database Integration with Mobile App...\n');
  
  const result = await testDatabaseConnection();
  
  if (result.success) {
    console.log('\n✅ SUCCESS: Database integration test passed!');
    console.log('📋 Services available:', Object.keys(result.services || {}));
    console.log('🏥 Health status:', result.health);
  } else {
    console.log('\n❌ FAILED: Database integration test failed');
    console.error('Error:', result.error);
  }
}

runTest().catch(console.error);
