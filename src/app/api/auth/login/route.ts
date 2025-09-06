// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const payload = await getPayloadHMR({ config });

    // ✅ Use Payload's built-in login (bcrypt check handled automatically)
    const authResult = await payload.login({
      collection: 'members', // 👈 your auth-enabled collection
      data: { email, password },
    });

    if (!authResult?.user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // ✅ Store session (custom cookie)
    const cookieStore = await cookies();
    cookieStore.set('member_id', authResult.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: authResult.user.id,
        name: authResult.user.name,
        email: authResult.user.email,
        username: authResult.user.username,
        wallet: authResult.user.wallet ?? 0, // ✅ wallet included
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
}
