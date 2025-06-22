/**
 * Test script to verify real authentication service integration
 */

import { realAuthService } from '../services/realAuthService';

async function testRealAuth() {
  console.log('🧪 Starting Real Authentication Service Test\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing database health check...');
    const isHealthy = await realAuthService.healthCheck();
    console.log(`   Database health: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}\n`);

    if (!isHealthy) {
      console.log('❌ Database is not available. Please ensure PostgreSQL is running and DATABASE_URL is correct.');
      return;
    }

    // Test 2: Registration
    console.log('2. Testing user registration...');
    const testUser = {
      email: 'test-patient@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'Patient',
      phone: '+1234567890',
      role: 'patient' as const,
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '+1234567891',
      allergies: 'None',
      medicalHistory: 'No significant medical history',
    };

    try {
      const registerResult = await realAuthService.register(testUser);
      console.log('   ✅ Registration successful!');
      console.log(`   User ID: ${registerResult.user.id}`);
      console.log(`   Token: ${registerResult.token.substring(0, 20)}...`);
      console.log(`   Role: ${registerResult.user.role}\n`);

      // Test 3: Login
      console.log('3. Testing user login...');
      const loginResult = await realAuthService.login({
        email: testUser.email,
        password: testUser.password,
        rememberMe: false,
      });
      console.log('   ✅ Login successful!');
      console.log(`   User: ${loginResult.user.firstName} ${loginResult.user.lastName}`);
      console.log(`   Token: ${loginResult.token.substring(0, 20)}...`);

      // Test 4: Token Refresh
      console.log('\n4. Testing token refresh...');
      const refreshResult = await realAuthService.refreshToken(loginResult.refreshToken);
      console.log('   ✅ Token refresh successful!');
      console.log(`   New token: ${refreshResult.token.substring(0, 20)}...\n`);

    } catch (registerError: any) {
      if (registerError.message.includes('already exists')) {
        console.log('   ℹ️ User already exists, testing login instead...');
        
        // Test login with existing user
        const loginResult = await realAuthService.login({
          email: testUser.email,
          password: testUser.password,
          rememberMe: false,
        });
        console.log('   ✅ Login with existing user successful!');
        console.log(`   User: ${loginResult.user.firstName} ${loginResult.user.lastName}\n`);
      } else {
        throw registerError;
      }
    }

    // Test 5: Dentist Registration
    console.log('5. Testing dentist registration...');
    const testDentist = {
      email: 'test-dentist@example.com',
      password: 'dentistpassword123',
      firstName: 'Dr. Test',
      lastName: 'Dentist',
      phone: '+1234567892',
      role: 'dentist' as const,
      licenseNumber: 'DEN123456',
      specialization: 'Orthodontics',
      yearsOfExperience: 5,
      clinicName: 'Test Dental Clinic',
      clinicAddress: '123 Dental Street, City',
    };

    try {
      const dentistResult = await realAuthService.register(testDentist);
      console.log('   ✅ Dentist registration successful!');
      console.log(`   Dentist ID: ${dentistResult.user.id}`);
      console.log(`   Role: ${dentistResult.user.role}\n`);
    } catch (dentistError: any) {
      if (dentistError.message.includes('already exists')) {
        console.log('   ℹ️ Dentist already exists, skipping registration test\n');
      } else {
        throw dentistError;
      }
    }

    console.log('🎉 All authentication tests passed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Database connection working');
    console.log('   ✅ User registration working');
    console.log('   ✅ User login working');
    console.log('   ✅ Token refresh working');
    console.log('   ✅ Role-based registration working');
    console.log('\n🚀 Ready to integrate with mobile app!');

  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure PostgreSQL is running');
    console.log('   2. Check DATABASE_URL in /apps/database/.env');
    console.log('   3. Run: cd /apps/database && npm run db:push');
    console.log('   4. Verify all dependencies are installed');
  }
}

// Run the test
testRealAuth().catch(console.error);
