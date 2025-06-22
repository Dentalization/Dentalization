/**
 * Real Authentication Service using PostgreSQL Database
 * Replaces mock authentication with actual database operations
 */

import { 
  UserService, 
  PatientService, 
  DentistService, 
  prisma,
  checkDatabaseHealth 
} from '@dentalization/database-app';
import { User, UserRole } from '@dentalization/shared-types';
import * as Crypto from 'expo-crypto';
import jwt from 'react-native-pure-jwt';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '24h';
const JWT_REFRESH_EXPIRES_IN = '30d';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  // Patient-specific fields
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string;
  medicalHistory?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  // Dentist-specific fields
  licenseNumber?: string;
  specialization?: string;
  yearsOfExperience?: number;
  clinicName?: string;
  clinicAddress?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export class RealAuthService {
  /**
   * Hash password using expo-crypto
   */
  private async hashPassword(password: string): Promise<string> {
    // Create a simple salt
    const salt = Math.random().toString(36).substring(2, 15);
    const saltedPassword = password + salt;
    
    // Use expo-crypto to hash the salted password
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      saltedPassword
    );
    
    // Return salt + hash for storage
    return `${salt}:${hashedPassword}`;
  }

  /**
   * Verify password against hash
   */
  private async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
      // Extract salt and hash
      const [salt, hash] = storedHash.split(':');
      if (!salt || !hash) return false;
      
      // Recreate the salted password
      const saltedPassword = password + salt;
      
      // Hash and compare
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        saltedPassword
      );
      
      return hashedPassword === hash;
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Generate JWT token
   */
  private async generateToken(userId: string, email: string, role: UserRole, expiresIn: string = JWT_EXPIRES_IN): Promise<string> {
    const payload = { 
      userId, 
      email, 
      role,
      type: 'access',
      iat: Math.floor(Date.now() / 1000)
    };
    
    return await jwt.sign(payload, JWT_SECRET, {
      alg: 'HS256'
    });
  }

  /**
   * Generate refresh token
   */
  private async generateRefreshToken(userId: string): Promise<string> {
    const payload = { 
      userId, 
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000)
    };
    
    return await jwt.sign(payload, JWT_SECRET, {
      alg: 'HS256'
    });
  }

  /**
   * Verify JWT token
   */
  private async verifyToken(token: string): Promise<any> {
    return await jwt.decode(token, JWT_SECRET);
  }

  /**
   * Convert database user to mobile app user format
   */
  private convertDatabaseUserToAppUser(dbUser: any): User {
    // Convert database role enum to app role format
    const roleMapping: { [key: string]: UserRole } = {
      'PATIENT': 'patient',
      'DENTIST': 'dentist',
      'ADMIN': 'admin',
      'CLINIC_STAFF': 'clinic_staff',
    };

    return {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      phoneNumber: dbUser.phone,
      role: roleMapping[dbUser.role] || 'patient',
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
      isActive: dbUser.status === 'ACTIVE',
      preferredLanguage: 'id', // Default to Indonesian
    };
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('🔐 [REAL AUTH] Attempting login for:', credentials.email);

      // Check database health first
      const isHealthy = await checkDatabaseHealth();
      if (!isHealthy) {
        throw new Error('Database is not available');
      }

      // Find user by email
      const dbUser = await UserService.getUserByEmail(credentials.email.toLowerCase().trim());
      if (!dbUser) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (dbUser.status !== 'ACTIVE') {
        throw new Error('Account is not active. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(credentials.password, dbUser.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const expiresIn = credentials.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
      const appUser = this.convertDatabaseUserToAppUser(dbUser);
      const token = await this.generateToken(
        dbUser.id, 
        dbUser.email, 
        appUser.role, // Use converted role
        credentials.rememberMe ? '30d' : '24h'
      );
      const refreshToken = await this.generateRefreshToken(dbUser.id);

      // Convert to app user format
      const user = this.convertDatabaseUserToAppUser(dbUser);

      console.log('✅ [REAL AUTH] Login successful for:', credentials.email);

      return {
        user,
        token,
        refreshToken,
        expiresIn,
      };
    } catch (error) {
      console.error('❌ [REAL AUTH] Login failed:', error);
      throw error;
    }
  }

  /**
   * Register new user (Patient or Dentist)
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('📝 [REAL AUTH] Attempting registration for:', userData.email, 'as', userData.role);

      // Check database health first
      const isHealthy = await checkDatabaseHealth();
      if (!isHealthy) {
        throw new Error('Database is not available');
      }

      // Check if user already exists
      const existingUser = await UserService.getUserByEmail(userData.email.toLowerCase().trim());
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Create base user
      const dbUser = await UserService.createUser({
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        phone: userData.phone,
        role: userData.role.toUpperCase() as any, // Convert to database enum format
        avatar: undefined,
      });

      // Create role-specific profile
      if (userData.role === 'patient') {
        await PatientService.createPatient({
          userId: dbUser.id,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          address: userData.address,
          emergencyContact: userData.emergencyContactPhone ? 
            `${userData.emergencyContactName} - ${userData.emergencyContactPhone}` : 
            userData.emergencyContactName,
          insurance: '', // Can be added later
        });
      } else if (userData.role === 'dentist') {
        await DentistService.createDentist({
          userId: dbUser.id,
          licenseNumber: userData.licenseNumber || '',
          specialization: [userData.specialization || 'General Dentistry'], // Convert to array
          yearsOfExperience: userData.yearsOfExperience || 0,
          bio: userData.clinicName ? `Works at ${userData.clinicName}` : undefined,
        });
      }

      // Generate tokens
      const token = await this.generateToken(dbUser.id, dbUser.email, this.convertDatabaseUserToAppUser(dbUser).role);
      const refreshToken = await this.generateRefreshToken(dbUser.id);

      // Convert to app user format
      const user = this.convertDatabaseUserToAppUser(dbUser);

      console.log('✅ [REAL AUTH] Registration successful for:', userData.email);

      return {
        user,
        token,
        refreshToken,
        expiresIn: 24 * 60 * 60 * 1000, // 1 day
      };
    } catch (error) {
      console.error('❌ [REAL AUTH] Registration failed:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      console.log('🔄 [REAL AUTH] Attempting token refresh...');

      // Check database health first
      const isHealthy = await checkDatabaseHealth();
      if (!isHealthy) {
        throw new Error('Database is not available');
      }

      // Verify refresh token
      const decoded = await this.verifyToken(refreshToken);
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      // Get user from database
      const dbUser = await UserService.getUserById(decoded.userId);
      if (!dbUser || dbUser.status !== 'ACTIVE') {
        throw new Error('User not found or inactive');
      }

      // Generate new tokens
      const newToken = await this.generateToken(dbUser.id, dbUser.email, this.convertDatabaseUserToAppUser(dbUser).role);
      const newRefreshToken = await this.generateRefreshToken(dbUser.id);

      // Convert to app user format
      const user = this.convertDatabaseUserToAppUser(dbUser);

      console.log('✅ [REAL AUTH] Token refresh successful');

      return {
        user,
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 24 * 60 * 60 * 1000, // 1 day
      };
    } catch (error) {
      console.error('❌ [REAL AUTH] Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Logout user (in a real app, you might want to blacklist the refresh token)
   */
  async logout(refreshToken?: string): Promise<void> {
    try {
      console.log('👋 [REAL AUTH] Logout successful');
      // In a production app, you would:
      // 1. Add the refresh token to a blacklist
      // 2. Remove any active sessions from the database
      // 3. Log the logout event for security auditing
    } catch (error) {
      console.warn('⚠️ [REAL AUTH] Logout error (continuing anyway):', error);
    }
  }

  /**
   * Verify email address (placeholder for future implementation)
   */
  async verifyEmail(token: string): Promise<void> {
    console.log('📧 [REAL AUTH] Email verification not yet implemented');
    // TODO: Implement email verification
    throw new Error('Email verification not yet implemented');
  }

  /**
   * Request password reset (placeholder for future implementation)
   */
  async forgotPassword(email: string): Promise<void> {
    console.log('🔑 [REAL AUTH] Password reset not yet implemented');
    // TODO: Implement password reset
    throw new Error('Password reset not yet implemented');
  }

  /**
   * Reset password with token (placeholder for future implementation)
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    console.log('🔑 [REAL AUTH] Password reset not yet implemented');
    // TODO: Implement password reset
    throw new Error('Password reset not yet implemented');
  }

  /**
   * Upload document for dentist verification (placeholder for future implementation)
   */
  async uploadVerificationDocument(
    file: File | Blob, 
    documentType: 'license' | 'certificate' | 'identification'
  ): Promise<{ documentId: string; url: string }> {
    console.log('📎 [REAL AUTH] Document upload not yet implemented');
    // TODO: Implement file upload service
    throw new Error('Document upload not yet implemented');
  }

  /**
   * Check if database is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      return await checkDatabaseHealth();
    } catch (error) {
      console.warn('⚠️ [REAL AUTH] Database health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const realAuthService = new RealAuthService();
