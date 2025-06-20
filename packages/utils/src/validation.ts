// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidIndonesianPhone = (phone: string): boolean => {
  // Indonesian phone numbers: +62 or 0, followed by 8-12 digits
  const phoneRegex = /^(\+62|62|0)[8-9]\d{7,11}$/;
  const cleaned = phone.replace(/[\s-()]/g, '');
  return phoneRegex.test(cleaned);
};

export const normalizeIndonesianPhone = (phone: string): string => {
  const cleaned = phone.replace(/[\s-()]/g, '');

  if (cleaned.startsWith('0')) {
    return '+62' + cleaned.slice(1);
  } else if (cleaned.startsWith('62')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('+62')) {
    return cleaned;
  }

  return '+62' + cleaned;
};

export const isValidPassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isValidName = (name: string): boolean => {
  // Allow letters, spaces, apostrophes, and hyphens
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name) && name.trim().length >= 2;
};

export const sanitizeString = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};

export const isValidAge = (age: number): boolean => {
  return age >= 0 && age <= 150;
};

export const isValidDateOfBirth = (date: Date): boolean => {
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 150, 0, 1);
  const maxDate = new Date();

  return date >= minDate && date <= maxDate;
};
