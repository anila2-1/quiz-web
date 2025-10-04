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
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    const completedQuizzes = member.completedQuizIds || []

    // Fetch quiz titles in parallel
    const quizAttempts = await Promise.all(
      completedQuizzes.map(async (attempt: any) => {
        try {
          const quiz = await payload.findByID({
            collection: 'quizzes',
            id: attempt.quizId,
            depth: 1,
          })
          return {
            title: quiz?.title || 'Untitled Quiz',
            date: attempt.completedAt,
            score: attempt.score,
            points: attempt.score,
          }
        } catch {
          return {
            title: 'Deleted Quiz',
            date: attempt.completedAt,
            score: attempt.score,
            points: attempt.score,
          }
        }
      })
    )

    // Sort by newest first
    const sortedAttempts = quizAttempts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const totalQuizPoints = sortedAttempts.reduce((sum, item) => sum + item.points, 0)
    const quizCount = sortedAttempts.length

    return NextResponse.json({
      totalQuizPoints,
      quizCount,
      latestQuiz: sortedAttempts[0] || null,
    })
  } catch (error: any) {
    console.error('Failed to fetch quiz stats:', error)
    return NextResponse.json({ error: 'Failed to load quiz stats' }, { status: 500 })
  }
}
