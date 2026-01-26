// utils/auth.utils.js
import bcrypt from 'bcryptjs';

export async function hashPassword(plainPassword) {
  if (!plainPassword) {
    throw new Error('Password is required');
  }

  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plainPassword, salt);
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}