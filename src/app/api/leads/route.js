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

    const leads = await prisma.lead.findMany({
      where: { workspaceId: workspace.id },
      include: { 
        property: true,
        contact: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await prisma.workspace.findFirst({ where: { ownerId: userId } });
    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const data = await req.json();

    // 1. Get or create a pipeline if none exist
    let pipeline = await prisma.pipeline.findFirst({ where: { workspaceId: workspace.id }});
    if (!pipeline) {
      pipeline = await prisma.pipeline.create({
        data: {
          name: 'Main Pipeline',
          workspaceId: workspace.id,
          stages: {
            create: [
              { name: 'New Leads', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400', order: 0 },
              { name: 'Contacted', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400', order: 1 },
              { name: 'Dispositions', color: 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]', order: 2 }
            ]
          }
        }
      });
    }

    // 2. Find the target stage, or fallback to the first stage
    let targetStage = await prisma.stage.findFirst({ 
      where: { id: data.stageId, pipelineId: pipeline.id } 
    });
    
    if (!targetStage) {
      targetStage = await prisma.stage.findFirst({
        where: { pipelineId: pipeline.id },
        orderBy: { order: 'asc' }
      });
    }

    const newLead = await prisma.lead.create({
      data: {
        workspace: { connect: { id: workspace.id } },
        stage: { connect: { id: targetStage.id } },
        motivationScore: parseInt(data.motivationScore) || 5,
        contact: {
          create: {
            workspace: { connect: { id: workspace.id } },
            firstName: data.firstName || 'Unknown',
            lastName: data.lastName || null,
            phone: data.phone || null,
            email: data.email || null,
            notes: data.notes || null,
          }
        },
        property: {
          create: {
            address: data.address || 'Unknown Address',
            city: data.city || null,
            state: data.state || null,
            zip: data.zip || null,
            // Ensure no NaN values reach Prisma
            arv: data.arv && !isNaN(data.arv) ? parseFloat(data.arv) : null,
            askingPrice: data.askingPrice && !isNaN(data.askingPrice) ? parseFloat(data.askingPrice) : null,
            mao: data.mao && !isNaN(data.mao) ? parseFloat(data.mao) : null,
            distressFlags: data.distressFlags && data.distressFlags.length > 0 
              ? JSON.stringify(data.distressFlags) 
              : null,
          }
        }
      },
      include: { property: true, contact: true }
    });

    return NextResponse.json(newLead);
  } catch (error) {
    console.error("🔥 PRISMA CRASH DETAILS:", error);
    return NextResponse.json({ 
      error: 'Database Rejection', 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
