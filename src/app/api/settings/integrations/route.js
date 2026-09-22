import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-local-dev-key';

async function getWorkspaceId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const workspace = await prisma.workspace.findFirst({ where: { ownerId: decoded.userId }});
    return workspace?.id || null;
  } catch (err) {
    return null;
  }
}

export async function GET(req) {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const integrations = await prisma.integration.findMany({ where: { workspaceId } });
    
    // Map database rows back to the flat UI state
    const formState = {};
    integrations.forEach(int => {
      const meta = int.metadata ? JSON.parse(int.metadata) : {};
      if (int.provider === 'GHL') {
        formState.ghlLocationKey = int.apiKey || '';
        formState.ghlAgencyKey = meta.agencyKey || '';
      }
      if (int.provider === 'TWILIO') {
        formState.twilioSid = int.apiKey || '';
        formState.twilioToken = int.apiSecret || '';
      }
      if (int.provider === 'BATCHLEADS') formState.batchLeadsKey = int.apiKey || '';
      if (int.provider === 'DOCUSIGN') formState.docusignClientId = int.apiKey || '';
      if (int.provider === 'WEBHOOK') formState.webhookUrl = int.apiKey || '';
      if (int.provider === 'PROPSTREAM') formState.propStreamKey = int.apiKey || '';
      if (int.provider === 'INVESTORLIFT') formState.investorLiftKey = int.apiKey || '';
      if (int.provider === 'FUB') formState.fubKey = int.apiKey || '';
      if (int.provider === 'SMRTPHONE') formState.smrtPhoneKey = int.apiKey || '';
      if (int.provider === 'CALLTOOLS') formState.callToolsKey = int.apiKey || '';
      if (int.provider === 'QUICKBOOKS') {
        formState.quickBooksClientId = int.apiKey || '';
        formState.quickBooksClientSecret = int.apiSecret || '';
      }
    });

    return NextResponse.json(formState);
  } catch (error) {
    console.error("GET Integrations Error:", error);
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const workspaceId = await getWorkspaceId();
    if (!workspaceId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();

    const upsertIntegration = async (provider, apiKey, apiSecret = null, metadata = null) => {
      if (!apiKey && !apiSecret) return;
      await prisma.integration.upsert({
        where: { workspaceId_provider: { workspaceId, provider } },
        update: { apiKey, apiSecret, metadata: metadata ? JSON.stringify(metadata) : null },
        create: { workspaceId, provider, apiKey, apiSecret, metadata: metadata ? JSON.stringify(metadata) : null }
      });
    };

    await Promise.all([
      upsertIntegration('GHL', data.ghlLocationKey, null, { agencyKey: data.ghlAgencyKey }),
      upsertIntegration('TWILIO', data.twilioSid, data.twilioToken),
      upsertIntegration('BATCHLEADS', data.batchLeadsKey),
      upsertIntegration('DOCUSIGN', data.docusignClientId),
      upsertIntegration('WEBHOOK', data.webhookUrl),
      upsertIntegration('PROPSTREAM', data.propStreamKey),
      upsertIntegration('INVESTORLIFT', data.investorLiftKey),
      upsertIntegration('FUB', data.fubKey),
      upsertIntegration('SMRTPHONE', data.smrtPhoneKey),
      upsertIntegration('CALLTOOLS', data.callToolsKey),
      upsertIntegration('QUICKBOOKS', data.quickBooksClientId, data.quickBooksClientSecret)
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Integrations Error:", error);
    return NextResponse.json({ error: 'Failed to save integrations' }, { status: 500 });
  }
}
