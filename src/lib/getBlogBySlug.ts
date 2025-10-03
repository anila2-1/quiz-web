// src/lib/getBlogBySlug.ts
import { cache } from 'react'

export type Blog = {
  category: any
  id: string
  title: string
  slug: string
  excerpt?: string
  content: any[]
  image?: {
    url: string
    filename: string
    width: number
    height: number
  }
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
  seo?: {
    title?: string
    description?: string
    image?: {
      url: string
      filename: string
    }
  }
  quizzes?: any[]
}

export const getBlogBySlug = cache(async (slug: string): Promise<Blog | null> => {
  try {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const res = await fetch(
      `${API_URL}/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&depth=2`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { tags: ['blog', `blog-${slug}`], revalidate: 60 },
      },
    )

    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText)
      return null
    }

    const json = await res.json()
    return json.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching blog by slug:', error)
    return null
  }
})
