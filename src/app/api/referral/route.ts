// src/app/api/referral/route.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function GET() {
  const payload = await getPayload({ config })

  const memberId = (await cookies()).get('member_id')?.value

  if (!memberId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let member
  try {
    member = await payload.findByID({
      collection: 'members',
      id: memberId,
    })
  } catch (error) {
    console.error('Failed to fetch member:', error)
    return new Response(JSON.stringify({ error: 'Member not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!member) {
    return new Response(JSON.stringify({ error: 'Member not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const referredMembers = await payload.find({
    collection: 'members',
    where: {
      referredBy: {
        equals: member.id,
      },
    },
    sort: '-createdAt',
    limit: 100,
  })

  const totalPointsEarned = member.totalPoints || 0
  const referralsCount = referredMembers.docs.length
  const referralCode = member.referralCode || 'N/A'
  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://quiz-learn-web.vercel.app'}/referral/${referralCode}`

  return new Response(
    JSON.stringify({
      referralsCount,
      referralEarnings: referralsCount * 100,
      referralCode,
      referralLink,
      referredMembers: referredMembers.docs,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  )
}
