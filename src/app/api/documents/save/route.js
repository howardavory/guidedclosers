import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
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

export async function POST(req) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await prisma.workspace.findFirst({ where: { ownerId: userId } });
    if (!workspace) return NextResponse.json({ error: 'No workspace found' }, { status: 404 });

    const { contactId, type, title, payload } = await req.json();

    if (!contactId || !type || !title || !payload) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newDoc = await prisma.generatedDocument.create({
      data: {
        workspaceId: workspace.id,
        contactId,
        type,
        title,
        payload
      }
    });

    return NextResponse.json(newDoc);
  } catch (error) {
    console.error("🚨 DOCUMENT SAVE CRASH:", error);
    return NextResponse.json({ error: 'Failed to save document' }, { status: 500 });
  }
}

// Fetch generated documents for a contact
export async function GET(req) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');

    if (!contactId) return NextResponse.json({ error: 'Missing contactId' }, { status: 400 });

    const docs = await prisma.generatedDocument.findMany({
      where: { contactId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(docs);
  } catch (error) {
    console.error("🚨 DOCUMENT GET CRASH:", error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
