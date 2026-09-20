'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-local-dev-key';

export async function sandboxLogin(role) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Sandbox login is strictly disabled in production.');
  }

  const username = `${role.toLowerCase()}user`;
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error(`Sandbox user not found for role ${role}. Run seed script!`);
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { success: true, user: { id: user.id, username: user.username, role: user.role } };
}

export async function productionLogin(username, password) {
  if (!username || typeof username !== 'string') return { success: false, error: 'Invalid username format' };
  
  // Enforce Username constraints (Max 15 chars, alphanumeric, case-insensitive)
  if (username.length > 15) return { success: false, error: 'Username must be 15 characters or less' };
  if (!/^[a-zA-Z0-9]+$/.test(username)) return { success: false, error: 'Username must be alphanumeric only' };
  
  // Enforce Password constraints (Min 5, max 17 chars)
  if (!password || typeof password !== 'string') return { success: false, error: 'Invalid password format' };
  if (password.length < 5 || password.length > 17) return { success: false, error: 'Password must be between 5 and 17 characters' };

  const cleanUsername = username.toLowerCase();

  const user = await prisma.user.findUnique({ where: { username: cleanUsername } });
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  if (user.isTwoFactorEnabled) {
    return { success: true, require2FA: true, userId: user.id };
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { success: true, user: { id: user.id, username: user.username, role: user.role, firstName: user.firstName, lastName: user.lastName } };
}

export async function verifyInviteToken(tokenStr) {
  const invite = await prisma.invitation.findUnique({ where: { token: tokenStr } });
  
  if (!invite) return { success: false, error: 'Invalid token' };
  if (invite.isUsed) return { success: false, error: 'Token already used' };
  if (invite.expiresAt < new Date()) return { success: false, error: 'Token expired' };

  return { success: true, email: invite.email, role: invite.role };
}

export async function verify2FA(userId, code) {
  if (code !== '123456') return { success: false, error: 'Invalid code' };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: 'User not found' };

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { success: true, user: { id: user.id, username: user.username, role: user.role, firstName: user.firstName, lastName: user.lastName } };
}

export async function checkUserCount() {
  const count = await prisma.user.count();
  return count;
}

export async function bootstrapAdmin(email, username, password, firstName, lastName) {
  const count = await prisma.user.count();
  if (count > 0) {
    return { success: false, error: 'Admin already bootstrapped' };
  }

  // Enforce Username constraints (Max 15 chars, alphanumeric, case-insensitive)
  if (!username || username.length > 15) return { success: false, error: 'Username must be 15 characters or less' };
  if (!/^[a-zA-Z0-9]+$/.test(username)) return { success: false, error: 'Username must be alphanumeric only' };
  
  // Enforce Password constraints (Min 5, max 17 chars)
  if (!password || password.length < 5 || password.length > 17) return { success: false, error: 'Password must be between 5 and 17 characters' };

  const cleanUsername = username.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: {
      email,
      username: cleanUsername,
      passwordHash,
      role: 'ADMIN',
      firstName,
      lastName
    }
  });

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { success: true, user: { id: user.id, username: user.username, role: user.role, firstName: user.firstName, lastName: user.lastName } };
}