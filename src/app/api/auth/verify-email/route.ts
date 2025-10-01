// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      return NextResponse.redirect(new URL('/auth/login?error=Invalid verification link', req.url))
    }

    const payload = await getPayloadHMR({ config })

    const user = await payload.find({
      collection: 'members',
      where: {
        email: { equals: email },
        verificationToken: { equals: token },
        verificationTokenExpiry: { greater_than: new Date().toISOString() },
      },
    })

    if (user.docs.length === 0) {
      return NextResponse.redirect(new URL('/auth/login?error=Invalid or expired token', req.url))
    }

    const verifiedUser = await payload.update({
      collection: 'members',
      id: user.docs[0].id,
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    })

    // Set cookie after verification
    const cookieStore = await cookies()
    cookieStore.set('member_id', verifiedUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return NextResponse.redirect(new URL('/dashboard', req.url))
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/auth/login?error=Verification failed', req.url))
  }
}
