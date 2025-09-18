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
  quizzes?: Quiz[]
}

type Quiz = {
  id: string
  title: string
  questions: Question[]
}

type Question = {
  id: string
  questionText: string
  options: { label: string; value: string }[]
  correctAnswer: string
}

// 🔁 Exported and cached
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
        // 🔁 Revalidate every 60 seconds
        next: { tags: ['blog', `blog-${slug}`], revalidate: 60 },
      },
    )

    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText)
      return null
    }

    const json = await res.json()

    if (!json.docs || json.docs.length === 0) {
      return null
    }

    return json.docs[0]
  } catch (error) {
    console.error('Error fetching blog by slug:', error)
    return null
  }
})
