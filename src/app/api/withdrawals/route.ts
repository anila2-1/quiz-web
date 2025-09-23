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

    // ✅ Now check BOTH wallet AND usdtBalance
    const totalUsdtAvailable = (member.usdtBalance || 0) + (member.wallet || 0) * 0.001 // convert points to USDT
    const minWithdrawalUsdt = 0.5 // 500 points = $0.5 USDT

    if (amount < minWithdrawalUsdt) {
      return NextResponse.json(
        { error: `Minimum withdrawal is $${minWithdrawalUsdt} USDT` },
        { status: 400 },
      )
    }

    if (amount > totalUsdtAvailable) {
      return NextResponse.json(
        { error: `Insufficient balance. Available: $${totalUsdtAvailable.toFixed(4)} USDT` },
        { status: 400 },
      )
    }

    // ✅ Create withdrawal request
    const withdrawal = await payload.create({
      collection: 'withdrawals',
      data: {
        user: memberId,
        amount: amount, // in USDT
        paymentInfo,
        status: 'pending',
      },
    })

    return NextResponse.json({ success: true, id: withdrawal.id })
  } catch (error) {
    console.error('Withdrawal error:', error)
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 })
  }
}
