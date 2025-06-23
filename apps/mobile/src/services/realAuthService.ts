/**
 * Real Authentication Service using API Server
 * Connects to the Express API server for authentication
 */

import { User, UserRole, UserStatus } from '../types/auth';

// API configuration
const API_BASE_URL = 'http://localhost:3000/api';

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
   * Check API server health
   */
  async checkHealth(): Promise<boolean> {
    try {
      console.log('🔍 Checking API server health...');
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API server health check successful:', data);
      return data.status === 'ok';
    } catch (error) {
      console.error('❌ API server health check failed:', error);
      return false;
    }
  }

  /**
   * Convert API user to app user format
   */
  private convertApiUserToAppUser(apiUser: any): User {
    // Convert database role enum to app role format
    const roleMapping: { [key: string]: UserRole } = {
      'PATIENT': UserRole.PATIENT,
      'DENTIST': UserRole.DENTIST,
      'ADMIN': UserRole.ADMIN,
    };

    return {
      id: apiUser.id,
      email: apiUser.email,
      firstName: apiUser.firstName,
      lastName: apiUser.lastName,
      phone: apiUser.phone,
      role: roleMapping[apiUser.role] || UserRole.PATIENT,
      status: apiUser.status, // This should already be the UserStatus enum
      avatar: apiUser.avatar,
      createdAt: new Date(apiUser.createdAt),
      updatedAt: new Date(apiUser.updatedAt),
      isActive: apiUser.status === 'ACTIVE',
      preferredLanguage: 'id', // Default to Indonesian
    };
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting login for:', credentials.email);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('✅ Login successful for:', credentials.email);

      // Convert API user to app user format
      const user = this.convertApiUserToAppUser(data.data.user);

      return {
        user,
        token: data.data.token,
        refreshToken: data.data.refreshToken,
        expiresIn: data.data.expiresIn,
      };

    } catch (error) {
      console.error('❌ Login failed:', error);
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting registration for:', userData.email, 'as', userData.role);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          role: userData.role,
          // Patient fields
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          address: userData.address,
          emergencyContactName: userData.emergencyContactName,
          emergencyContactPhone: userData.emergencyContactPhone,
          allergies: userData.allergies,
          medicalHistory: userData.medicalHistory,
          // Dentist fields
          licenseNumber: userData.licenseNumber,
          specialization: userData.specialization,
          yearsOfExperience: userData.yearsOfExperience,
          clinicName: userData.clinicName,
          clinicAddress: userData.clinicAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      console.log('✅ Registration successful for:', userData.email);

      // Convert API user to app user format
      const user = this.convertApiUserToAppUser(data.data.user);

      return {
        user,
        token: data.data.token,
        refreshToken: data.data.refreshToken,
        expiresIn: data.data.expiresIn,
      };

    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      console.log('📝 Logging out user');
      // For now, just log the action
      // In a real implementation, you might want to invalidate tokens on the server
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw new Error(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting token refresh');
      
      // For now, return an error since we haven't implemented this endpoint yet
      throw new Error('Token refresh not implemented yet');

    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if the authentication service is available
   */
  async isAvailable(): Promise<boolean> {
    return await this.checkHealth();
  }
}

// Export singleton instance
export const realAuthService = new RealAuthService();
