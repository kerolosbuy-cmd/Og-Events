
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, AlertCircle } from 'lucide-react';

interface AndroidCameraProps {
  onScan: (result: string) => void;
  onError: (error: string) => void;
}

export function AndroidCamera({ onScan, onError }: AndroidCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Try to initialize camera on component mount
    initializeCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      // Check if we can access camera devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');

      if (!hasCamera) {
        onError('No camera device found on your Android device');
        setIsLoading(false);
        return;
      }

      // Try to access camera with specific constraints for Android
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', '');
        videoRef.current.setAttribute('muted', '');
        videoRef.current.setAttribute('controls', '');
        videoRef.current.style.transform = 'scaleX(-1)'; // Mirror for better UX

        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
          setPermissionGranted(true);
          setShowInstructions(false);

          // Start QR scanning after video is ready
          startQRScanning();
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setIsLoading(false);

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          onError('Camera permission denied. Please tap the permission icon (lock or info) in your browser\'s address bar, allow camera access, and refresh the page.');
        } else if (err.name === 'NotFoundError') {
          onError('No camera found on your device. You can upload an image with a QR code instead.');
        } else {
          onError(`Camera error: ${err.message}`);
        }
      } else {
        onError('Failed to access camera. You can upload an image with a QR code instead.');
      }
    }
  };

  const startQRScanning = async () => {
    try {
      // Dynamically import qr-scanner
      const QrScanner = (await import('qr-scanner')).default;

      if (videoRef.current) {
        const qrScanner = new QrScanner(
          videoRef.current,
          (result: any) => {
            const qrData = typeof result === 'string' ? result : result.data;
            onScan(qrData);
            stopCamera();
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            maxScansPerSecond: 5,
            returnDetailedScanResult: true,
            calculateScanRegion: (video: HTMLVideoElement) => {
              const smallestDimension = Math.min(video.videoWidth, video.videoHeight);
              const scanRegionSize = Math.round(0.7 * smallestDimension);

              return {
                x: Math.round((video.videoWidth - scanRegionSize) / 2),
                y: Math.round((video.videoHeight - scanRegionSize) / 2),
                width: scanRegionSize,
                height: scanRegionSize,
              };
            }
          }
        );

        await qrScanner.start();
      }
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      onError('Failed to start QR scanner. You can upload an image with a QR code instead.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        const QrScanner = (await import('qr-scanner')).default;
        const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
        if (result && result.data) {
          onScan(result.data);
        } else {
          onError('No QR code found in the uploaded image. Please try another image.');
        }
      } catch (err) {
        console.error('Error scanning image:', err);
        onError('Failed to scan the image. Please ensure it contains a valid QR code.');
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {showInstructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <h3 className="font-medium text-blue-900">Android Camera Setup</h3>
          </div>
          <p className="text-sm text-blue-800 mb-4">
            To scan QR codes on Android, please follow these steps:
          </p>
          <ol className="text-sm text-blue-800 mb-4 list-decimal pl-5 space-y-1">
            <li>Tap the "Enable Camera" button below</li>
            <li>Allow camera access when prompted by your browser</li>
            <li>Position the QR code within the frame</li>
          </ol>
          <div className="flex gap-2">
            <Button onClick={initializeCamera} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Camera className="h-4 w-4 mr-1" />
              Enable Camera
            </Button>
            <Button onClick={triggerFileInput} variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              Upload Image Instead
            </Button>
          </div>
        </div>
      )}

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          controls
          className={`w-full rounded-lg ${!permissionGranted ? 'hidden' : ''}`}
        />

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p>Initializing camera...</p>
          </div>
        )}

        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
