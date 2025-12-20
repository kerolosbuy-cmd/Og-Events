import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { validateKashierSignature } from '@/lib/kashier';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

async function storeLastWebhook(data: any, signature?: string, validationResult?: { isValid: boolean; error?: string }) {
  try {
    const dataDir = join(process.cwd(), 'data');
    const filePath = join(dataDir, 'last-webhook.json');

    await mkdir(dataDir, { recursive: true }).catch(() => { });

    const webhookRecord = {
      timestamp: new Date().toISOString(),
      data: data,
      signature: signature || null,
      validationResult: validationResult || null,
    };

    await writeFile(filePath, JSON.stringify(webhookRecord, null, 2));
  } catch (error) {
    console.error('Error storing webhook data:', error);
  }
}

export async function OPTIONS(request: Request) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return new NextResponse(null, { status: 200, headers });
}

export async function POST(request: Request) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Kashier-Signature');

  try {
    const body = await request.json();
    const { data, event } = body;

    // Get signature from header
    const headerSignature = request.headers.get('x-kashier-signature');

    const secret = process.env.KASHIER_API_KEY;
    const testMode = process.env.WEBHOOK_TEST_MODE === 'true';

    let validationResult = { isValid: true, error: undefined as string | undefined };

    if (!testMode) {
      if (!secret) {
        console.error('Missing API key');
        validationResult = { isValid: false, error: 'Missing API key' };
        await storeLastWebhook({ event, ...data }, headerSignature || undefined, validationResult);
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500, headers });
      }

      if (!headerSignature) {
        console.error('Missing x-kashier-signature header');
        validationResult = { isValid: false, error: 'Missing x-kashier-signature header' };
        await storeLastWebhook({ event, ...data }, headerSignature || undefined, validationResult);
        return NextResponse.json({ error: 'Missing signature header' }, { status: 401, headers });
      }

      // Validate webhook signature using the new approach
      const { validateKashierWebhook } = await import('@/lib/kashier');
      const isValid = validateKashierWebhook(data, headerSignature, secret);

      if (!isValid) {
        console.error('Invalid signature');
        console.error('Received signature:', headerSignature);
        console.error('Webhook data:', JSON.stringify(data, null, 2));
        validationResult = { isValid: false, error: 'Invalid signature' };
        await storeLastWebhook({ event, ...data }, headerSignature, validationResult);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401, headers });
      }

      validationResult = { isValid: true, error: undefined };
    } else {
      console.log('TEST MODE: Skipping signature validation');
      validationResult = { isValid: true, error: 'Test mode - validation skipped' };
    }

    // Store webhook data for UI display (after validation)
    await storeLastWebhook({ event, ...data }, headerSignature || undefined, validationResult);

    console.log('=== WEBHOOK DATA DEBUG ===');
    console.log('Event:', event);
    console.log('Data keys:', Object.keys(data));
    console.log('Full data:', JSON.stringify(data, null, 2));
    console.log('========================');

    const orderId = data.orderId || data.merchantOrderId;
    const paymentStatus = data.status;
    const transactionId = data.transactionId;

    if (!orderId) {
      console.error('Missing order ID - checked orderId and merchantOrderId fields');
      console.error('Available fields:', Object.keys(data));
      return NextResponse.json({ error: 'Missing order ID' }, { status: 400, headers });
    }

    // Update booking status based on payment status
    if (paymentStatus === 'SUCCESS' || paymentStatus === 'success') {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          payment_method: 'Kashier',
          kashier_transaction_Id: transactionId,
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating booking status:', error);
        return NextResponse.json(
          { error: 'Failed to update booking status' },
          { status: 500, headers }
        );
      }

      console.log('Payment successful for booking ' + orderId + ', transaction ID: ' + transactionId);
    } else {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'payment_failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating booking status:', error);
        return NextResponse.json(
          { error: 'Failed to update booking status' },
          { status: 500, headers }
        );
      }

      console.log('Payment failed for booking ' + orderId);
    }

    return NextResponse.json({ status: 'success' }, { headers });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500, headers });
  }
}

export async function GET(request: Request) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');

  try {
    const filePath = join(process.cwd(), 'data', 'last-webhook.json');
    const fileContent = await readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return NextResponse.json(data, { headers });
  } catch (error) {
    return NextResponse.json({ error: 'No webhook data found' }, { status: 404, headers });
  }
}
