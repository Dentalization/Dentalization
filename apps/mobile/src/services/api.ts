/**
 * API Configuration and Base Service for Dentalization Mobile App
 * Handles authentication API calls and HTTP requests
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types/auth';
import { getApiBaseUrl, APP_CONFIG } from '../config/app';

// API Configuration
export const API_CONFIG = {
  // Base URL from app configuration
  BASE_URL: getApiBaseUrl(),
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      VERIFY_EMAIL: '/auth/verify-email',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      UPLOAD_DOCUMENT: '/user/upload-document',
    },
    PATIENT: {
      APPOINTMENTS: '/patient/appointments',
      MEDICAL_HISTORY: '/patient/medical-history',
    },
    DENTIST: {
      PATIENTS: '/dentist/patients',
      SCHEDULE: '/dentist/schedule',
      VERIFY_LICENSE: '/dentist/verify-license',
    },
  },
  
  // Request timeouts from app configuration
  TIMEOUT: APP_CONFIG.API.TIMEOUT,
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface AuthApiResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

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
  role: UserRole;
  phone?: string;
  // Patient-specific fields
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  allergies?: string;
  medicalHistory?: string;
  // Dentist-specific fields
  licenseNumber?: string;
  specialization?: string;
  yearsOfExperience?: number;
  clinicName?: string;
  clinicAddress?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// HTTP Client Class
class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor() {
    this.baseURL = getApiBaseUrl();
    this.defaultTimeout = APP_CONFIG.API.TIMEOUT.DEFAULT;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('@dentalization/token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = this.defaultTimeout, ...fetchOptions } = options;
    
    const headers = await this.getAuthHeaders();
    
    const config: RequestInit = {
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers,
      },
    };

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error('Network error occurred');
    }
  }

  // GET request
  async get<T>(endpoint: string, timeout?: number): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', timeout });
  }

  // POST request
  async post<T>(
    endpoint: string, 
    data?: any, 
    timeout?: number
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      timeout,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string, 
    data?: any, 
    timeout?: number
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      timeout,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, timeout?: number): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', timeout });
  }

  // File upload (multipart/form-data)
  async uploadFile<T>(
    endpoint: string,
    file: File | Blob,
    fieldName: string = 'file',
    additionalData?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers = await this.getAuthHeaders();
    delete headers['Content-Type']; // Let browser set multipart boundary

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
      timeout: API_CONFIG.TIMEOUT.UPLOAD,
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// API Error Classes
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Utility function to handle API errors
export const handleApiError = (error: any): never => {
  if (error.name === 'AbortError') {
    throw new NetworkError('Request timeout');
  }
  
  if (error.message?.includes('timeout')) {
    throw new NetworkError('Request timeout');
  }
  
  if (error.message?.includes('Network')) {
    throw new NetworkError('Network connection failed');
  }
  
  if (error.statusCode === 401) {
    throw new AuthenticationError('Invalid credentials');
  }
  
  if (error.statusCode === 403) {
    throw new AuthenticationError('Access denied');
  }
  
  throw new ApiError(error.message || 'An error occurred', error.statusCode, error.errors);
};
