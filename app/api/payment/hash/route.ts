import { NextResponse } from 'next/server';
import { generateKashierHash, validateKashierSignature } from '@/lib/kashier';

export async function POST(request: Request) {
  try {
    // Set CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');

    const { amount, currency, orderId } = await request.json();

    // Get merchant ID and API key from environment variables
    const mid = process.env.KASHIER_MERCHANT_ID;
    const secret = process.env.KASHIER_API_KEY;

    if (!mid || !secret) {
      return NextResponse.json({ error: 'Missing merchant ID or API key' }, { status: 500, headers });
    }

    // Generate the hash using shared utility
    const hash = generateKashierHash(mid, orderId, amount, currency, secret);

    return NextResponse.json({ hash }, { headers });
  } catch (error) {
    console.error('Error generating payment hash:', error);
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
    return NextResponse.json({ error: 'Failed to generate payment hash' }, { status: 500, headers });
  }
}

export async function OPTIONS(request: Request) {
  // Handle preflight requests
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');

  return new NextResponse(null, { status: 200, headers });
}

export async function GET(request: Request) {
  // Set CORS headers
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');

  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());

  // Get API key from environment variables
  const secret = process.env.KASHIER_API_KEY;

  if (!secret) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500, headers });
  }

  // Validate the signature using shared utility
  const isValid = validateKashierSignature(query, secret);

  return NextResponse.json({ isValid }, { headers });
}
