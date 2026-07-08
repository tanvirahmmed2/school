import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './secret';

const DEFAULT_JWT_SECRET = JWT_SECRET || 'fallback_secret_for_dev_mode';

/**
 * Hashes a plaintext password.
 * @param {string} password 
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plaintext password with a hashed password.
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Signs a JWT payload.
 * @param {object} payload 
 * @returns {string}
 */
export function signJWT(payload) {
  return jwt.sign(payload, DEFAULT_JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies a JWT token.
 * @param {string} token 
 * @returns {object|null}
 */
export function verifyJWT(token) {
  try {
    return jwt.verify(token, DEFAULT_JWT_SECRET);
  } catch (error) {
    return null;
  }
}
