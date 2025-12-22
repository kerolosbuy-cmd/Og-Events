'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, ArrowLeft, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import QrScanner from 'qr-scanner';

export default function QRScannerPage() {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const qrScannerRef = useRef<QrScanner | null>(null);

    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [hasCamera, setHasCamera] = useState(true);
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

    useEffect(() => {
        const initScanner = async () => {
            if (!videoRef.current) return;

            try {
                // Check if camera is available
                const hasCamera = await QrScanner.hasCamera();
                setHasCamera(hasCamera);

                if (!hasCamera) {
                    setError('No camera found on this device');
                    return;
                }

                // Create QR Scanner instance
                const qrScanner = new QrScanner(
                    videoRef.current,
                    (result) => {
                        setResult(result.data);
                        qrScanner.stop();
                        setScanning(false);
                    },
                    {
                        returnDetailedScanResult: true,
                        highlightScanRegion: true,
                        highlightCodeOutline: true,
                        preferredCamera: facingMode,
                    }
                );

                qrScannerRef.current = qrScanner;

                // Start scanning
                await qrScanner.start();
                setScanning(true);
                setError('');
            } catch (err) {
                console.error('Scanner initialization error:', err);
                if (err instanceof Error) {
                    if (err.name === 'NotAllowedError') {
                        setError('Camera permission denied. Please allow camera access to scan QR codes.');
                    } else if (err.name === 'NotFoundError') {
                        setError('No camera found on this device.');
                    } else if (err.name === 'NotReadableError') {
                        setError('Camera is already in use by another application.');
                    } else {
                        setError('Failed to access camera. Please try again.');
                    }
                } else {
                    setError('An unexpected error occurred.');
                }
                setScanning(false);
            }
        };

        initScanner();

        // Cleanup
        return () => {
            if (qrScannerRef.current) {
                qrScannerRef.current.stop();
                qrScannerRef.current.destroy();
            }
        };
    }, [facingMode]);

    const handleCopyResult = async () => {
        if (result) {
            try {
                await navigator.clipboard.writeText(result);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const handleScanAgain = async () => {
        setResult('');
        setError('');
        setCopied(false);

        if (qrScannerRef.current) {
            try {
                await qrScannerRef.current.start();
                setScanning(true);
            } catch (err) {
                console.error('Failed to restart scanner:', err);
                setError('Failed to restart camera. Please refresh the page.');
            }
        }
    };

    const handleFlipCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Camera className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        QR Scanner
                    </h1>
                    <button
                        onClick={handleFlipCamera}
                        disabled={!scanning || !hasCamera}
                        className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-20 pb-8 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Instructions */}
                    {!result && !error && (
                        <div className="mb-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30 shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                How to scan
                            </h2>
                            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">1.</span>
                                    <span>Allow camera access when prompted</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">2.</span>
                                    <span>Point your camera at a QR code</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">3.</span>
                                    <span>The QR code will be scanned automatically</span>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Camera Preview */}
                    {!result && !error && (
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-[3/4] max-w-md mx-auto">
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                playsInline
                                muted
                            />

                            {/* Scanning Overlay */}
                            {scanning && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-64 h-64">
                                        {/* Animated corners */}
                                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-indigo-500 rounded-tl-2xl animate-pulse" />
                                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-indigo-500 rounded-tr-2xl animate-pulse" />
                                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-indigo-500 rounded-bl-2xl animate-pulse" />
                                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-indigo-500 rounded-br-2xl animate-pulse" />

                                        {/* Scanning line animation */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan" />
                                    </div>
                                </div>
                            )}

                            {/* Loading indicator */}
                            {!scanning && hasCamera && !error && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <div className="text-white text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-3" />
                                        <p className="font-medium">Initializing camera...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="max-w-md mx-auto">
                            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 text-center shadow-lg">
                                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                    <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    Unable to Access Camera
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-6">
                                    {error}
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-md"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Result Display */}
                    {result && (
                        <div className="max-w-md mx-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-green-200 dark:border-green-800">
                                {/* Success Animation */}
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-20" />
                                    <div className="relative bg-green-100 dark:bg-green-900/30 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center">
                                        <Check className="h-12 w-12 text-green-500 dark:text-green-400" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                                    QR Code Scanned!
                                </h3>

                                {/* Result Content */}
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                                        Scanned Data:
                                    </p>
                                    <p className="text-gray-900 dark:text-white break-all font-mono text-sm">
                                        {result}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleCopyResult}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-5 w-5" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-5 w-5" />
                                                Copy to Clipboard
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleScanAgain}
                                        className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md"
                                    >
                                        Scan Another QR Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          100% {
            top: 100%;
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
        </div>
    );
}
