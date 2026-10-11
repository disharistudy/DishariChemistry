export const ADMIN_PASSWORD = 'SHSaydi@25';
export const ADMIN_AUTH_COOKIE = 'dishari_admin_auth';
export const ADMIN_EMAIL = 'disharistudy@gmail.com';

export function verifyAdminPassword(password: string): boolean {
  if (!password) return false;
  return password.trim() === ADMIN_PASSWORD;
}
