// src/app/api/get-all-blogs-with-quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '../../../payload.config'

export async function POST(req: NextRequest) {
  try {
    const { searchTerm = '', categorySlug = null, page = 1, limit = 25 } = await req.json()

    const payload = await getPayload({ config: payloadConfig })

    // Build query - only published blogs with quizzes
    const where: any = {
      and: [
        { status: { equals: 'published' } },
        { quizzes: { exists: true } }, // Only blogs that have quizzes
      ],
    }

    // Category filter
    if (categorySlug) {
      const cat = await payload.find({
        collection: 'categories',
        where: { slug: { equals: categorySlug } },
        limit: 1,
        overrideAccess: true,
      })
      if (cat.docs[0]) {
        where.and.push({ category: { equals: cat.docs[0].id } })
      }
    }

    // Search
    if (searchTerm) {
      where.and.push({
        or: [{ title: { contains: searchTerm } }, { excerpt: { contains: searchTerm } }],
      })
    }

    // Fetch ALL published blogs with quizzes
    const allBlogs = await payload.find({
      collection: 'blogs',
      where,
      depth: 2,
      limit: 1000,
      overrideAccess: true,
      sort: '-createdAt',
    })

    // Apply pagination
    const total = allBlogs.docs.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedBlogs = allBlogs.docs.slice(startIndex, startIndex + limit)

    // Format response
    const articles = paginatedBlogs.map((blog: any) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      readTime: blog.readTime || 5,
      totalQuizzes: blog.quizzes?.length || 0,
      category: blog.category
        ? {
            id: blog.category.id,
            title: blog.category.title,
            slug: blog.category.slug,
          }
        : null,
    }))

    return NextResponse.json({
      articles,
      total,
      totalPages,
      currentPage: page,
    })
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs with quizzes' }, { status: 500 })
  }
}
