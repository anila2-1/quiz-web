// src/app/api/quiz-attempts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { quizId, answers } = await req.json()
    const memberId = (await cookies()).get('member_id')?.value

    if (!memberId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!quizId || typeof quizId !== 'string') {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 })
    }
    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const quiz = await payload.findByID({
      collection: 'quizzes',
      id: quizId,
      overrideAccess: true,
      depth: 2,
    })

    if (!quiz || !quiz.questions) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    if (answers.length !== quiz.questions.length) {
      return NextResponse.json({ error: 'Answers length mismatch' }, { status: 400 })
    }

    const pointsEarned = 10

    const member = await payload.findByID({
      collection: 'members',
      id: memberId,
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Update member in a single operation
    const updatedMember = await payload.update({
      collection: 'members',
      id: memberId,
      data: {
        wallet: (member.wallet || 0) + pointsEarned,
        totalPoints: (member.totalPoints || 0) + pointsEarned,
        completedBlogs: [
          ...(member.completedBlogs || []),
          {
            blog: null,
            score: pointsEarned,
            completedAt: new Date().toISOString(),
          },
        ],
        completedQuizIds: [
          ...(member.completedQuizIds || []).filter((item) => item.quizId !== quizId),
          { quizId },
        ],
      },
    })

    const updatedTotalPoints = (member.totalPoints || 0) + pointsEarned

    return NextResponse.json({
      result: {
        score: pointsEarned,
        totalPoints: updatedTotalPoints,
        pointsEarned,
        member: updatedMember, // 👈 send back updated member
      },
    })
  } catch (error: any) {
    console.error('Quiz attempt error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
