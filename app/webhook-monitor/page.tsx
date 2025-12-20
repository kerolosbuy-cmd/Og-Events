'use client';

import { useEffect, useState } from 'react';
import './webhook-monitor.css';

interface WebhookData {
    timestamp: string;
    data: Record<string, any>;
    signature?: string | null;
    validationResult?: {
        isValid: boolean;
        error?: string;
    } | null;
}

export default function WebhookMonitor() {
    const [webhookData, setWebhookData] = useState<WebhookData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkingSignature, setCheckingSignature] = useState(false);
    const [signatureCheckResult, setSignatureCheckResult] = useState<string | null>(null);

    const fetchWebhookData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/payment/webhook');

            if (response.ok) {
                const data = await response.json();
                setWebhookData(data);
                setError(null);
            } else {
                setError('No webhook data available yet');
                setWebhookData(null);
            }
        } catch (err) {
            setError('Failed to fetch webhook data');
            setWebhookData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebhookData();
        // Auto-refresh every 5 seconds
        const interval = setInterval(fetchWebhookData, 5000);
        return () => clearInterval(interval);
    }, []);

    const getStatusBadge = (status: string) => {
        const statusLower = status?.toLowerCase();
        if (statusLower === 'success') {
            return <span className="status-badge success">✓ Success</span>;
        } else if (statusLower === 'failed' || statusLower === 'failure') {
            return <span className="status-badge failed">✗ Failed</span>;
        } else {
            return <span className="status-badge pending">● {status}</span>;
        }
    };

    const checkSignature = async () => {
        if (!webhookData?.signature) {
            setSignatureCheckResult('No signature available to check');
            return;
        }

        setCheckingSignature(true);
        setSignatureCheckResult(null);

        try {
            if (webhookData.validationResult) {
                if (webhookData.validationResult.isValid) {
                    setSignatureCheckResult('✓ Signature is valid!');
                } else {
                    setSignatureCheckResult(`✗ Signature validation failed: ${webhookData.validationResult.error || 'Unknown error'}`);
                }
            } else {
                setSignatureCheckResult('No validation result available');
            }
        } catch (err) {
            setSignatureCheckResult('Error checking signature');
        } finally {
            setCheckingSignature(false);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div className="webhook-monitor">
            <div className="monitor-container">
                <header className="monitor-header">
                    <div className="header-content">
                        <div className="title-section">
                            <h1>Payment Webhook Monitor</h1>
                            <p>Real-time payment webhook data from Kashier</p>
                        </div>
                        <button onClick={fetchWebhookData} className="refresh-btn" disabled={loading}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                            </svg>
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </header>

                <div className="monitor-content">
                    {loading && !webhookData ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading webhook data...</p>
                        </div>
                    ) : error && !webhookData ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h2>No Webhook Data</h2>
                            <p>{error}</p>
                            <p className="hint">Waiting for the first webhook to arrive...</p>
                        </div>
                    ) : webhookData ? (
                        <>
                            <div className="webhook-card">
                                <div className="card-header">
                                    <h2>Last Received Webhook</h2>
                                    <span className="timestamp">{formatTimestamp(webhookData.timestamp)}</span>
                                </div>

                                <div className="card-body">
                                    {webhookData.signature && (
                                        <div className="signature-section">
                                            <h3>Signature Debugging</h3>
                                            <div className="signature-info">
                                                <label>x-kashier-signature Header</label>
                                                <div className="signature-value">{webhookData.signature}</div>
                                            </div>
                                            {webhookData.validationResult && (
                                                <div className="validation-status">
                                                    <label>Validation Status</label>
                                                    <div className={`status ${webhookData.validationResult.isValid ? 'valid' : 'invalid'}`}>
                                                        {webhookData.validationResult.isValid ? '✓ Valid' : '✗ Invalid'}
                                                        {webhookData.validationResult.error && (
                                                            <span className="error-detail"> - {webhookData.validationResult.error}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            <button onClick={checkSignature} className="check-btn" disabled={checkingSignature}>
                                                {checkingSignature ? 'Checking...' : 'Check Signature'}
                                            </button>
                                            {signatureCheckResult && (
                                                <div className={`check-result ${signatureCheckResult.includes('✓') ? 'success' : 'error'}`}>
                                                    {signatureCheckResult}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="info-grid">
                                        {webhookData.data.paymentStatus && (
                                            <div className="info-item highlight">
                                                <label>Payment Status</label>
                                                <div>{getStatusBadge(webhookData.data.paymentStatus)}</div>
                                            </div>
                                        )}

                                        {webhookData.data.orderId && (
                                            <div className="info-item">
                                                <label>Order ID</label>
                                                <div className="value">{webhookData.data.orderId}</div>
                                            </div>
                                        )}

                                        {webhookData.data.transactionId && (
                                            <div className="info-item">
                                                <label>Transaction ID</label>
                                                <div className="value">{webhookData.data.transactionId}</div>
                                            </div>
                                        )}

                                        {webhookData.data.amount && (
                                            <div className="info-item">
                                                <label>Amount</label>
                                                <div className="value amount">{webhookData.data.amount} {webhookData.data.currency || 'EGP'}</div>
                                            </div>
                                        )}

                                        {webhookData.data.merchantOrderId && (
                                            <div className="info-item">
                                                <label>Merchant Order ID</label>
                                                <div className="value">{webhookData.data.merchantOrderId}</div>
                                            </div>
                                        )}

                                        {webhookData.data.cardNumber && (
                                            <div className="info-item">
                                                <label>Card Number</label>
                                                <div className="value">•••• {webhookData.data.cardNumber}</div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="raw-data-section">
                                        <details>
                                            <summary>View Raw JSON Data</summary>
                                            <pre className="json-display">{JSON.stringify(webhookData.data, null, 2)}</pre>
                                        </details>
                                    </div>
                                </div>
                            </div>

                            <div className="info-banner">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                                <span>Auto-refreshing every 5 seconds</span>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
