import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const STATS_FILE_PATH = path.join(process.cwd(), 'data', 'stats.json');

// Helper to initialize the file if it doesn't exist
async function getStats() {
  try {
    const data = await fs.readFile(STATS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    const defaultStats = {
      totalContacts: 0,
      offersSubmitted: 0,
      contractsSent: 0,
      projectedFees: 0,
      variablesPulled: 0,
      disqualified: 0,
      voicemails: 0,
      dropOffs: {
        "Intro": 0,
        "Occupancy": 0,
        "Condition": 0,
        "Timeline": 0,
        "Financials": 0,
        "Contracting": 0
      },
      logs: []
    };
    await fs.mkdir(path.dirname(STATS_FILE_PATH), { recursive: true });
    await fs.writeFile(STATS_FILE_PATH, JSON.stringify(defaultStats, null, 2));
    return defaultStats;
  }
}

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}

export async function POST(request) {
  try {
    const event = await request.json();
    const stats = await getStats();
    
    if (!stats.logs) stats.logs = [];
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Event routing
    switch (event.type) {
      case 'CONTACT':
        stats.totalContacts += 1;
        break;
      case 'VARIABLES_PULLED':
        stats.variablesPulled += 1;
        stats.logs.unshift({ time, action: 'Variables Pulled', target: event.leadName || 'Unknown Lead', isSuccess: true });
        break;
      case 'DISQUALIFY':
        stats.disqualified += 1;
        stats.logs.unshift({ time, action: `Disqualified${event.reason ? ' - ' + event.reason : ''}`, target: event.leadName || 'Lead', isDisqualified: true });
        break;
      case 'VOICEMAIL':
        stats.voicemails += 1;
        stats.logs.unshift({ time, action: 'Left Voicemail', target: event.leadName || 'Lead', isNeutral: true });
        break;
      case 'OFFER_SUBMITTED':
        stats.offersSubmitted = (stats.offersSubmitted || 0) + 1;
        stats.logs.unshift({ time, action: 'Offer Submitted', target: event.leadName || 'Lead', isSuccess: true });
        break;
      case 'CONTRACT_SENT':
        stats.contractsSent = (stats.contractsSent || 0) + 1;
        stats.projectedFees = (stats.projectedFees || 0) + (Number(event.assignmentFee) || 0);
        stats.logs.unshift({ time, action: 'Contract Sent', target: event.leadName || 'Lead', isSuccess: true });
        break;
      case 'FOLLOW_UP':
        stats.logs.unshift({ time, action: 'Needs Follow Up', target: event.leadName || 'Lead', isNeutral: true });
        break;
      case 'DROP_OFF':
        if (event.pillar && stats.dropOffs[event.pillar] !== undefined) {
          stats.dropOffs[event.pillar] += 1;
          stats.logs.unshift({ time, action: `Dropped off at ${event.pillar}`, target: event.leadName || 'Lead', isDisqualified: true });
        }
        break;
    }

    // Keep only last 50 logs to prevent infinite growth
    stats.logs = stats.logs.slice(0, 50);

    await fs.writeFile(STATS_FILE_PATH, JSON.stringify(stats, null, 2));
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
  }
}
