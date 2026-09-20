import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  
  if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

  try {
    // 1. Google Maps Static Image Generator
    // Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${encodeURIComponent(address)}&key=${apiKey}`;

    // 2. Simulated Aggregator Fetch (Zillow/Redfin wrapper)
    // In production, this hits your actual 3rd party API
    const simulatedArv = Math.floor(Math.random() * (450000 - 250000 + 1) + 250000);

    return NextResponse.json({
      success: true,
      data: {
        streetViewUrl,
        estimatedArv: simulatedArv,
        confidence: 'High',
        sources: ['Zestimate', 'Redfin Estimate']
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Context fetch failed' }, { status: 500 });
  }
}
