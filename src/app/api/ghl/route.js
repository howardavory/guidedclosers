import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent caching of this API route

const GHL_API_KEY = process.env.GHL_API_KEY || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_USER_ID = process.env.GHL_AVORY_USER_ID;

const ACTIVE_STAGES = [
  "New Lead (Speed to Lead)",
  "Attempted Contact (10 Days of Pain)"
];

export async function GET() {
  try {
    const authHeader = GHL_API_KEY.startsWith('Bearer ') ? GHL_API_KEY : `Bearer ${GHL_API_KEY}`;
    
    // 1. Fetch Pipelines
    const pipeRes = await fetch(`https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${GHL_LOCATION_ID}`, {
      headers: {
        'Authorization': authHeader,
        'Version': '2021-07-28',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });
    
    if (!pipeRes.ok) {
      const errText = await pipeRes.text();
      console.error("[GHL API] Pipeline Fetch Error:", errText, "Status:", pipeRes.status, "LocationID:", GHL_LOCATION_ID ? "Loaded" : "Missing", "API Key:", GHL_API_KEY ? "Loaded" : "Missing");
      return NextResponse.json({ success: false, error: `Failed to fetch pipelines: ${errText} (Status ${pipeRes.status})` }, { status: 500 });
    }
    
    const pipeData = await pipeRes.json();
    const acqPipe = pipeData.pipelines?.find(p => p.name.includes("Acquisition"));
    
    if (!acqPipe) {
      return NextResponse.json({ success: false, error: "Acquisitions Pipeline not found" }, { status: 404 });
    }

    const stageMap = {};
    acqPipe.stages.forEach(s => stageMap[s.id] = s.name);

    // 2. Fetch Opportunities
    let allOpps = [];
    let url = `https://services.leadconnectorhq.com/opportunities/search?location_id=${GHL_LOCATION_ID}&assigned_to=${GHL_USER_ID}&limit=100`;
    
    while (url) {
      const res = await fetch(url, {
        headers: {
          'Authorization': authHeader,
          'Version': '2021-07-28',
          'Accept': 'application/json'
        },
        cache: 'no-store'
      });
      if (!res.ok) break;
      const data = await res.json();
      allOpps = allOpps.concat(data.opportunities || []);
      url = data.meta?.nextPageUrl || null;
    }

    // 3. Filter and Sort Opportunities
    const activeOpps = allOpps.filter(o => o.pipelineId === acqPipe.id).sort((a, b) => {
      const stageIndexA = acqPipe.stages.findIndex(s => s.id === a.pipelineStageId);
      const stageIndexB = acqPipe.stages.findIndex(s => s.id === b.pipelineStageId);
      return stageIndexA - stageIndexB;
    });

    // 4. Fetch Contact Details to get full addresses
    const mappedLeads = [];
    for (const o of activeOpps) {
      let addressStr = '';
      let phoneStr = o.contact?.phone || o.contact?.email || 'N/A';
      
      try {
        if (o.contactId) {
          const contactRes = await fetch(`https://services.leadconnectorhq.com/contacts/${o.contactId}`, {
            headers: {
              'Authorization': authHeader,
              'Version': '2021-07-28',
              'Accept': 'application/json'
            },
            cache: 'no-store'
          });
          if (contactRes.ok) {
            const cData = await contactRes.json();
            const contact = cData.contact || {};
            const addrParts = [];
            if (contact.address1) addrParts.push(contact.address1);
            if (contact.city) addrParts.push(contact.city);
            if (contact.state) addrParts.push(contact.state);
            if (addrParts.length > 0) {
              addressStr = addrParts.join(', ');
            }
            if (contact.phone) {
              phoneStr = contact.phone;
            }
          }
        }
      } catch (e) {
        console.error("Error fetching contact", o.contactId, e);
      }

      mappedLeads.push({
        id: o.id,
        contactId: o.contactId,
        name: o.contact?.name || o.name || 'Unknown',
        address: addressStr || o.contact?.address1 || '',
        phone: phoneStr,
        stage: stageMap[o.pipelineStageId],
        stageId: o.pipelineStageId
      });
    }

    return NextResponse.json({ success: true, data: mappedLeads, stages: acqPipe.stages.map(s => ({ id: s.id, name: s.name })) });
    
  } catch (error) {
    console.error("[GHL API] Exception:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
