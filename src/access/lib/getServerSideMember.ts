
 // src/lib/getServerSideMember.ts
import { cookies } from 'next/headers';
import { getPayloadHMR } from '@payloadcms/next/utilities';
import config from '@payload-config';

export const getServerSideMember = async () => {
  const cookieStore = cookies();
  const memberId = (await cookieStore).get('member_id')?.value;

  if (!memberId) return null;

  try {
    const payload = await getPayloadHMR({ config });
    const member = await payload.findByID({
      collection: 'members',
      id: memberId,
    });

    return member;
  } catch (err) {
    console.error('Member fetch failed:', err);
    return null;
  }
};