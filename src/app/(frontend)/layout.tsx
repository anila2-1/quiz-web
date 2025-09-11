// src/app/(frontend)/layout.tsx

import { AuthProvider } from '../../_providers/Auth';
import React, { ReactNode } from 'react';
import Navbar from '@/app/(frontend)/components/Navbar';

import './globals.css';

// Fetch site settings from Payload CMS
async function getSiteSettings() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
    const res = await fetch(`${API_URL}/api/globals/site-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['site-settings'], revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error('Failed to fetch site settings:', res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const siteSettings = await getSiteSettings();

  // ✅ Fallback values for safety
  const siteTitle = siteSettings?.siteTitle || 'Learn & Earn Quiz Platform';
  const tagline = siteSettings?.tagline || 'Learn, Quiz, Earn Points, Withdraw USDT';
  // const logo = siteSettings?.logo;
  const favicon = siteSettings?.favicon;

  // ✅ SEO: Use SEO group first, fallback to global fields
  const seoTitle = siteSettings?.seo?.title || siteTitle;
  const seoDescription = siteSettings?.seo?.description || tagline;
  const seoImage = siteSettings?.seo?.image
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${siteSettings.seo.image.filename}`
    : null;

  // ✅ Favicon URL
  const faviconURL = favicon
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${favicon.filename}`
    : '/favicon.ico';

  return (
    <html lang="en">
      <head>
        {/* Basic Meta */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={faviconURL} />
        <link rel="apple-touch-icon" href={faviconURL} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SERVER_URL} />
        {seoImage && <meta property="og:image" content={seoImage} />}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {seoImage && <meta name="twitter:image" content={seoImage} />}

        {/* Canonical URL */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SERVER_URL} />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}