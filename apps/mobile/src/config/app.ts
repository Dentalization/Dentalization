/**
 * App Configuration for Dentalization Mobile App
 * Centralized configuration for API endpoints, feature flags, and environment settings
 */

export const APP_CONFIG = {
  // Environment Configuration
  ENV: __DEV__ ? 'development' : 'production',
  IS_DEV: __DEV__,
  
  // API Configuration
  API: {
    // Toggle between mock and real API service
    // Set to false when your backend is ready and deployed
    USE_MOCK_SERVICE: true,
    
    // Backend API URLs
    BASE_URL: {
      DEVELOPMENT: 'http://localhost:3001/api',
      PRODUCTION: 'https://api.dentalization.com/api',
    },
    
    // Request timeouts (in milliseconds)
    TIMEOUT: {
      DEFAULT: 10000,  // 10 seconds
      UPLOAD: 30000,   // 30 seconds for file uploads
      LOGIN: 15000,    // 15 seconds for authentication
    },
  },
  
  // Authentication Configuration
  AUTH: {
    // Token expiry times (in milliseconds)
    TOKEN_EXPIRY: 24 * 60 * 60 * 1000,      // 24 hours
    REMEMBER_ME_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
    
    // Auto-refresh token when it expires in less than this time
    REFRESH_THRESHOLD: 5 * 60 * 1000,       // 5 minutes
    
    // Number of retry attempts for failed auth requests
    MAX_RETRY_ATTEMPTS: 3,
  },
  
  // Feature Flags
  FEATURES: {
    // Enable development helpers (reset buttons, debug info, etc.)
    DEVELOPMENT_HELPERS: __DEV__,
    
    // Enable biometric authentication (Face ID, Touch ID)
    BIOMETRIC_AUTH: false,
    
    // Enable push notifications
    PUSH_NOTIFICATIONS: false,
    
    // Enable offline mode
    OFFLINE_MODE: false,
    
    // Enable analytics and crash reporting
    ANALYTICS: !__DEV__,
    
    // Enable file upload for document verification
    DOCUMENT_UPLOAD: true,
  },
  
  // App Metadata
  APP: {
    NAME: 'Dentalization',
    VERSION: '1.0.0',
    BUILD_NUMBER: '1',
    
    // Support information
    SUPPORT_EMAIL: 'support@dentalization.com',
    SUPPORT_PHONE: '+62-xxx-xxxx-xxxx',
    
    // App Store / Play Store URLs (for updates/rating prompts)
    STORE_URLS: {
      IOS: 'https://apps.apple.com/app/dentalization',
      ANDROID: 'https://play.google.com/store/apps/details?id=com.dentalization.mobile',
    },
  },
  
  // UI Configuration
  UI: {
    // Theme configuration
    THEME: {
      BRAND_COLORS: {
        PRIMARY: '#483AA0',    // Blue-violet
        ACCENT: '#A08A48',     // Muted gold
        SUCCESS: '#10B981',    // Green
        WARNING: '#F59E0B',    // Amber
        ERROR: '#EF4444',      // Red
        INFO: '#3B82F6',       // Blue
      },
      
      // Animation durations (in milliseconds)
      ANIMATIONS: {
        FAST: 200,
        NORMAL: 300,
        SLOW: 500,
      },
    },
    
    // Form validation
    VALIDATION: {
      PASSWORD_MIN_LENGTH: 8,
      PHONE_PATTERN: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
      EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  
  // Development Configuration
  DEV: {
    // Enable detailed logging
    VERBOSE_LOGGING: __DEV__,
    
    // Enable React Native Flipper integration
    FLIPPER_ENABLED: __DEV__,
    
    // Mock API response delays (in milliseconds)
    MOCK_DELAYS: {
      LOGIN: 1000,
      REGISTER: 1500,
      API_CALL: 800,
    },
    
    // Test accounts for development
    TEST_ACCOUNTS: {
      PATIENT: {
        email: 'patient@test.com',
        password: 'password123',
        role: 'patient',
      },
      DENTIST: {
        email: 'dentist@test.com',
        password: 'password123',
        role: 'dentist',
      },
    },
  },
} as const;

// Type definitions for configuration
export type AppConfig = typeof APP_CONFIG;
export type Environment = typeof APP_CONFIG.ENV;
export type FeatureFlag = keyof typeof APP_CONFIG.FEATURES;

// Utility functions
export const isFeatureEnabled = (feature: FeatureFlag): boolean => {
  return APP_CONFIG.FEATURES[feature];
};

export const getApiBaseUrl = (): string => {
  return APP_CONFIG.IS_DEV 
    ? APP_CONFIG.API.BASE_URL.DEVELOPMENT 
    : APP_CONFIG.API.BASE_URL.PRODUCTION;
};

export const shouldUseMockService = (): boolean => {
  return APP_CONFIG.API.USE_MOCK_SERVICE;
};

// Development utilities
export const isDevelopment = (): boolean => APP_CONFIG.IS_DEV;
export const isProduction = (): boolean => !APP_CONFIG.IS_DEV;

// Logging utility
export const log = (message: string, ...args: any[]): void => {
  if (APP_CONFIG.DEV.VERBOSE_LOGGING) {
    console.log(`[${APP_CONFIG.APP.NAME}] ${message}`, ...args);
  }
};

export const logError = (message: string, error?: any): void => {
  console.error(`[${APP_CONFIG.APP.NAME}] ERROR: ${message}`, error);
};

export const logWarning = (message: string, ...args: any[]): void => {
  if (APP_CONFIG.DEV.VERBOSE_LOGGING) {
    console.warn(`[${APP_CONFIG.APP.NAME}] WARNING: ${message}`, ...args);
  }
};
