// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const payload = await getPayloadHMR({ config })

    const authResult = await payload.login({
      collection: 'members',
      data: { email, password },
    })

    if (!authResult?.user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // ✅ Block login if email not verified
    if (!authResult.user.emailVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in.' },
        { status: 403 },
      )
    }

    const cookieStore = await cookies()
    cookieStore.set('member_id', authResult.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: authResult.user.id,
        name: authResult.user.name,
        email: authResult.user.email,
        username: authResult.user.username,
        wallet: authResult.user.wallet ?? 0,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
