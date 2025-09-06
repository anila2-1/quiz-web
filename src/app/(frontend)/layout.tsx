// src/app/(frontend)/layout.tsx

import { AuthProvider } from '../../_providers/Auth'
import { ReactNode } from 'react'
import Navbar from '@/app/(frontend)/components/Navbar';


import './globals.css'

// Fetch site settings from Payload CMS
async function getSiteSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/globals/site-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['site-settings'], revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!res.ok) {
      console.error('Failed to fetch site settings:', res.status, res.statusText)
      return null
    }

    const json = await res.json()
    return json
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const siteSettings = await getSiteSettings()

  // Fallback values
  const title = siteSettings?.siteTitle || 'Learn & Earn Quiz Platform'
  const description = siteSettings?.tagline || 'Learn, Quiz, Earn Points, Withdraw USDT'

  // Favicon URL (if exists)
  const faviconURL = siteSettings?.favicon
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${siteSettings.favicon.filename}`
    : '/favicon.ico' // Fallback favicon

  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon */}
        <link rel="icon" href={faviconURL} />

        {/* Optional: Apple Touch Icon */}
        <link rel="apple-touch-icon" href={faviconURL} />

        {/* Open Graph / Social Sharing Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SERVER_URL} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
            <main className="flex-1">{children}</main>
           
            </AuthProvider>

            
      </body>
    </html>
  )
}