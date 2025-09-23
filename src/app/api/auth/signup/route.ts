// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import crypto from 'crypto'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { name, email, username, password, referredBy } = await req.json() // ✅ Add referredBy

    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const payload = await getPayloadHMR({ config })

    // Check if email or username already exists
    const existing = await payload.find({
      collection: 'members',
      where: {
        or: [{ email: { equals: email } }, { username: { equals: username } }],
      },
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ error: 'Email or username already exists' }, { status: 409 })
    }

    // ✅ Generate referral code for new user
    const newReferralCode = 'REF' + crypto.randomBytes(4).toString('hex').toUpperCase()

    // ✅ If referredBy is provided, find referrer first
    let referrerUser = null
    if (referredBy) {
      const referrer = await payload.find({
        collection: 'members',
        where: {
          referralCode: { equals: referredBy },
        },
      })

      if (referrer.docs.length > 0) {
        referrerUser = referrer.docs[0]
      }
    }

    // ✅ Create new user
    const newUser = await payload.create({
      collection: 'members',
      data: {
        name,
        email,
        username,
        password,
        wallet: 0,
        referralCode: newReferralCode,
        referralsCount: 0,
        referredBy: referrerUser ? referrerUser.id : undefined,
      },
    })

    // ✅ If referrer found, update referrer
    if (referrerUser) {
      const pointsPerReferral = 100 // ✅ 100 points per referral

      // ✅ Update referrer's wallet and referralsCount
      await payload.update({
        collection: 'members',
        id: referrerUser.id,
        data: {
          wallet: (referrerUser.wallet || 0) + pointsPerReferral,
          referralsCount: (referrerUser.referralsCount || 0) + 1,
        },
      })
    }

    // ✅ Set cookie
    const cookieStore = await cookies()
    cookieStore.set('member_id', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        wallet: newUser.wallet || 0,
        referralCode: newUser.referralCode,
        referralsCount: newUser.referralsCount || 0,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
