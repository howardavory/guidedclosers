// Stub for GoHighLevel (GHL) API Integration
// This file will house all the logic for connecting the Workflow Agent with your GHL CRM.

const GHL_API_KEY = process.env.NEXT_PUBLIC_GHL_API_KEY;
const GHL_LOCATION_ID = process.env.NEXT_PUBLIC_GHL_LOCATION_ID;
const GHL_USER_ID = process.env.NEXT_PUBLIC_GHL_AVORY_USER_ID;

const ACTIVE_STAGES = [
  "New Lead (Speed to Lead)",
  "Attempted Contact (10 Days of Pain)"
];

// Helper to fetch pipeline mapping once
let pipelineCache = null;
export async function getAcquisitionsPipeline() {
  if (pipelineCache) return pipelineCache;
  try {
    const res = await fetch(`/ghl-api/opportunities/pipelines?locationId=${GHL_LOCATION_ID}`, {
      headers: {
        'Authorization': GHL_API_KEY,
        'Version': '2021-07-28',
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    const acqPipe = data.pipelines?.find(p => p.name === "Acquisitions Pipeline");
    
    if (acqPipe) {
      const stageMap = {};
      acqPipe.stages.forEach(s => stageMap[s.id] = s.name);
      pipelineCache = { id: acqPipe.id, stageMap, stages: acqPipe.stages };
      return pipelineCache;
    }
  } catch(e) {
    console.error("Error fetching pipelines", e);
  }
  return null;
}

export const fetchPriorityPipeline = async (forceRefresh = false) => {
  console.log(`[GHL API] Fetching priority leads...`);
  
  // Cache Logic
  if (!forceRefresh) {
    const cachedStr = localStorage.getItem('ghl_pipeline_cache');
    if (cachedStr) {
      try {
        const cache = JSON.parse(cachedStr);
        const cacheAge = Date.now() - cache.timestamp;
        if (cacheAge < 24 * 60 * 60 * 1000) {
          console.log("[GHL API] Returning cached leads (from within 24h).");
          return cache.data;
        }
      } catch (e) {
        console.error("Error reading cache", e);
      }
    }
  }

  try {
    const pipelineInfo = await getAcquisitionsPipeline();
    if (!pipelineInfo) return [];

    let allOpps = [];
    let url = `/ghl-api/opportunities/search?location_id=${GHL_LOCATION_ID}&assigned_to=${GHL_USER_ID}&limit=100`;
    
    while (url) {
      const res = await fetch(url, {
        headers: {
          'Authorization': GHL_API_KEY,
          'Version': '2021-07-28',
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      allOpps = allOpps.concat(data.opportunities || []);
      url = data.meta?.nextPageUrl ? data.meta.nextPageUrl.replace('https://services.leadconnectorhq.com', '/ghl-api') : null;
    }

    const activeOpps = allOpps.filter(o => {
      if (o.pipelineId !== pipelineInfo.id) return false;
      const stageName = pipelineInfo.stageMap[o.pipelineStageId];
      return ACTIVE_STAGES.includes(stageName);
    }).sort((a, b) => {
      const stageA = pipelineInfo.stageMap[a.pipelineStageId];
      const stageB = pipelineInfo.stageMap[b.pipelineStageId];
      if (stageA === "New Lead (Speed to Lead)" && stageB !== "New Lead (Speed to Lead)") return -1;
      if (stageB === "New Lead (Speed to Lead)" && stageA !== "New Lead (Speed to Lead)") return 1;
      return 0;
    });
    
    // Process in chunks of 5 to avoid GHL Rate Limit (100 req/10s)
    // Each lead requires 3 API calls (Contact, Conversation Search, Messages)
    const chunkArray = (array, size) => {
      const chunked = [];
      for (let i = 0; i < array.length; i += size) chunked.push(array.slice(i, i + size));
      return chunked;
    };
    
    const chunks = chunkArray(activeOpps, 5);
    let enrichedOpps = [];
    
    for (const chunk of chunks) {
      const promises = chunk.map(async (o) => {
        if (!o.contactId) return { ...o, fullContact: null, conversationHistory: [] };
        
        let fullContact = null;
        let conversationHistory = [];
        
        try {
          // 1. Get Contact Details
          const cRes = await fetch(`/ghl-api/contacts/${o.contactId}`, {
            headers: { 'Authorization': GHL_API_KEY, 'Version': '2021-07-28', 'Accept': 'application/json' }
          });
          if (cRes.ok) {
            const data = await cRes.json();
            fullContact = data.contact;
          }

          // 2. Search for active conversation thread
          const convRes = await fetch(`/ghl-api/conversations/search?contactId=${o.contactId}`, {
            headers: { 'Authorization': GHL_API_KEY, 'Version': '2021-04-15', 'Accept': 'application/json' }
          });
          if (convRes.ok) {
            const convData = await convRes.json();
            if (convData.conversations && convData.conversations.length > 0) {
              const convId = convData.conversations[0].id;
              
              // 3. Fetch messages in thread
              const msgRes = await fetch(`/ghl-api/conversations/${convId}/messages`, {
                headers: { 'Authorization': GHL_API_KEY, 'Version': '2021-04-15', 'Accept': 'application/json' }
              });
              if (msgRes.ok) {
                const msgData = await msgRes.json();
                if (msgData.messages && msgData.messages.messages) {
                  // Extract the 8 most recent messages, formatted chronologically
                  conversationHistory = msgData.messages.messages
                    .filter(m => m.body || (m.activity && m.activity.title))
                    .slice(0, 8)
                    .map(m => {
                      let text = m.body || m.activity?.title || "";
                      text = text.replace(/<[^>]*>?/gm, ''); // Strip HTML
                      if (text.length > 200) text = text.substring(0, 200) + '...';
                      return `[${new Date(m.dateAdded).toLocaleDateString()} ${m.direction}] ${text}`;
                    })
                    .reverse();
                }
              }
            }
          }
        } catch (e) {
          console.error("Error fetching context for contact", o.contactId, e);
        }
        
        return { ...o, fullContact, conversationHistory };
      });
      
      const results = await Promise.all(promises);
      enrichedOpps = enrichedOpps.concat(results);
      // Wait 1.5 seconds between chunks to prevent 429 Too Many Requests
      await new Promise(r => setTimeout(r, 1500));
    }

    const mappedLeads = enrichedOpps.map(o => {
        const stageName = pipelineInfo.stageMap[o.pipelineStageId] || "Unknown";
        
        let source = "In-House (Central Valley)";
        let split = "20%";
        let leadTags = [];
        let entityType = "INDIVIDUAL";
        
        const nameUpper = (o.contactName || o.name || "").toUpperCase();
        const contact = o.fullContact || o.contact || {};
        
        if (contact.tags) {
          leadTags = contact.tags;
          const tagsStr = leadTags.join(' ').toLowerCase();
          const tagsUpper = leadTags.join(' ').toUpperCase();
          
          const tagsNormalized = leadTags.join('').replace(/[\s\-]/g, '').toLowerCase();
          
          if (tagsNormalized.includes('selfgeneratedlead(avory)') || tagsNormalized.includes('selfgenerated(avory)')) {
            source = "Self Gen";
            split = "50%";
          } else if (tagsNormalized.includes('agentoutreach(avory)')) {
            source = "Agent Outreach";
            split = "50%";
          } else {
            source = "In-House (Central Valley)";
            split = "20%";
          }

          if (nameUpper.includes('LLC') || nameUpper.includes('INC') || nameUpper.includes('COMPANY') || tagsUpper.includes('LLC') || tagsUpper.includes('COMPANY')) {
            entityType = "LLC";
          } else if (nameUpper.includes('TRUST') || nameUpper.includes('ESTATE') || tagsUpper.includes('TRUST')) {
            entityType = "TRUST";
          }
        } else {
          if (nameUpper.includes('LLC') || nameUpper.includes('INC') || nameUpper.includes('COMPANY')) {
            entityType = "LLC";
          } else if (nameUpper.includes('TRUST') || nameUpper.includes('ESTATE')) {
            entityType = "TRUST";
          }
        }

        // Use the fullContact data for address, phone, email
        return {
          id: o.id,
          contactId: o.contactId,
          name: o.contactName || o.name || "Unknown Lead",
          stageName: stageName,
          pipelineStageId: o.pipelineStageId,
          value: o.monetaryValue,
          updatedAt: o.updatedAt,
          source: source,
          split: split,
          entityType: entityType,
          tags: leadTags.slice(0, 3), 
          address: contact.address1 || contact.address || o.contact?.address1 || o.contact?.address || "No Address Provided",
          city: contact.city || "",
          state: contact.state || "",
          postalCode: contact.postalCode || "",
          phone: contact.phone || "No Phone",
          email: contact.email || "No Email",
          isActive: ACTIVE_STAGES.includes(stageName),
          conversationHistory: o.conversationHistory || []
        };
      });

    // Save to Cache
    localStorage.setItem('ghl_pipeline_cache', JSON.stringify({
      timestamp: Date.now(),
      data: mappedLeads
    }));

    return mappedLeads;
  } catch (error) {
    console.error("[GHL API] Error fetching leads:", error);
    return [];
  }
};

export const updatePipelineStage = async (opportunityId, newStageId) => {
  console.log(`[DRY RUN - GHL API Stub] Would have updated opportunity ${opportunityId} to stage ${newStageId}`);
  
  // Simulated delay to mimic network request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true); // Return true so the UI updates optimistically, but no actual API call is made
    }, 500);
  });
  
  /* LIVE CODE COMMENTED OUT FOR DRY RUN
  try {
    const res = await fetch(`/ghl-api/opportunities/${opportunityId}`, {
      method: 'PUT',
      headers: {
        'Authorization': GHL_API_KEY,
        'Version': '2021-07-28',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        pipelineStageId: newStageId
      })
    });
    
    if (res.ok) {
      console.log(`[GHL API] Successfully updated opportunity ${opportunityId} to stage ${newStageId}`);
      return true;
    } else {
      console.error("[GHL API] Failed to update stage:", await res.text());
      return false;
    }
  } catch (error) {
    console.error("[GHL API] Error updating opportunity stage:", error);
    return false;
  }
  */
};

export const initiateGHLCall = async (contactId, userId) => {
  console.log(`[GHL API Stub] Call Connect integration bypassed for now. Call triggered from CRM.`);
  return { success: true };
};

export const logCallMetrics = async (contactId, metrics) => {
  return { success: true };
};

export const addNoteToContact = async (contactId, noteBody, customFields = {}) => {
  if (!contactId) {
    console.error("[GHL API] Cannot add note: No contactId provided.");
    return false;
  }
  
  console.log(`[DRY RUN - GHL API Stub] Would have added note to contact ${contactId}: \n${noteBody}`);
  console.log(`[DRY RUN - GHL API Stub] Would have updated custom fields for contact ${contactId}: `, customFields);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
