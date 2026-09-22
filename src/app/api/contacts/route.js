import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-local-dev-key';

async function getCurrentUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

export async function GET(req) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await prisma.workspace.findFirst({ where: { ownerId: userId } });
    if (!workspace) return NextResponse.json([]);

    const contacts = await prisma.contact.findMany({
      where: { workspaceId: workspace.id },
      include: {
        leads: {
          include: {
            property: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("🚨 CONTACTS API CRASH:", error);
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, firstName, lastName, phone, email } = await req.json();
    if (!id) return NextResponse.json({ error: 'Contact ID required' }, { status: 400 });

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email })
      },
      include: { leads: { include: { property: true } } }
    });

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error("🚨 CONTACT PATCH CRASH:", error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}
