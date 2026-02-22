import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { sub: string; email: string; role: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; email: string; role: string };
    return payload;
  } catch {
    return null;
  }
}
