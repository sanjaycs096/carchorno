'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  imageHint?: string;
  className?: string;
}

export function SafeImage({ src, alt, imageHint, className }: SafeImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const safeSrc = src ? src.trim() : '';
  const placeholderUrl = `https://picsum.photos/seed/${alt.replace(/\s+/g, '')}/600/400`;

  useEffect(() => {
    setError(false);
    setIsLoading(true);
  }, [safeSrc]);

  if (error || !safeSrc) {
    return (
      <Image
        src={placeholderUrl}
        alt={`Placeholder for ${alt}`}
        fill
        className={`object-cover ${className || ''}`}
        data-ai-hint={imageHint}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <>
      {isLoading && <Skeleton className="w-full h-full" />}
      <Image
        src={safeSrc}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className || ''}`}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        onLoad={() => {
          setIsLoading(false);
        }}
        data-ai-hint={imageHint}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </>
  );
}
