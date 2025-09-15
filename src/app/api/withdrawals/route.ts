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
    if (amount < 500)
      return NextResponse.json({ error: 'Minimum 500 points required' }, { status: 400 })
    if (amount > (member.wallet ?? 0))
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })

    // ✅ Create withdrawal — WALLET IS NOT TOUCHED
    const withdrawal = await payload.create({
      collection: 'withdrawals',
      data: {
        user: memberId,
        amount,
        paymentInfo,
        status: 'pending', // ⚠️ Points are NOT deducted yet
      },
    })

    // ❌ DELETE THIS ENTIRE BLOCK — This is the BUG
    // await payload.update({
    //   collection: 'members',
    //   id: memberId,
    //    {
    //     wallet: (member.wallet ?? 0) - amount,
    //   },
    // })

    return NextResponse.json({ success: true, id: withdrawal.id })
  } catch (error) {
    console.error('Withdrawal error:', error)
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 })
  }
}
