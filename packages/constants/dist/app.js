// Application-wide constants
export const APP = {
    NAME: 'Dentalization',
    VERSION: '1.0.0',
    DESCRIPTION: 'Smart Dental Care Ecosystem',
    SUPPORT_EMAIL: 'support@dentalization.com',
    WEBSITE: 'https://dentalization.com',
};
// API configuration
export const API = {
    BASE_URL: process.env.NODE_ENV === 'production'
        ? 'https://api.dentalization.com'
        : 'http://localhost:3001',
    VERSION: 'v1',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
};
// File upload limits
export const FILE_UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
};
// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
// Cache durations (in seconds)
export const CACHE = {
    SHORT: 5 * 60, // 5 minutes
    MEDIUM: 30 * 60, // 30 minutes
    LONG: 2 * 60 * 60, // 2 hours
    VERY_LONG: 24 * 60 * 60, // 24 hours
};
// Rate limiting
export const RATE_LIMIT = {
    LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
    API_REQUESTS_PER_MINUTE: 100,
    FILE_UPLOADS_PER_HOUR: 50,
};
//# sourceMappingURL=app.js.map