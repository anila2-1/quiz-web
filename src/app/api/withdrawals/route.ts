// src/app/api/withdrawals/route.ts
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

    const result = await payload.find({
      collection: 'withdrawals',
      where: {
        user: {
          equals: memberId,
        },
      },
      sort: '-createdAt',
    })

    return NextResponse.json({
      withdrawals: result.docs.map((doc: any) => ({
        id: doc.id,
        amount: doc.amount,
        status: doc.status,
        paymentInfo: doc.paymentInfo,
        createdAt: doc.createdAt,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch withdrawals:', error)
    return NextResponse.json({ error: 'Failed to load history' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { amount, paymentInfo } = await req.json()
    const memberId = req.cookies.get('member_id')?.value

    if (!memberId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = await getPayload({ config })
    const member = await payload.findByID({ collection: 'members', id: memberId })

    if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

    // ✅ Check balance
    if ((member.usdtBalance || 0) < amount) {
      return NextResponse.json(
        { error: `Insufficient USDT balance. Available: $${(member.usdtBalance || 0).toFixed(4)}` },
        { status: 400 },
      )
    }

    // ✅ DEDUCT AMOUNT IMMEDIATELY
    await payload.update({
      collection: 'members',
      id: memberId,
      data: {
        usdtBalance: (member.usdtBalance || 0) - amount,
      },
    })

    // ✅ Create withdrawal request with status "pending"
    const withdrawal = await payload.create({
      collection: 'withdrawals',
      data: {
        user: memberId,
        amount,
        paymentInfo,
        status: 'pending', // Default status
      },
    })

    return NextResponse.json({ success: true, id: withdrawal.id })
  } catch (error) {
    console.error('Withdrawal error:', error)
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 })
  }
}
