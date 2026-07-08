import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { JWT_SECRET } from './secret';
import { query } from './db';

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
    if (!decoded || !decoded.id) return false;

    // Direct database validation check
    const result = await query('SELECT id, is_active FROM admins WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) return false;

    const admin = result.rows[0];
    return !!admin.is_active;
  } catch (error) {
    console.error('Error verifying admin authorization:', error);
    return false;
  }
}


export async function isTeacher() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-teacher')?.value;
    if (!token) return false;

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) return false;

    // Direct database validation check
    const result = await query('SELECT id, is_active, is_registered FROM teachers WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) return false;

    const teacher = result.rows[0];
    return !!(teacher.is_active && teacher.is_registered);
  } catch (error) {
    console.error('Error verifying teacher authorization:', error);
    return false;
  }
}


export async function isStudent() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('fit-student')?.value;
    if (!token) return false;

    const decoded = verifyJWT(token);
    if (!decoded || !decoded.id) return false;

    // Direct database validation check
    const result = await query('SELECT id, is_active, is_registered FROM students WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) return false;

    const student = result.rows[0];
    return !!(student.is_active && student.is_registered);
  } catch (error) {
    console.error('Error verifying student authorization:', error);
    return false;
  }
}

