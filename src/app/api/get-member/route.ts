// src/app/api/get-member/route.ts
import { getServerSideMember } from '@/access/lib/getServerSideMember';

export async function GET() {
  const member = await getServerSideMember();
  return Response.json({ member: member || null });
}