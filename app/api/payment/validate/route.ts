import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: Request) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');

  return new NextResponse(null, { status: 200, headers });
}

export async function POST(request: Request) {
  // Set CORS headers
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');

  try {
    const { params } = await request.json();

    // Get API key from environment variables
    const secret = process.env.KASHIER_API_KEY;

    if (!secret) {
      console.error('Missing API key for signature validation');
      return NextResponse.json({ error: 'Missing API key' }, { status: 500, headers });
    }

    console.log('Validating signature with params:', params);

    // Create query string for validation in the same format as the webhook
    let queryString = '';
    for (const key in params) {
      if (key === 'signature' || key === 'mode') continue;
      queryString += '&' + key + '=' + params[key];
    }
    const finalUrl = queryString.substr(1);

    console.log('Generated query string for validation:', finalUrl);

    // Generate the expected signature
    const expectedSignature = crypto.createHmac('sha256', secret).update(finalUrl).digest('hex');

    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', params.signature);

    // Compare signatures
    const isValid = expectedSignature === params.signature;

    console.log('Signature validation result:', isValid);

    return NextResponse.json(
      {
        isValid,
        expectedSignature: isValid ? undefined : expectedSignature, // Only include in response if invalid
      },
      { headers }
    );
  } catch (error) {
    console.error('Error validating signature:', error);
    return NextResponse.json({ error: 'Failed to validate signature' }, { status: 500, headers });
  }
}
