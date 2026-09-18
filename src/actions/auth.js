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

  const email = `${role.toLowerCase()}@local.test`;
  const user = await prisma.user.findUnique({
    where: { email },
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

  return { success: true, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } };
}

export async function productionLogin(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  // Handle 2FA verification logic here (mocked for now, as user requested architecture)
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

  return { success: true, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } };
}

export async function verifyInviteToken(tokenStr) {
  const invite = await prisma.invitation.findUnique({ where: { token: tokenStr } });
  
  if (!invite) return { success: false, error: 'Invalid token' };
  if (invite.isUsed) return { success: false, error: 'Token already used' };
  if (invite.expiresAt < new Date()) return { success: false, error: 'Token expired' };

  return { success: true, email: invite.email, role: invite.role };
}

// Additional mock function for 2FA
export async function verify2FA(userId, code) {
  // In a real system, verify the TOTP code.
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

  return { success: true, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } };
}

export async function checkUserCount() {
  const count = await prisma.user.count();
  return count;
}

export async function bootstrapAdmin(email, password, firstName, lastName) {
  const count = await prisma.user.count();
  if (count > 0) {
    return { success: false, error: 'Admin already bootstrapped' };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
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

  return { success: true, user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName } };
}