import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const data = new URLSearchParams(body);
    const params = Object.fromEntries(data.entries());

    // Get API key from environment variables
    const secret = process.env.KASHIER_API_KEY;

    if (!secret) {
      console.error('Missing API key');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Validate the signature
    let queryString = '';
    for (const key in params) {
      if (key === 'signature' || key === 'mode') continue;
      queryString += '&' + key + '=' + params[key];
    }
    const finalUrl = queryString.substr(1);
    const signature = crypto.createHmac('sha256', secret).update(finalUrl).digest('hex');

    if (signature !== params.signature) {
      console.error('Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Extract payment details
    const orderId = params.orderId;
    const paymentStatus = params.paymentStatus;
    const transactionId = params.transactionId;

    if (!orderId) {
      console.error('Missing order ID');
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      );
    }

    // Update booking status based on payment status
    if (paymentStatus === 'SUCCESS') {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          payment_method: 'online',
          payment_id: transactionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating booking status:', error);
        return NextResponse.json(
          { error: 'Failed to update booking status' },
          { status: 500 }
        );
      }

      console.log(`Payment successful for booking ${orderId}, transaction ID: ${transactionId}`);
    } else {
      // Handle failed payment
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'payment_failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating booking status:', error);
        return NextResponse.json(
          { error: 'Failed to update booking status' },
          { status: 500 }
        );
      }

      console.log(`Payment failed for booking ${orderId}`);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
