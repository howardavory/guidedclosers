'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-local-dev-key';

export async function sandboxLogin(role) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Sandbox login is strictly disabled in production.');
  }

  const username = role.toLowerCase();
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

export async function productionLogin(usernameOrEmail, password) {
  try {
    if (!usernameOrEmail || typeof usernameOrEmail !== 'string') return { success: false, error: 'Invalid login format' };
    
    const cleanInput = usernameOrEmail.toLowerCase().trim();
    
    // Enforce Password constraints (Min 5, max 17 chars)
    if (!password || typeof password !== 'string') return { success: false, error: 'Invalid password format' };
    if (password.length < 5 || password.length > 17) return { success: false, error: 'Password must be between 5 and 17 characters' };

    // Emergency Admin Provisioning for Live DB (if wiped/unseeded)
    if (cleanInput === 'howardavory617' && password === 'Annabelle32616!') {
      try {
        const passwordHash = await bcrypt.hash(password, 10);
        
        // 1. First see if user exists by username to avoid unique collision
        let adminUser = await prisma.user.findUnique({ where: { username: 'howardavory617' } });
        
        if (!adminUser) {
          // If not found by username, try to upsert by email
          adminUser = await prisma.user.upsert({
            where: { email: 'howard.avory@gmail.com' },
            update: {
              username: 'howardavory617',
              passwordHash,
              role: 'ADMIN'
            },
            create: {
              email: 'howard.avory@gmail.com',
              username: 'howardavory617',
              passwordHash,
              role: 'ADMIN',
              firstName: 'Howard',
              lastName: 'Avory'
            }
          });
        } else {
          // Exists by username, just make sure password and role are correct
          adminUser = await prisma.user.update({
            where: { username: 'howardavory617' },
            data: { passwordHash, role: 'ADMIN' }
          });
        }
        
        // Ensure workspace exists
        let workspace = await prisma.workspace.findFirst({ where: { ownerId: adminUser.id } });
        if (!workspace) {
          workspace = await prisma.workspace.create({
            data: { 
              name: 'Howard Workspace', 
              ownerId: adminUser.id
            }
          });
        }
        
        // Ensure default pipeline exists
        const pipelineCount = await prisma.pipeline.count({ where: { workspaceId: workspace.id } });
        if (pipelineCount === 0) {
          await prisma.pipeline.create({
            data: {
              name: 'Wholesale Pipeline',
              workspaceId: workspace.id,
              stages: {
                create: [
                  { name: 'New Leads', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400', order: 0 },
                  { name: 'Contacted', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400', order: 1 },
                  { name: 'Appointments', color: 'bg-orange-500/10 border-orange-500/30 text-orange-400', order: 2 },
                  { name: 'Offers Out', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400', order: 3 },
                  { name: 'Under Contract', color: 'bg-green-500/10 border-green-500/30 text-green-400', order: 4 },
                  { name: 'Dispositions', color: 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]', order: 5 }
                ]
              }
            }
          });
        }
      } catch (provErr) {
        return { success: false, error: 'Emergency Provisioning Failed: ' + provErr.message };
      }
    }

    const user = await prisma.user.findFirst({ 
      where: { 
        OR: [
          { username: cleanInput },
          { email: cleanInput }
        ]
      } 
    });
    
    if (!user) {
      return { success: false, error: 'Invalid credentials - User not found in DB' };
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials - Incorrect password' };
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
  } catch (globalErr) {
    return { success: false, error: 'Server Error: ' + globalErr.message };
  }
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