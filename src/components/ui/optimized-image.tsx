import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  fallbackSrc?: string
}

export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.webp',
  className,
  quality = 75, // Default quality optimization
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className={cn('overflow-hidden', className)}>
      <Image
        src={error ? fallbackSrc : src}
        alt={alt}
        className={cn(
          'duration-700 ease-in-out',
          isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
        )}
        quality={quality}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  )
}
