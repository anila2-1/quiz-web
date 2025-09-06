"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default async function ReferralPage({ params }: { params: Promise<{ code: string }>}) {
    const { code } = await params; // ← Await the promise
  const router = useRouter();

  useEffect(() => {
    router.push(`/auth/signup?ref=${code}`);
  }, [code, router]);

  return <p>Redirecting...</p>;
}