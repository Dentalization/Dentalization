export declare const APP: {
  readonly NAME: 'Dentalization';
  readonly VERSION: '1.0.0';
  readonly DESCRIPTION: 'Smart Dental Care Ecosystem';
  readonly SUPPORT_EMAIL: 'support@dentalization.com';
  readonly WEBSITE: 'https://dentalization.com';
};
export declare const API: {
  readonly BASE_URL: 'https://api.dentalization.com' | 'http://localhost:3001';
  readonly VERSION: 'v1';
  readonly TIMEOUT: 30000;
  readonly RETRY_ATTEMPTS: 3;
};
export declare const FILE_UPLOAD: {
  readonly MAX_SIZE: number;
  readonly ALLOWED_IMAGE_TYPES: readonly [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];
  readonly ALLOWED_DOCUMENT_TYPES: readonly [
    'application/pdf',
    'application/msword',
  ];
};
export declare const PAGINATION: {
  readonly DEFAULT_PAGE: 1;
  readonly DEFAULT_LIMIT: 20;
  readonly MAX_LIMIT: 100;
};
export declare const CACHE: {
  readonly SHORT: number;
  readonly MEDIUM: number;
  readonly LONG: number;
  readonly VERY_LONG: number;
};
export declare const RATE_LIMIT: {
  readonly LOGIN_ATTEMPTS: 5;
  readonly LOGIN_WINDOW: number;
  readonly API_REQUESTS_PER_MINUTE: 100;
  readonly FILE_UPLOADS_PER_HOUR: 50;
};
//# sourceMappingURL=app.d.ts.map
