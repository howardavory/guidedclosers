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

export async function POST(req) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await prisma.workspace.findFirst({ where: { ownerId: userId } });
    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const { leads } = await req.json();

    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    // Use a transaction to ensure all leads and properties are created atomically
    await prisma.$transaction(async (tx) => {
      for (const row of leads) {
        // Skip rows missing required fields
        if (!row.sellerName || !row.address) continue;

        await tx.lead.create({
          data: {
            workspaceId: workspace.id,
            sellerName: row.sellerName,
            phone: row.phone || null,
            email: row.email || null,
            motivationScore: parseInt(row.motivationScore) || 5,
            notes: row.notes || null,
            status: row.status || 'NEW',
            property: {
              create: {
                address: row.address,
                city: row.city || null,
                state: row.state || null,
                zip: row.zip || null,
                arv: row.arv ? parseFloat(row.arv) : null,
                askingPrice: row.askingPrice ? parseFloat(row.askingPrice) : null,
              }
            }
          }
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[BULK_IMPORT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to execute bulk import' }, { status: 500 });
  }
}
