import { NextResponse } from 'next/server';

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get('contactId');

  if (!contactId) {
    return NextResponse.json({ success: false, error: 'Contact ID is required' }, { status: 400 });
  }

  try {
    // 1. Find the conversation for this contact
    const searchRes = await fetch(`https://services.leadconnectorhq.com/conversations/search?locationId=${GHL_LOCATION_ID}&contactId=${contactId}`, {
      headers: {
        'Authorization': GHL_API_KEY,
        'Version': '2021-04-15',
        'Accept': 'application/json'
      }
    });

    if (!searchRes.ok) {
      console.error("[GHL API] Conv Search Error:", await searchRes.text());
      return NextResponse.json({ success: false, error: "Failed to fetch conversations" }, { status: 500 });
    }

    const searchData = await searchRes.json();
    const convId = searchData.conversations?.[0]?.id;

    if (!convId) {
      return NextResponse.json({ success: true, messages: [] });
    }

    // 2. Fetch the messages
    const msgRes = await fetch(`https://services.leadconnectorhq.com/conversations/${convId}/messages`, {
      headers: {
        'Authorization': GHL_API_KEY,
        'Version': '2021-04-15',
        'Accept': 'application/json'
      }
    });

    if (!msgRes.ok) {
      console.error("[GHL API] Messages Fetch Error:", await msgRes.text());
      return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
    }

    const msgData = await msgRes.json();
    let conversationHistory = [];

    if (msgData.messages && msgData.messages.messages) {
      conversationHistory = msgData.messages.messages
        .filter(m => m.body || (m.activity && m.activity.title))
        .slice(0, 8)
        .map(m => {
          let text = m.body || m.activity?.title || "";
          text = text.replace(/<[^>]*>?/gm, ''); // Strip HTML
          return {
            body: text,
            direction: m.direction,
            dateAdded: m.dateAdded
          };
        });
    }

    return NextResponse.json({ success: true, messages: conversationHistory });

  } catch (error) {
    console.error("[GHL API] Exception:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
