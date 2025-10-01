// src/app/(frontend)/auth/verify-required/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function VerifyRequired() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmail(localStorage.getItem('pendingEmail'))
    }
  }, [])

  const handleResend = async () => {
    if (!email) {
      alert('Email not found. Please sign up again.')
      return
    }

    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    alert(data.message || 'Verification email sent!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🔒 Email Verification Required</h1>
        <p className="text-gray-600 mb-6">
          Please check your inbox and click the verification link to activate your account.
        </p>

        <button
          onClick={handleResend}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mb-4"
        >
          Resend Verification Email
        </button>

        <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 text-sm">
          ← Back to Login
        </Link>
      </div>
    </div>
  )
}
