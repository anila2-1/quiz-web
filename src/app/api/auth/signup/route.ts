// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { name, email, username, password, referredBy } = await req.json()

    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const payload = await getPayloadHMR({ config })

    // Check existing user
    const existing = await payload.find({
      collection: 'members',
      where: {
        or: [{ email: { equals: email } }, { username: { equals: username.trim().toLowerCase() } }],
      },
    })

    if (existing.docs.length > 0) {
      return NextResponse.json({ error: 'Email or username already exists' }, { status: 409 })
    }

    // Generate tokens
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
    const newReferralCode = 'REF' + crypto.randomBytes(4).toString('hex').toUpperCase()

    // Find referrer
    let referrerUser = null
    if (referredBy) {
      const referrer = await payload.find({
        collection: 'members',
        where: { referralCode: { equals: referredBy } },
      })
      if (referrer.docs.length > 0) {
        referrerUser = referrer.docs[0]
      }
    }

    // Create new user (unverified)
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
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry: verificationTokenExpiry.toISOString(),
      },
    })

    // ✅ Update referrer if exists
    if (referrerUser) {
      await payload.update({
        collection: 'members',
        id: referrerUser.id,
        data: {
          wallet: (referrerUser.wallet || 0) + 100,
          referralsCount: (referrerUser.referralsCount || 0) + 1,
        },
      })
    }

    // Send verification email
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`

    await transporter.sendMail({
      from: `"QuizEarn" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Verify Your Email – QuizEarn',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc;">
          <h2 style="color: #4f46e5; text-align: center;">Welcome to QuizEarn, ${name}!</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">
            Please verify your email to activate your account and start earning.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Verify My Email
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b;">
            This link expires in 24 hours.<br/>
            If you didn’t sign up, please ignore this email.
          </p>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Verification email sent. Please check your inbox.',
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification email. Please try again.' },
      { status: 500 },
    )
  }
}
