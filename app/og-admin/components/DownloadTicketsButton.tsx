
'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export function DownloadTicketsButton() {
    const handleDownload = async () => {
        try {
            const response = await fetch('/api/export-tickets');

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to download tickets');
            }

            // Convert to blob and download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tickets-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Tickets exported successfully');
        } catch (error: any) {
            console.error('Download error:', error);
            toast.error(error.message || 'Failed to download tickets');
        }
    };

    return (
        <Button
            onClick={handleDownload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all duration-200"
        >
            <Download className="mr-2 h-4 w-4" />
            Export Tickets CSV
        </Button>
    );
}
