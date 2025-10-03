// src/app/api/get-incomplete-articles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '../../../payload.config'

export async function POST(req: NextRequest) {
  try {
    const {
      memberId,
      searchTerm = '',
      categorySlug = null,
      page = 1,
      limit = 25,
    } = await req.json()

    console.log('🔍 API Called with memberId:', memberId)

    if (!memberId) {
      return NextResponse.json({ error: 'memberId is required' }, { status: 400 })
    }

    const payload = await getPayload({ config: payloadConfig })

    // Fetch member
    const member = await payload.findByID({
      collection: 'members',
      id: memberId,
      depth: 2,
      overrideAccess: true,
    })

    if (!member) {
      console.log('❌ Member not found:', memberId)
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    console.log('✅ Member found:', member.username)
    console.log('📊 Member completedQuizIds:', member.completedQuizIds)
    console.log('📊 Member completedQuizIds length:', member.completedQuizIds?.length || 0)

    // Get completed quiz IDs
    const completedQuizIds = new Set()

    if (member.completedQuizIds && member.completedQuizIds.length > 0) {
      member.completedQuizIds.forEach((item: any) => {
        if (typeof item.quiz === 'string') {
          completedQuizIds.add(item.quiz)
        } else if (item.quiz && item.quiz.id) {
          completedQuizIds.add(item.quiz.id)
        } else if (item.quizId) {
          // Old structure
          completedQuizIds.add(item.quizId)
        }
      })
    }

    console.log('✅ Completed Quiz IDs Set:', Array.from(completedQuizIds))
    console.log('✅ Total completed quizzes:', completedQuizIds.size)

    // Build base query - sirf published blogs with quizzes
    const where: any = {
      and: [
        { status: { equals: 'published' } },
        { quizzes: { exists: true } }, // ✅ Only blogs that have quizzes
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

    console.log('🔍 Fetching blogs with query:', JSON.stringify(where, null, 2))

    // Fetch ALL published blogs with quizzes
    const allBlogs = await payload.find({
      collection: 'blogs',
      where,
      depth: 2,
      limit: 1000,
      overrideAccess: true,
      sort: '-createdAt',
    })

    console.log('📚 Total blogs found:', allBlogs.docs.length)

    // 🔥 Debug each blog
    allBlogs.docs.forEach((blog: any, index: number) => {
      console.log(`\n📖 Blog ${index + 1}: ${blog.title}`)
      console.log(`   📝 Quizzes count: ${blog.quizzes?.length || 0}`)

      if (blog.quizzes && blog.quizzes.length > 0) {
        blog.quizzes.forEach((quiz: any, quizIndex: number) => {
          const quizId = typeof quiz === 'string' ? quiz : quiz.id
          const isCompleted = completedQuizIds.has(quizId)
          console.log(
            `   ❓ Quiz ${quizIndex + 1}: ${quizId} - ${isCompleted ? 'COMPLETED' : 'INCOMPLETE'}`,
          )
        })

        // Check if any quiz is incomplete
        const hasIncompleteQuiz = blog.quizzes.some((quiz: any) => {
          const quizId = typeof quiz === 'string' ? quiz : quiz.id
          return !completedQuizIds.has(quizId)
        })
        console.log(`   🔍 Has incomplete quiz: ${hasIncompleteQuiz}`)
      } else {
        console.log(`   ⚠️  No quizzes found`)
      }
    })

    // Filter: Keep only blogs where AT LEAST ONE quiz is incomplete
    const incompleteBlogs = allBlogs.docs.filter((blog: any) => {
      // Skip blogs with no quizzes
      if (!blog.quizzes || blog.quizzes.length === 0) {
        return false
      }

      // Check if ANY quiz is incomplete
      const hasIncompleteQuiz = blog.quizzes.some((quiz: any) => {
        const quizId = typeof quiz === 'string' ? quiz : quiz.id
        return !completedQuizIds.has(quizId)
      })

      return hasIncompleteQuiz
    })

    console.log('🎯 Incomplete blogs after filtering:', incompleteBlogs.length)

    // Apply pagination
    const total = incompleteBlogs.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedBlogs = incompleteBlogs.slice(startIndex, startIndex + limit)

    console.log('📄 Paginated blogs:', paginatedBlogs.length)

    // Format response
    const articles = paginatedBlogs.map((blog: any) => {
      const totalQuizzes = blog.quizzes?.length || 0
      const completedQuizzes =
        blog.quizzes?.filter((quiz: any) => {
          const quizId = typeof quiz === 'string' ? quiz : quiz.id
          return completedQuizIds.has(quizId)
        }).length || 0

      return {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt || '',
        readTime: blog.readTime || 5,
        totalQuizzes,
        completedQuizzes,
        category: blog.category
          ? {
              id: blog.category.id,
              title: blog.category.title,
              slug: blog.category.slug,
            }
          : null,
      }
    })

    console.log('✅ Final articles to return:', articles.length)

    return NextResponse.json({
      articles,
      total,
      totalPages,
      currentPage: page,
      debug: {
        memberId,
        completedQuizIds: Array.from(completedQuizIds),
        totalBlogs: allBlogs.docs.length,
        incompleteBlogs: incompleteBlogs.length,
      },
    })
  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch incomplete articles' }, { status: 500 })
  }
}
