// src/app/api/profile/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { getServerSideMember } from '@/access/lib/getServerSideMember';

export async function PUT(req: NextRequest) {
  try {
    const currentUser = await getServerSideMember();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, username, walletAddress } = await req.json();

    if (!name || !username) {
      return NextResponse.json(
        { error: 'Name and username are required' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // Check if username is already taken by another user
    const existing = await payload.find({
      collection: 'members',
      where: {
        and: [
          { username: { equals: username } },
          { id: { not_equals: currentUser.id } },
        ],
      },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Update the user
    const updatedMember = await payload.update({
      collection: 'members',
      id: currentUser.id,
      data: {
        name: name.trim(),
        username: username.trim(),
        walletAddress: walletAddress?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}