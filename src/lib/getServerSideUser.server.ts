// src/lib/getServerSideMember.server.ts
import { cookies } from 'next/headers';
import { getPayload } from 'payload'; // ✅ getPayload (not HMR)
import config from '@payload-config';

export const getServerSideMember = async () => {
  const cookieStore = cookies();
  const memberId = (await cookieStore).get('member_id')?.value;

  if (!memberId) return null;

  try {
    const payload = await getPayload({ config });

    const member = await payload.findByID({
      collection: 'members',
      id: memberId,
    });

    return member || null;
  } catch (err) {
    console.error('Failed to fetch member:', err);
    return null;
  }
};