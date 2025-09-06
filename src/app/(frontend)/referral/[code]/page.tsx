// src/app/(frontend)/referral/[code]/page.tsx
import { redirect } from 'next/navigation';

export default async function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  redirect(`/auth/signup?ref=${code}`);
}