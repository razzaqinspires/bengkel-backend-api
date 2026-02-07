// src/utils/password.js
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Mengubah password mentah menjadi hash
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Membandingkan password mentah dengan hash di database
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
