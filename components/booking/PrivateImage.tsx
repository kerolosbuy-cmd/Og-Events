import { useState, useEffect } from 'react';
import Image from 'next/image';

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
      <div className={`flex items-center justify-center bg-gray-100 ${className || ''}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-500 ${className || ''}`}
      >
        <span className="text-sm">Failed to load image: {error || 'No image URL'}</span>
      </div>
    );
  }

  return <Image src={imageUrl} alt={alt} fill={fill} className={className} sizes={sizes} />;
}
