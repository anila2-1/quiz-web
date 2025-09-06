// src/app/api/withdrawals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function POST(req: NextRequest) {
  try {
    const { amount, paymentInfo } = await req.json();
    const memberId = req.cookies.get('member_id')?.value;

    if (!memberId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await getPayload({ config });
    const member = await payload.findByID({ collection: 'members', id: memberId });

    if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    if (amount < 500) return NextResponse.json({ error: 'Minimum 500 points required' }, { status: 400 });
    if (amount > (member.wallet ?? 0)) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });

    const withdrawal = await payload.create({
      collection: 'withdrawals',
      data: { // ✅ Fixed: was `{`
        user: memberId,
        amount,
        paymentInfo,
        status: 'pending',
      },
    });

    return NextResponse.json({ success: true, id: withdrawal.id });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 });
  }
}