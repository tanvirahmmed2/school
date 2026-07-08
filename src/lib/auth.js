import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { JWT_SECRET } from './secret';

const DEFAULT_JWT_SECRET = JWT_SECRET || 'fallback_secret_for_dev_mode';


export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}


export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}


export function signJWT(payload) {
  return jwt.sign(payload, DEFAULT_JWT_SECRET, { expiresIn: '7d' });
}


export function verifyJWT(token) {
  try {
    return jwt.verify(token, DEFAULT_JWT_SECRET);
  } catch (error) {
    return null;
  }
}


export async function isAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-admin')?.value;
    if (!token) return false;
    const decoded = verifyJWT(token);
    return !!(decoded && decoded.id);
  } catch (error) {
    return false;
  }
}
