// src/app/api/quiz-stats/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const memberId = req.cookies.get('member_id')?.value

    if (!memberId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    const member = await payload.findByID({
      collection: 'members',
      id: memberId,
      depth: 2, // Populate blog if needed
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // ✅ Extract real quiz attempts from completedBlogs
    const quizAttempts = (member.completedBlogs || [])
      .filter((item: any) => item.score !== undefined)
      .map((item: any) => ({
        title: item.blog?.title || 'Untitled Quiz',
        date: item.completedAt || new Date().toISOString(),
        score: item.score,
        points: item.score, // assuming score = points earned
      }))

    const totalQuizPoints = quizAttempts.reduce((sum, item) => sum + item.points, 0)
    const quizCount = quizAttempts.length

    return NextResponse.json({
      totalQuizPoints,
      quizCount,
      latestQuiz: quizAttempts[0] || null, // most recent
    })
  } catch (error) {
    console.error('Failed to fetch quiz stats:', error)
    return NextResponse.json({ error: 'Failed to load quiz stats' }, { status: 500 })
  }
}
