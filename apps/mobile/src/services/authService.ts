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
import { realAuthService } from './realAuthService';
import { UserRole, UserStatus } from '../types/auth';
import { APP_CONFIG, shouldUseMockService } from '../config/app';

export class AuthService {
  /**
   * Check if real database is available, fallback to API if needed
   */
  private async shouldUseRealDatabase(): Promise<boolean> {
    try {
      // First check if we're configured to use real database
      if (shouldUseMockService()) {
        console.log('🎭 Configuration set to use mock service');
        return false;
      }
      
      // Then check if real database is actually available
      const isHealthy = await realAuthService.checkHealth();
      if (isHealthy) {
        console.log('✅ Real database is healthy and will be used');
        return true;
      } else {
        console.log('⚠️ Real database health check failed');
        return false;
      }
    } catch (error) {
      console.warn('⚠️ Error checking real database availability:', error);
      return false;
    }
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthApiResponse> {
    console.log('🔐 Attempting login for:', credentials.email);
    
    // First try mock service as fallback
    let lastError: Error | null = null;
    
    // Try real database first
    try {
      const useRealDb = await this.shouldUseRealDatabase();
      
      if (useRealDb) {
        console.log('📊 Using real database for login');
        return await realAuthService.login(credentials);
      }
    } catch (realDbError) {
      console.warn('⚠️ Real database login failed:', realDbError);
      lastError = realDbError as Error;
    }
    
    // Try API fallback
    try {
      console.log('🌐 Trying API fallback for login');
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

      console.log('✅ API login successful for:', credentials.email);
      return response.data;
    } catch (apiError) {
      console.warn('⚠️ API login failed:', apiError);
      lastError = apiError as Error;
    }
    
    // Final fallback to mock service
    try {
      console.log('🎭 Using mock service as final fallback');
      return await mockAuthService.login(credentials);
    } catch (mockError) {
      console.error('❌ All login methods failed');
      
      // Provide user-friendly error messages
      if (lastError?.message?.includes('Invalid email') || lastError?.message?.includes('not found')) {
        throw new Error('Email tidak terdaftar. Silakan daftar terlebih dahulu atau periksa email yang dimasukkan.');
      } else if (lastError?.message?.includes('Invalid') || lastError?.message?.includes('password')) {
        throw new Error('Email atau password salah. Silakan periksa kembali.');
      } else if (lastError?.message?.includes('credentials')) {
        throw new Error('Email atau password tidak valid.');
      } else {
        throw new Error('Email tidak terdaftar. Silakan daftar terlebih dahulu.');
      }
    }
  }

  /**
   * Register new user (Patient or Dentist)
   */
  async register(userData: RegisterRequest): Promise<AuthApiResponse> {
    console.log('📝 Attempting registration for:', userData.email, 'as', userData.role);
    
    let lastError: Error | null = null;
    
    // Try real database first
    try {
      const useRealDb = await this.shouldUseRealDatabase();
      
      if (useRealDb) {
        console.log('📊 Using real database for registration');
        return await realAuthService.register(userData);
      }
    } catch (realDbError) {
      console.warn('⚠️ Real database registration failed:', realDbError);
      lastError = realDbError as Error;
    }
    
    // Try API fallback
    try {
      console.log('🌐 Trying API fallback for registration');
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

      console.log('✅ API registration successful for:', userData.email);
      return response.data;
    } catch (apiError) {
      console.warn('⚠️ API registration failed:', apiError);
      lastError = apiError as Error;
    }
    
    // Final fallback to mock service
    try {
      console.log('🎭 Using mock service for registration');
      return await mockAuthService.register(userData);
    } catch (mockError) {
      console.error('❌ All registration methods failed');
      
      // Provide user-friendly error messages
      if (lastError?.message?.includes('already exists')) {
        throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login jika sudah memiliki akun.');
      } else if (lastError?.message?.includes('invalid')) {
        throw new Error('Data tidak valid. Silakan periksa kembali informasi yang dimasukkan.');
      } else {
        throw new Error('Pendaftaran gagal. Silakan coba lagi.');
      }
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthApiResponse> {
    try {
      console.log('🔄 Attempting token refresh...');
      
      // Try real database first, fallback to API
      const useRealDb = await this.shouldUseRealDatabase();
      
      if (useRealDb) {
        console.log('📊 Using real database for token refresh');
        return await realAuthService.refreshToken(refreshToken);
      } else {
        console.log('🌐 Using API for token refresh');
        const response = await apiClient.post<AuthApiResponse>(
          API_CONFIG.ENDPOINTS.AUTH.REFRESH,
          { refreshToken } as RefreshTokenRequest
        );

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Token refresh failed');
        }

        console.log('✅ Token refresh successful');
        return response.data;
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * Logout user (invalidate tokens on server)
   */
  async logout(refreshToken?: string): Promise<void> {
    try {
      console.log('👋 Attempting logout...');
      
      // Try real database first, fallback to API
      const useRealDb = await this.shouldUseRealDatabase();
      
      if (useRealDb) {
        console.log('📊 Using real database for logout');
        await realAuthService.logout();
      } else {
        console.log('🌐 Using API for logout');
        const response = await apiClient.post(
          API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
          refreshToken ? { refreshToken } : undefined
        );

        if (!response.success) {
          console.warn('⚠️ Logout response not successful, but continuing...');
        }
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
      // Check real database first
      const dbHealthy = await realAuthService.checkHealth();
      if (dbHealthy) {
        console.log('✅ Real database is healthy');
        return true;
      }

      // Fallback to API health check
      const response = await apiClient.get('/health');
      const apiHealthy = response.success;
      console.log(apiHealthy ? '✅ API is healthy' : '⚠️ API is not healthy');
      return apiHealthy;
    } catch (error) {
      console.warn('⚠️ Health check failed for both database and API:', error);
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
        role: email === 'dentist@test.com' ? UserRole.DENTIST : UserRole.PATIENT,
        status: UserStatus.ACTIVE,
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
      throw new Error('Email tidak terdaftar. Gunakan test@example.com atau daftar akun baru.');
    }
  }

  async register(userData: RegisterRequest): Promise<AuthApiResponse> {
    console.log('📝 MOCK: Attempting registration for:', userData.email, 'as', userData.role);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, APP_CONFIG.DEV.MOCK_DELAYS.REGISTER));

    const email = userData.email.toLowerCase().trim();
    
    // Check if user already exists
    if (this.users.has(email)) {
      throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login.');
    }

    // Create mock user
    const mockUser = {
      id: Math.random().toString(),
      email: email,
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      role: userData.role,
      phone: userData.phone,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      preferredLanguage: 'id' as const,
      // Add role-specific data
      ...(userData.role === UserRole.PATIENT && {
        emergencyContactName: userData.emergencyContactName,
        emergencyContactPhone: userData.emergencyContactPhone,
        allergies: userData.allergies,
        medicalHistory: userData.medicalHistory,
      }),
      ...(userData.role === UserRole.DENTIST && {
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
          role: UserRole.PATIENT,
          status: UserStatus.ACTIVE,
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
