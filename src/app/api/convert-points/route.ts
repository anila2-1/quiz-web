// src/app/api/convert-points/route.ts
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function POST() {
  const payload = await getPayload({ config })

  const memberId = (await cookies()).get('member_id')?.value

  if (!memberId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Fetch current member
    const member = await payload.findByID({
      collection: 'members',
      id: memberId,
    })

    if (!member) {
      return new Response(JSON.stringify({ error: 'Member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const points = member.wallet || 0
    const usdt = points * 0.001 // 1 point = $0.001 USDT

    if (points <= 0) {
      return new Response(JSON.stringify({ error: 'No points available for conversion' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Update member — deduct points and add to usdtBalance
    await payload.update({
      collection: 'members',
      id: memberId,
      data: {
        wallet: 0,
        usdtBalance: (member.usdtBalance || 0) + usdt,
      },
    })

    return new Response(
      JSON.stringify({
        success: true,
        pointsConverted: points,
        usdtReceived: usdt,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Conversion error:', error)
    return new Response(JSON.stringify({ error: 'Failed to convert points' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
