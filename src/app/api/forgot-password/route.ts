// src/app/api/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find user by email
    const { docs: members } = await payload.find({
      collection: 'members',
      where: {
        email: { equals: email },
      },
    })

    if (members.length === 0) {
      // Don't reveal if email exists — for security
      return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' })
    }

    const member = members[0]

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = Date.now() + 3600000 // 1 hour

    // Save token to DB
    await payload.update({
      collection: 'members',
      id: member.id,
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    })

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${resetToken}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h3>Reset Your Password</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="color: blue; text-decoration: underline;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    })

    return NextResponse.json({
      message: 'If an account exists, a reset link has been sent.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
