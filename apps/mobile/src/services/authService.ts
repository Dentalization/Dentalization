/**
 * Authentication Service for Dentalization Mobile App
 * Handles all authentication-related API calls
 */

import { 
  apiClient, 
  API_CONFIG, 
  AuthApiResponse, 
  LoginRequest, 
  RegisterRequest, 
  RefreshTokenRequest,
  handleApiError 
} from './api';
import { APP_CONFIG } from '../config/app';

export class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthApiResponse> {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      
      const response = await apiClient.post<AuthApiResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        {
          email: credentials.email.toLowerCase().trim(),
          password: credentials.password,
          rememberMe: credentials.rememberMe || false,
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      console.log('✅ Login successful for:', credentials.email);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      return handleApiError(error);
    }
  }

  /**
   * Register new user (Patient or Dentist)
   */
  async register(userData: RegisterRequest): Promise<AuthApiResponse> {
    try {
      console.log('📝 Attempting registration for:', userData.email, 'as', userData.role);
      
      // Prepare registration data
      const registrationData = {
        ...userData,
        email: userData.email.toLowerCase().trim(),
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
      };

      const response = await apiClient.post<AuthApiResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        registrationData
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }

      console.log('✅ Registration successful for:', userData.email);
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return handleApiError(error);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthApiResponse> {
    try {
      console.log('🔄 Attempting token refresh...');
      
      const response = await apiClient.post<AuthApiResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken } as RefreshTokenRequest
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Token refresh failed');
      }

      console.log('✅ Token refresh successful');
      return response.data;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      return handleApiError(error);
    }
  }

  /**
   * Logout user (invalidate tokens on server)
   */
  async logout(refreshToken?: string): Promise<void> {
    try {
      console.log('👋 Attempting logout...');
      
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
        refreshToken ? { refreshToken } : undefined
      );

      if (!response.success) {
        console.warn('⚠️ Logout response not successful, but continuing...');
      }

      console.log('✅ Logout successful');
    } catch (error) {
      // Don't throw on logout errors - we want to clear local data anyway
      console.warn('⚠️ Logout API call failed, but continuing with local cleanup:', error);
    }
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      console.log('📧 Verifying email with token...');
      
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL,
        { token }
      );

      if (!response.success) {
        throw new Error(response.message || 'Email verification failed');
      }

      console.log('✅ Email verification successful');
    } catch (error) {
      console.error('❌ Email verification failed:', error);
      handleApiError(error);
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      console.log('🔑 Requesting password reset for:', email);
      
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email: email.toLowerCase().trim() }
      );

      if (!response.success) {
        throw new Error(response.message || 'Password reset request failed');
      }

      console.log('✅ Password reset email sent');
    } catch (error) {
      console.error('❌ Password reset request failed:', error);
      handleApiError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      console.log('🔑 Resetting password with token...');
      
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
        { token, password: newPassword }
      );

      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }

      console.log('✅ Password reset successful');
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      handleApiError(error);
    }
  }

  /**
   * Upload document for dentist verification
   */
  async uploadVerificationDocument(
    file: File | Blob, 
    documentType: 'license' | 'certificate' | 'identification'
  ): Promise<{ documentId: string; url: string }> {
    try {
      console.log('📎 Uploading verification document:', documentType);
      
      const response = await apiClient.uploadFile<{ documentId: string; url: string }>(
        API_CONFIG.ENDPOINTS.USER.UPLOAD_DOCUMENT,
        file,
        'document',
        { documentType }
      );

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Document upload failed');
      }

      console.log('✅ Document upload successful:', response.data.documentId);
      return response.data;
    } catch (error) {
      console.error('❌ Document upload failed:', error);
      return handleApiError(error);
    }
  }

  /**
   * Check if backend API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health');
      return response.success;
    } catch (error) {
      console.warn('⚠️ Backend API health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Mock service for development/testing when backend is not available
export class MockAuthService {
  private users: Map<string, any> = new Map();

  async login(credentials: LoginRequest): Promise<AuthApiResponse> {
    console.log('🔐 MOCK: Attempting login for:', credentials.email);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, APP_CONFIG.DEV.MOCK_DELAYS.LOGIN));

    // Mock authentication logic
    const email = credentials.email.toLowerCase().trim();
    
    // Allow test accounts or previously registered users
    if (email === 'test@example.com' || email === 'patient@test.com' || email === 'dentist@test.com' || this.users.has(email)) {
      const mockUser = this.users.get(email) || {
        id: Math.random().toString(),
        email: email,
        firstName: email === 'dentist@test.com' ? 'Dr. Test' : 'Test',
        lastName: 'User',
        role: email === 'dentist@test.com' ? 'dentist' : 'patient',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        preferredLanguage: 'id',
      };

      const authResponse: AuthApiResponse = {
        user: mockUser,
        token: `mock_token_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
        expiresIn: credentials.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 30 days or 1 day
      };

      console.log('✅ MOCK: Login successful for:', email);
      return authResponse;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthApiResponse> {
    console.log('📝 MOCK: Attempting registration for:', userData.email, 'as', userData.role);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, APP_CONFIG.DEV.MOCK_DELAYS.REGISTER));

    const email = userData.email.toLowerCase().trim();
    
    // Check if user already exists
    if (this.users.has(email)) {
      throw new Error('User with this email already exists');
    }

    // Create mock user
    const mockUser = {
      id: Math.random().toString(),
      email: email,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      role: userData.role,
      phone: userData.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      preferredLanguage: 'id' as const,
      // Add role-specific data
      ...(userData.role === 'patient' && {
        emergencyContactName: userData.emergencyContactName,
        emergencyContactPhone: userData.emergencyContactPhone,
        allergies: userData.allergies,
        medicalHistory: userData.medicalHistory,
      }),
      ...(userData.role === 'dentist' && {
        licenseNumber: userData.licenseNumber,
        specialization: userData.specialization,
        yearsOfExperience: userData.yearsOfExperience,
        clinicName: userData.clinicName,
        clinicAddress: userData.clinicAddress,
      }),
    };

    // Store user
    this.users.set(email, mockUser);

    const authResponse: AuthApiResponse = {
      user: mockUser,
      token: `mock_token_${Date.now()}`,
      refreshToken: `mock_refresh_${Date.now()}`,
      expiresIn: 24 * 60 * 60 * 1000, // 1 day
    };

    console.log('✅ MOCK: Registration successful for:', email);
    return authResponse;
  }

  async refreshToken(refreshToken: string): Promise<AuthApiResponse> {
    console.log('🔄 MOCK: Attempting token refresh...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, APP_CONFIG.DEV.MOCK_DELAYS.API_CALL));

    // Mock refresh - in real app, validate the refresh token
    if (refreshToken.startsWith('mock_refresh_')) {
      const mockResponse: AuthApiResponse = {
        user: {
          id: 'mock_user',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'patient',
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          preferredLanguage: 'id',
        },
        token: `mock_token_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
        expiresIn: 24 * 60 * 60 * 1000,
      };

      console.log('✅ MOCK: Token refresh successful');
      return mockResponse;
    } else {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(): Promise<void> {
    console.log('👋 MOCK: Logout successful');
    // In mock mode, we don't need to do anything server-side
  }

  async healthCheck(): Promise<boolean> {
    return true; // Mock service is always "healthy"
  }
}

// Create mock instance
export const mockAuthService = new MockAuthService();
