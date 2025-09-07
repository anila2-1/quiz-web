// src/app/sitemap.xml/route.ts
import { NextRequest, NextResponse } from 'next/server';

// List of static routes
const staticRoutes = ['', 'blog', 'about', 'contact', 'dashboard', 'withdraw'].map(
  (route) => `<url>
    <loc>${process.env.NEXT_PUBLIC_SERVER_URL}/${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
);

// Fetch dynamic blog posts
async function getBlogRoutes(): Promise<string> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs?where[status][equals]=published&limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) return '';

    const json = await res.json();
    const blogs = json.docs || [];

    return blogs
      .map(
        (blog: any) => `<url>
          <loc>${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${blog.slug}</loc>
          <lastmod>${new Date(blog.updatedAt).toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>`
      )
      .join('');
  } catch (error) {
    console.error('Failed to fetch blog posts for sitemap:', error);
    return '';
  }
}

export async function GET(request: NextRequest) {
  try {
    const blogRoutes = await getBlogRoutes();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticRoutes.join('')}
        ${blogRoutes}
      </urlset>`.replace(/>\s*</g, '><'); // Clean up whitespace

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('<error>Failed to generate sitemap</error>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}