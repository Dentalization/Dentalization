const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'API server and database are running' });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// User registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('📝 [API] Registration request received:', req.body);
    
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      // Patient fields
      dateOfBirth,
      gender,
      address,
      emergencyContactName,
      emergencyContactPhone,
      allergies,
      medicalHistory,
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone,
          role: role.toUpperCase(),
          status: 'ACTIVE',
        }
      });

      // If it's a patient, create patient profile
      if (role.toLowerCase() === 'patient') {
        const patient = await tx.patient.create({
          data: {
            userId: user.id,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender: gender?.toUpperCase() || null,
            address: address || null,
            emergencyContact: emergencyContactName && emergencyContactPhone 
              ? JSON.stringify({ 
                  name: emergencyContactName, 
                  phone: emergencyContactPhone 
                })
              : null,
          }
        });

        // Create medical history if provided
        if (allergies || medicalHistory) {
          await tx.medicalHistory.create({
            data: {
              patientId: patient.id,
              allergies: allergies ? [allergies] : [],
              medications: [],
              medicalConditions: medicalHistory ? [medicalHistory] : [],
              previousSurgeries: [],
              smokingStatus: 'NEVER',
              alcoholConsumption: null,
              pregnancy: null,
              previousDentalWork: [],
              oralHygienHabits: null,
              lastDentalVisit: null,
            }
          });
        }
      }

      return user;
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = result;

    console.log('✅ [API] Registration successful for:', email);

    // Return success response
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: `api_token_${Date.now()}`,
        refreshToken: `api_refresh_${Date.now()}`,
        expiresIn: 24 * 60 * 60 * 1000, // 24 hours
      }
    });

  } catch (error) {
    console.error('❌ [API] Registration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message
    });
  }
});

// User login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 [API] Login request for:', email);
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        patientProfile: true,
        dentistProfile: true,
        adminProfile: true,
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: `api_token_${Date.now()}`,
        refreshToken: `api_refresh_${Date.now()}`,
        expiresIn: 24 * 60 * 60 * 1000,
      }
    });

    console.log('✅ [API] Login successful for:', email);

  } catch (error) {
    console.error('❌ [API] Login failed:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed: ' + error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 API server running on http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`📱 Registration: POST http://localhost:${port}/api/auth/register`);
  console.log(`🔐 Login: POST http://localhost:${port}/api/auth/login`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down API server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Shutting down API server...');
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
