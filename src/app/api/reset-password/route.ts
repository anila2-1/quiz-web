// src/app/api/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Find user by reset token
    const { docs: members } = await payload.find({
      collection: 'members',
      where: {
        resetPasswordToken: { equals: token },
        resetPasswordExpires: { greater_than: Date.now() },
      },
    })

    if (members.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    const member = members[0]

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password and clear reset fields
    await payload.update({
      collection: 'members',
      id: member.id,
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })

    return NextResponse.json({ message: 'Password has been reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
