import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '@dentalization/shared-types';
import { authService, mockAuthService } from '../services/authService';
import { APP_CONFIG, shouldUseMockService, log, logError } from '../config/app';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastLoginTime: Date | null;
  rememberMe: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthContextType extends AuthState {
  userRole: UserRole | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (userData: any) => Promise<AuthResponse>;
  loginWithUser: (user: User, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
  refreshAuthToken: () => Promise<boolean>;
  clearAuthData: () => Promise<void>;
  checkTokenExpiry: () => Promise<boolean>;
  isTokenValid: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@dentalization/user',
  TOKEN: '@dentalization/token',
  REFRESH_TOKEN: '@dentalization/refresh_token',
  REMEMBER_ME: '@dentalization/remember_me',
  LAST_LOGIN: '@dentalization/last_login',
  TOKEN_EXPIRY: '@dentalization/token_expiry',
} as const;

// Token expiry time (from app configuration)
const TOKEN_EXPIRY_TIME = APP_CONFIG.AUTH.TOKEN_EXPIRY;
const REMEMBER_ME_EXPIRY_TIME = APP_CONFIG.AUTH.REMEMBER_ME_EXPIRY;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Select service based on configuration
  const currentAuthService = shouldUseMockService() ? mockAuthService : authService;
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    lastLoginTime: null,
    rememberMe: false,
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const [
        storedUser,
        storedToken,
        storedRefreshToken,
        storedRememberMe,
        storedLastLogin,
        storedTokenExpiry
      ] = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.REMEMBER_ME,
        STORAGE_KEYS.LAST_LOGIN,
        STORAGE_KEYS.TOKEN_EXPIRY,
      ]);

      const user = storedUser[1] ? JSON.parse(storedUser[1]) : null;
      const token = storedToken[1];
      const refreshToken = storedRefreshToken[1];
      const rememberMe = storedRememberMe[1] === 'true';
      const lastLoginTime = storedLastLogin[1] ? new Date(storedLastLogin[1]) : null;
      const tokenExpiry = storedTokenExpiry[1] ? new Date(storedTokenExpiry[1]) : null;

      if (user && token) {
        // Check if token is still valid
        const isValid = await validateStoredToken(token, tokenExpiry, rememberMe);
        
        if (isValid) {
          setAuthState({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            lastLoginTime,
            rememberMe,
          });
          console.log('Auto-login successful for user:', user.email);
        } else {
          // Token expired, try to refresh
          const refreshed = await attemptTokenRefresh(refreshToken);
          if (!refreshed) {
            await clearAuthData();
          }
        }
      } else {
        setAuthState(prev => ({ 
          ...prev, 
          isLoading: false,
          isAuthenticated: false 
        }));
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await clearAuthData();
    }
  }, []);

  const validateStoredToken = async (
    token: string, 
    tokenExpiry: Date | null, 
    rememberMe: boolean
  ): Promise<boolean> => {
    if (!token) return false;

    const now = new Date();
    const expiryTime = rememberMe ? REMEMBER_ME_EXPIRY_TIME : TOKEN_EXPIRY_TIME;
    
    if (tokenExpiry && now > tokenExpiry) {
      console.log('Token expired');
      return false;
    }

    // In a real app, you'd validate the token with your backend
    // For now, we'll just check if it exists and hasn't expired
    return true;
  };

  const attemptTokenRefresh = async (refreshToken: string | null): Promise<boolean> => {
    if (!refreshToken) return false;

    try {
      console.log('🔄 Attempting to refresh token...');
      
      // Use the selected authentication service for token refresh
      const authResponse = await currentAuthService.refreshToken(refreshToken);
      
      // Update stored auth data
      await storeAuthData(authResponse, authState.rememberMe);
      
      // Update auth state
      setAuthState(prev => ({
        ...prev,
        token: authResponse.token,
        refreshToken: authResponse.refreshToken,
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
      }));

      console.log('✅ Token refresh successful');
      return true;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      // If refresh fails, clear auth data and force re-login
      await clearAuthData();
      return false;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      console.log('🔐 Authenticating user:', credentials.email);
      
      // Use the selected authentication service (real API or mock)
      const authResponse = await currentAuthService.login({
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe,
      });

      await storeAuthData(authResponse, credentials.rememberMe || false);
        
      setAuthState({
        user: authResponse.user,
        token: authResponse.token,
        refreshToken: authResponse.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        lastLoginTime: new Date(),
        rememberMe: credentials.rememberMe || false,
      });

      console.log('✅ Login successful for:', credentials.email);
      return authResponse;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      console.log('📝 Registering user:', userData.email, 'as', userData.role);
      
      // Use the selected authentication service for registration
      const authResponse = await currentAuthService.register(userData);

      await storeAuthData(authResponse, false);
        
      setAuthState({
        user: authResponse.user,
        token: authResponse.token,
        refreshToken: authResponse.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        lastLoginTime: new Date(),
        rememberMe: false,
      });

      console.log('✅ Registration successful for:', userData.email);
      return authResponse;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      console.error('❌ Registration error:', error);
      throw error;
    }
  };

  const loginWithUser = async (user: User, token?: string): Promise<void> => {
    try {
      const authToken = token || `mock_token_${Date.now()}`;
      const refreshToken = `mock_refresh_${Date.now()}`;
      const now = new Date();
      
      const authResponse: AuthResponse = {
        user,
        token: authToken,
        refreshToken,
        expiresIn: TOKEN_EXPIRY_TIME,
      };

      await storeAuthData(authResponse, false);

      setAuthState({
        user,
        token: authToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        lastLoginTime: now,
        rememberMe: false,
      });

      console.log('User logged in successfully:', user.email);
    } catch (error) {
      console.error('Error in loginWithUser:', error);
      throw error;
    }
  };

  const storeAuthData = async (authResponse: AuthResponse, rememberMe: boolean): Promise<void> => {
    const { user, token, refreshToken, expiresIn } = authResponse;
    const now = new Date();
    const expiryTime = new Date(now.getTime() + expiresIn);

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.USER, JSON.stringify(user)],
      [STORAGE_KEYS.TOKEN, token],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      [STORAGE_KEYS.REMEMBER_ME, rememberMe.toString()],
      [STORAGE_KEYS.LAST_LOGIN, now.toISOString()],
      [STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toISOString()],
    ]);

    console.log('Auth data stored successfully');
  };

  const logout = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Call logout endpoint to invalidate server-side session
      await currentAuthService.logout(authState.refreshToken || undefined);

      await clearAuthData();
      
      console.log('👋 User logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Even if logout fails, clear local data
      await clearAuthData();
      throw error;
    }
  };

  const clearAuthData = async (): Promise<void> => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.REMEMBER_ME,
      STORAGE_KEYS.LAST_LOGIN,
      STORAGE_KEYS.TOKEN_EXPIRY,
    ]);

    setAuthState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      lastLoginTime: null,
      rememberMe: false,
    });
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!authState.user) throw new Error('No user logged in');

      const updatedUser = { ...authState.user, ...userData, updatedAt: new Date() };
      
      // In a real app, you'd update the user on the server
      // await api.updateUser(updatedUser, authState.token);

      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const refreshAuthToken = async (): Promise<boolean> => {
    return await attemptTokenRefresh(authState.refreshToken);
  };

  const checkTokenExpiry = async (): Promise<boolean> => {
    const tokenExpiry = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
    if (!tokenExpiry) return false;

    const expiryDate = new Date(tokenExpiry);
    const now = new Date();
    const timeUntilExpiry = expiryDate.getTime() - now.getTime();

    // If token expires in less than 5 minutes, try to refresh
    if (timeUntilExpiry < 5 * 60 * 1000) {
      return await refreshAuthToken();
    }

    return true;
  };

  const isTokenValid = (): boolean => {
    if (!authState.token || !authState.isAuthenticated) return false;

    // Additional validation logic can be added here
    return true;
  };

  const value: AuthContextType = {
    ...authState,
    userRole: authState.user?.role || null,
    login,
    register,
    loginWithUser,
    logout,
    updateUser,
    refreshAuthToken,
    clearAuthData,
    checkTokenExpiry,
    isTokenValid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
