import { prisma, UserService, PatientService, DentistService } from '@dentalization/database-app';

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');

  try {
    // Create a sample patient user
    const patientUser = await UserService.createUser({
      email: 'patient@dentalization.com',
      password: 'hashedpassword123', // In real app, this would be hashed
      firstName: 'John',
      lastName: 'Doe',
      phone: '+62-812-3456-7890',
      role: 'PATIENT',
    });

    // Create patient profile
    const patient = await PatientService.createPatient({
      userId: patientUser.id,
      dateOfBirth: new Date('1990-01-15'),
      gender: 'MALE',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      emergencyContact: '+62-812-9876-5432',
      insurance: 'BPJS Kesehatan',
    });

    // Create a sample dentist user
    const dentistUser = await UserService.createUser({
      email: 'dentist@dentalization.com',
      password: 'hashedpassword456', // In real app, this would be hashed
      firstName: 'Dr. Sarah',
      lastName: 'Smith',
      phone: '+62-813-1111-2222',
      role: 'DENTIST',
    });

    // Create dentist profile
    const dentist = await DentistService.createDentist({
      userId: dentistUser.id,
      licenseNumber: 'DRG-2024-001',
      specialization: ['General Dentistry', 'Orthodontics'],
      yearsOfExperience: 8,
      bio: 'Experienced dentist specializing in general dentistry and orthodontic treatments.',
      education: 'DDS from University of Indonesia',
      certifications: ['Indonesian Dental Association', 'Orthodontic Certification'],
    });

    console.log('✅ Sample data created successfully!');
    console.log('👨‍⚕️ Patient User:', { id: patientUser.id, email: patientUser.email });
    console.log('👩‍⚕️ Dentist User:', { id: dentistUser.id, email: dentistUser.email });
    console.log('🦷 Patient Profile:', { id: patient.id, name: `${patientUser.firstName} ${patientUser.lastName}` });
    console.log('🏥 Dentist Profile:', { id: dentist.id, name: `${dentistUser.firstName} ${dentistUser.lastName}` });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
