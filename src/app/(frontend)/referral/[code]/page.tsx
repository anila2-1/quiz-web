import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ReferralPage({ params }: { params: { code: string } }) {
  const router = useRouter()

  useEffect(() => {
    router.push(`/auth/signup?ref=${params.code}`)
  }, [params.code, router])

  return <p>Redirecting...</p>
}