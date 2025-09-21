import React from 'react'
import { cn } from '@/utilities/ui'
import { ImageUpload } from './ImageUpload'
import Image from 'next/image'

interface MediaProps {
  className?: string
  imgClassName?: string
  resource?: {
    url?: string
    alt?: string
    width?: number
    height?: number
  }
  src?: string
  onUpload?: (file: File) => void
  showUpload?: boolean
  aspectRatio?: string
}

export const Media: React.FC<MediaProps> = ({
  className,
  imgClassName,
  resource,
  src,
  onUpload,
  showUpload = false,
  aspectRatio = '16/9',
}) => {
  const mediaSrc = src || resource?.url

  if (!mediaSrc && !showUpload) return null

  return (
    <div
      className={cn(
        'relative w-full max-w-5xl mx-auto rounded-lg overflow-hidden',
        'flex items-center justify-center',
        className,
      )}
    >
      {mediaSrc ? (
        <div className="w-full">
          <div className="aspect-[16/9] relative bg-gray-100">
            <Image
              src={mediaSrc}
              alt={resource?.alt || ''}
              width={800} // Example: 800px wide
              height={600} // Example: 600px tall
              unoptimized
              className={cn(
                'w-full h-full object-contain',
                'transition-all duration-300 hover:scale-[1.02]',
                imgClassName,
              )}
              loading="lazy"
            />
          </div>
        </div>
      ) : showUpload && onUpload ? (
        <ImageUpload onUpload={onUpload} className="w-full" aspectRatio={aspectRatio} />
      ) : null}
    </div>
  )
}
