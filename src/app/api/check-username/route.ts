// src/app/api/check-username/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json()

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ available: false }, { status: 400 })
    }

    const payload = await getPayloadHMR({ config })

    const existing = await payload.find({
      collection: 'members',
      where: {
        username: { equals: username.trim().toLowerCase() },
      },
    })

    return NextResponse.json({
      available: existing.docs.length === 0,
    })
  } catch (error) {
    console.error('Username check error:', error)
    return NextResponse.json({ available: false }, { status: 500 })
  }
}
