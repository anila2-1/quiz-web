// src/utilities/generateStaticMetadata.ts
import type { Metadata } from 'next'

export function generateStaticMetadata({
  title,
  description,
  url = '/',
  image,
}: {
  title: string
  description: string
  url?: string
  image?: string
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const fullUrl = new URL(url, siteUrl).href
  const ogImage = image || `${siteUrl}/website-template-OG.webp`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}
