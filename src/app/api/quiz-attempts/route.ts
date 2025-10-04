// src/app/api/quiz-attempts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { quizId, answers, blogId } = await req.json()
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

    const pointsEarned = quiz.points || 10
    const totalQuestions = quiz.questions.length

    const member = await payload.findByID({
      collection: 'members',
      id: memberId,
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // ✅ Check if already completed
    const alreadyCompleted = (member.completedQuizIds || []).some(
      (item: any) => item.quizId === quizId
    )

    if (alreadyCompleted) {
      return NextResponse.json({ error: 'You have already completed this quiz' }, { status: 400 })
    }

    // ✅ Update only wallet and completedQuizIds
    const updatedMember = await payload.update({
      collection: 'members',
      id: memberId,
      data: {
        wallet: (member.wallet || 0) + pointsEarned,
        completedQuizIds: [
          ...(member.completedQuizIds || []),
          { quizId, score: pointsEarned, completedAt: new Date().toISOString() },
        ],
      },
    })

    return NextResponse.json({
      result: {
        score: totalQuestions,
        total: totalQuestions,
        pointsEarned,
        member: updatedMember,
      },
    })
  } catch (error: any) {
    console.error('Quiz attempt error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
