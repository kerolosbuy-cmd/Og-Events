'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class TicketErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('TicketDesigner Error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mx-4 my-8">
                    <div className="bg-red-50 p-4 rounded-full mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-500 mb-6 max-w-md">
                        The ticket designer encountered an unexpected error.
                        {this.state.error?.message && <span className="block mt-2 italic text-sm text-red-400">{this.state.error.message}</span>}
                    </p>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => window.location.reload()}
                            variant="default"
                            className="gap-2"
                        >
                            <RefreshCcw className="h-4 w-4" />
                            Reload Page
                        </Button>
                        <Button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            variant="outline"
                        >
                            Try to Recover
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
