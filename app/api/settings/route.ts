import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

// GET endpoint to fetch current settings
export async function GET() {
  try {
    const settingsPath = path.join(process.cwd(), 'config/settings.json');
    const settingsData = fs.readFileSync(settingsPath, 'utf8');
    return NextResponse.json(JSON.parse(settingsData));
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT endpoint to update settings
export async function PUT(request: Request) {
  try {
    const { payment } = await request.json();

    // Read current settings
    const settingsPath = path.join(process.cwd(), 'config/settings.json');
    const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));

    // Update the payment time limit
    if (payment && payment.timeLimit !== undefined) {
      settingsData.payment.timeLimit = payment.timeLimit;
    }

    // Write updated settings back to file
    fs.writeFileSync(settingsPath, JSON.stringify(settingsData, null, 2));

    return NextResponse.json({ success: true, settings: settingsData });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
