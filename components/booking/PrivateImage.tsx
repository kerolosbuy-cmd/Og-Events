import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

interface PrivateImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}

export default function PrivateImage({
  src,
  alt,
  fill = false,
  className,
  sizes,
}: PrivateImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        setIsLoading(true);
        setError(null);

        // Call the API route to get the signed URL
        const response = await fetch(`/api/image?src=${encodeURIComponent(src)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setImageUrl(data.signedUrl);
      } catch (err: any) {
        console.error('Error fetching private image:', err);
        setError(err.message || 'Failed to load image');
      } finally {
        setIsLoading(false);
      }
    }

    if (src) {
      fetchImage();
    }
  }, [src]);

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 ${className || ''}`}>
        <div className="relative w-12 h-12 mb-3">
          <div className="absolute inset-0 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-slate-300 dark:border-slate-600 border-t-indigo-500 dark:border-t-indigo-400 animate-spin"></div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading image...</p>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 p-4 ${className || ''}`}
      >
        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full mb-3">
          <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
        </div>
        <p className="text-sm text-center font-medium">Failed to load image</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center max-w-xs">{error || 'No image URL'}</p>
      </div>
    );
  }

  return (
    <>
      <Image
        src={imageUrl}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        style={{
          objectFit: 'contain',
        }}
      />
      {fill && (
        <div className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <ImageIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </div>
      )}
    </>
  );
}
