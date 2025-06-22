# Dentalization Database Package

A PostgreSQL-only database package for the Dentalization app, built with Prisma ORM.

## Overview

This package provides a unified database layer for the Dentalization dental practice management system. It has been refactored from a hybrid architecture (PostgreSQL + MongoDB + Vector DB) to use only PostgreSQL for simplified deployment and maintenance.

## Features

- **PostgreSQL-only architecture** - Single database solution
- **Prisma ORM integration** - Type-safe database operations
- **Comprehensive schema** - Covers all dental practice management needs:
  - User management (patients, dentists, admins)
  - Medical history tracking
  - Dental records and tooth charts
  - Appointment scheduling
  - Treatment planning
  - Payment processing
  - Treatment templates

## Schema Overview

### Core Models
- `User` - Base user model with role-based profiles
- `Patient` - Patient-specific information and relationships
- `Dentist` - Dentist profiles with specializations
- `Admin` - Administrative user profiles

### Clinical Models
- `MedicalHistory` - Patient medical and dental history
- `DentalRecord` - Visit records with examinations and treatments
- `Treatment` - Individual treatment procedures
- `TreatmentPlan` - Comprehensive treatment planning
- `Appointment` - Scheduling and appointment management

### Business Models
- `Payment` - Payment tracking and billing
- `TreatmentTemplate` - Reusable treatment procedures
- `ClinicInfo` - Clinic configuration and settings

## Installation

```bash
npm install
npm run db:generate
```

## Usage

```typescript
import { prisma, UserService, PatientService } from '@dentalization/database-app';

// Use the Prisma client directly
const users = await prisma.user.findMany();

// Or use the service layer
const patient = await PatientService.createPatient({
  userId: 'user-id',
  dateOfBirth: new Date('1990-01-01'),
  // ... other fields
});
```

## Available Services

- `UserService` - User management operations
- `PatientService` - Patient-specific operations
- `DentistService` - Dentist profile management
- `AdminService` - Admin operations
- `AppointmentService` - Appointment scheduling

*Note: Additional services (DentalRecordService, TreatmentService, PaymentService) are currently being finalized and will be available in the next update.*

## Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

## Environment Variables

Create a `.env` file in the database package root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/dentalization?schema=public"
JWT_SECRET="your-jwt-secret-key-here"
NODE_ENV="development"
```

## Architecture

This package exports:

1. **Prisma Client** - Direct database access
2. **Service Layer** - Business logic and common operations
3. **Type Definitions** - Full TypeScript support
4. **Utility Functions** - Database health checks and connection management

## Development

```bash
# Watch mode for development
npm run dev

# Type checking
npm run type-check

# Build package
npm run build

# Clean build artifacts
npm run clean
```

## Migration from Hybrid Architecture

This package was previously a hybrid solution using PostgreSQL + MongoDB + Vector DB. The migration to PostgreSQL-only provides:

- **Simplified deployment** - Single database to manage
- **Better consistency** - ACID transactions across all data
- **Reduced complexity** - Single ORM and connection pool
- **Cost efficiency** - No need for multiple database services

All previous functionality has been preserved and migrated to PostgreSQL, including:
- JSON storage for flexible data (tooth charts, templates)
- Full-text search capabilities
- Complex relationships and constraints

## Contributing

When adding new models or services:

1. Update the Prisma schema in `prisma/schema.prisma`
2. Run `npm run db:generate` to update the client
3. Create corresponding service files in `services/`
4. Export the new services from `index.ts`
5. Update this README with the new functionality
