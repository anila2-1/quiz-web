// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload'; // ✅ Use getPayload instead of getPayloadHMR
import config from '@payload-config';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const { name, email, username, password, referredBy } = await req.json();

  if (!name || !email || !username || !password) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    );
  }

  const payload = await getPayload({ config });

  // Check if email or username already exists
  const existing = await payload.find({
    collection: 'members',
    where: {
      or: [
        { email: { equals: email } },
        { username: { equals: username } },
      ],
    },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    return NextResponse.json(
      { error: 'Email or username already taken' },
      { status: 409 }
    );
  }

  // Check if referredBy code exists
  const referrer = await payload.find({
    collection: 'members',
    where: { referralCode: { equals: referredBy } },
    limit: 1,
  });

  let referrerMember = null;
  if (referredBy && referrer.docs.length > 0) {
    referrerMember = referrer.docs[0];
  }

  // Create new member with password
  const member = await payload.create({
    collection: 'members',
   data:  {
      name,
      email,
      username,
      password,
      wallet: 0,
      totalPoints: 0,
      referredBy: referrerMember?.id || null, // ✅ Pass ID, not code
      referralCode: `REF${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      referralsCount: 0,
      completedBlogs: [],
    },
  });

  // ✅ Add 100 points to referrer
  if (referrerMember) {
    await payload.update({
      collection: 'members',
      id: referrerMember.id,
       data:{
        wallet: (referrerMember.wallet || 0) + 100,
        totalPoints: (referrerMember.totalPoints || 0) + 100,
        referralsCount: (referrerMember.referralsCount || 0) + 1,
      },
    });
  }

  // Set session cookie
  (await cookies()).set('member_id', member.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return NextResponse.json({ 
    success: true, 
    user: { id: member.id, name, email, username } 
  });
}