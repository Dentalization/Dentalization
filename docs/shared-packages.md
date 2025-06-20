# Shared Packages Documentation

This document outlines the shared packages created for the Dentalization platform.

## Overview

We have created three foundational packages that provide shared functionality across the entire monorepo:

### 📦 @dentalization/shared-types

**Purpose**: Centralized TypeScript type definitions for the entire platform.

**Key Features**:
- User management types (Patient, Dentist, etc.)
- Appointment and scheduling types
- AI analysis and diagnostic types
- Payment and invoice types
- API response and error types
- Notification types

**Usage**:
```typescript
import { User, Appointment, AIAnalysis } from '@dentalization/shared-types';
```

### 📦 @dentalization/constants

**Purpose**: Application-wide constants and configuration values.

**Key Features**:
- Indonesia-specific constants (provinces, cities, payment methods)
- Dental procedures and specializations
- Application configuration
- Cache durations and rate limits
- File upload limits

**Usage**:
```typescript
import { INDONESIA, PROCEDURES, APP } from '@dentalization/constants';
```

### 📦 @dentalization/utils

**Purpose**: Shared utility functions used across the platform.

**Key Features**:
- Date/time formatting for Indonesian timezone
- Currency formatting for Indonesian Rupiah (IDR)
- Validation functions (email, phone, password)
- String manipulation utilities
- Number formatting and parsing

**Usage**:
```typescript
import { formatCurrency, isValidIndonesianPhone, formatDateTime } from '@dentalization/utils';
```

## Indonesia-Specific Features

All packages include Indonesia-specific functionality:

- **Currency**: IDR formatting and parsing
- **Timezone**: Asia/Jakarta timezone handling
- **Phone Numbers**: Indonesian phone number validation and normalization
- **Provinces & Cities**: Complete list of Indonesian administrative regions
- **Payment Methods**: Support for GoPay, OVO, DANA, and local banks
- **Language**: Bahasa Indonesia and English support

## Build System

All packages are configured with:
- TypeScript compilation with declaration files
- Source maps for debugging
- Proper module exports (ESM/CommonJS)
- Turbo caching for fast builds

## Installation in Other Packages

To use these shared packages in your apps or services:

```json
{
  "dependencies": {
    "@dentalization/shared-types": "workspace:*",
    "@dentalization/constants": "workspace:*",
    "@dentalization/utils": "workspace:*"
  }
}
```

## Development Commands

From the root of the monorepo:

```bash
# Build all shared packages
npm run build

# Type check all packages
npm run type-check

# Format code
npm run format

# Clean build artifacts
npm run clean
```

## Next Steps

With these foundational packages in place, you can now:

1. **Create UI Components Package** - Shared React components
2. **Create Configuration Package** - Environment-specific configs
3. **Build Applications** - Web and mobile apps using these shared packages
4. **Build Services** - API, AI service, etc. using these types and utilities

The shared packages provide a solid foundation for building scalable, type-safe applications across the entire Dentalization ecosystem! 🦷✨
