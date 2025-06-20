// String manipulation utilities
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
  );
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const truncate = (
  str: string,
  length: number,
  suffix: string = '...'
): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
};

export const generateRandomString = (length: number): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;

  const masked =
    username.charAt(0) +
    '*'.repeat(username.length - 2) +
    username.charAt(username.length - 1);
  return `${masked}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/[\s-()]/g, '');
  if (cleaned.length <= 4) return phone;

  const visible = 4;
  const masked =
    cleaned.slice(0, visible) +
    '*'.repeat(cleaned.length - visible * 2) +
    cleaned.slice(-visible);
  return masked;
};

export const extractInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
