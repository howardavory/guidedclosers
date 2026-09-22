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
    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const pipelines = await prisma.pipeline.findMany({
      where: { workspaceId: workspace.id },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        }
      }
    });

    return NextResponse.json(pipelines);
  } catch (error) {
    console.error('[GET_PIPELINES_ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch pipelines' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const workspace = await prisma.workspace.findFirst({ where: { ownerId: userId } });
    if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });

    const { name, stages } = await req.json();

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const pipeline = await prisma.pipeline.create({
      data: {
        name,
        workspaceId: workspace.id,
        stages: {
          create: stages ? stages.map((s, idx) => ({
            name: s.name,
            color: s.color || 'bg-gray-500/10 border-gray-500/30 text-gray-400',
            order: s.order !== undefined ? s.order : idx
          })) : []
        }
      },
      include: {
        stages: true
      }
    });

    return NextResponse.json(pipeline);
  } catch (error) {
    console.error('[POST_PIPELINE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create pipeline' }, { status: 500 });
  }
}
