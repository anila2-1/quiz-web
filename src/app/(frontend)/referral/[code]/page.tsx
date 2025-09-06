// src/app/(frontend)/referral/[code]/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ReferralPage({ params }: { params: { code: string } }) {
  const { code } = params; // No await needed — because it's not a Promise anymore
  const router = useRouter();

  useEffect(() => {
    router.push(`/auth/signup?ref=${code}`);
  }, [code, router]);

  return <p>Redirecting...</p>;
}