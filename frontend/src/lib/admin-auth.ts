// =============================================
// PaimonGuide TH - Admin Authentication
// =============================================
// ใช้ JWT-based session เก็บใน httpOnly cookie
// ป้องกัน XSS, CSRF (SameSite=Strict)

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const ADMIN_COOKIE_NAME = 'paimon_admin_session';
const SESSION_DURATION = 60 * 60 * 8; // 8 hours

function getSecretKey() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error('ADMIN_PASSWORD not set in environment');
  return new TextEncoder().encode(secret + '_jwt_secret_key_v1');
}

/** สร้าง JWT token สำหรับ admin session */
export async function createAdminSession(): Promise<string> {
  const token = await new SignJWT({ role: 'admin', iat: Date.now() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecretKey());

  return token;
}

/** ตรวจสอบ admin session จาก cookie */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;

    await jwtVerify(token, getSecretKey());
    return true;
  } catch {
    return false;
  }
}

/** ตั้งค่า admin session cookie */
export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

/** ลบ admin session cookie */
export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

/** ตรวจสอบรหัสผ่าน */
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}

export { ADMIN_COOKIE_NAME };
