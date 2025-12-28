
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isUserAdmin } from '@/lib/auth';

export async function GET() {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user || !isUserAdmin(user)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('tickets')
            .select('*');

        if (error) {
            console.error('Error fetching tickets:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ error: 'No data found' }, { status: 404 });
        }

        // Convert to CSV
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map((row) =>
                headers
                    .map((header) => {
                        const value = row[header] === null || row[header] === undefined ? '' : row[header];
                        // Escape quotes and wrap in quotes if it contains comma or quotes
                        const stringValue = String(value);
                        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                            return `"${stringValue.replace(/"/g, '""')}"`;
                        }
                        return stringValue;
                    })
                    .join(',')
            ),
        ].join('\n');

        // Create response with CSV content
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="tickets-export.csv"',
            },
        });
    } catch (error: any) {
        console.error('Error in export-tickets:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
