import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-local-dev-key';

export async function POST(req) {
  try {
    // 1. Verify Admin Session via Edge cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    // 2. Parse request
    const { email, role } = await req.json();
    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const validRoles = ['ADMIN', 'MANAGER', 'CLOSER', 'SETTER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role provided' }, { status: 400 });
    }

    // 3. Generate Cryptographic Hash Token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    // 4. Upsert Invitation in Database
    const invitation = await prisma.invitation.upsert({
      where: { email },
      update: {
        token: inviteToken,
        role: role,
        expiresAt: expiresAt,
        isUsed: false,
      },
      create: {
        email,
        role,
        token: inviteToken,
        expiresAt: expiresAt,
      },
    });

    // 5. Mock Dispatch Email via Resend
    // In production, you would await resend.emails.send({...})
    console.log(`[EMAIL DISPATCH MOCK] To: ${email} | Role: ${role}`);
    console.log(`[EMAIL DISPATCH MOCK] Link: https://yourapp.com/signup/${inviteToken}`);

    return NextResponse.json({ success: true, message: 'Invite dispatched successfully.' });
  } catch (error) {
    console.error('[INVITE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
