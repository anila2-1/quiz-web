// src/app/(frontend)/auth/signup/page.tsx
'use client'

import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation' // ✅ Add useSearchParams
import Link from 'next/link'
import LoadingButton from '../../components/LoadingButton'

export default function SignupPage() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false)
  const [referredBy, setReferredBy] = useState<string>('') // ✅ Add state
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams() // ✅ Get URL params
  const [isLoading, setIsLoading] = useState(false)

  // ✅ Extract 'ref' from URL on load
  useEffect(() => {
    const refCode = searchParams.get('ref')
    if (refCode) {
      setReferredBy(refCode)
    }
  }, [searchParams])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // ✅ Include referredBy in API call
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, username, password, referredBy }), // ✅ Add referredBy
      headers: { 'Content-Type': 'application/json' },
    })
    setIsLoading(false)

    if (res.ok) {
      router.push('/dashboard')
    } else {
      const json = await res.json()
      setError(json.error || 'Signup failed')
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden px-4">
      {/* Soft Background Blobs */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-l from-pink-100 to-indigo-100 rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 m-10 bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 transition-all duration-300 hover:shadow-2xl"
      >
        <h1 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Join QuizEarn today and start earning
        </p>

        {error && (
          <div className="mb-6 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm animate-fadeIn">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 20c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Full Name */}
        <div className="relative mb-5 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-500 transition-all duration-300 
                       focus:border-indigo-500 focus:bg-white focus:shadow-md focus:shadow-indigo-100"
          />
        </div>

        {/* Email */}
        <div className="relative mb-5 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-500 transition-all duration-300 
                       focus:border-indigo-500 focus:bg-white focus:shadow-md focus:shadow-indigo-100"
          />
        </div>

        {/* Username */}
        <div className="relative mb-5 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"></path>
              <path d="M12 13a8 8 0 0 1 8 8v2H4v-2a8 8 0 0 1 8-8z"></path>
            </svg>
          </div>
          <input
            type="text"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-500 transition-all duration-300 
                       focus:border-indigo-500 focus:bg-white focus:shadow-md focus:shadow-indigo-100"
          />
        </div>

        {/* Password */}
        <div className="relative mb-5 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-500 transition-all duration-300 
               focus:border-indigo-500 focus:bg-white focus:shadow-md focus:shadow-indigo-100"
          />

          {/* ✅ Show/Hide Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 transition"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {/* ✅ Referred By Field (Optional: make it read-only) */}
        {referredBy && (
          <div className="relative mb-6 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                <path d="M17 17H7" />
                <path d="M17 13H7" />
                <path d="M17 9H7" />
              </svg>
            </div>
            <input
              type="text"
              value={referredBy}
              readOnly
              className="w-full pl-12 pr-5 py-3 bg-gray-100 border border-gray-300 rounded-xl outline-none text-gray-800 cursor-not-allowed"
              placeholder="Referred by"
            />
          </div>
        )}
        {/* Submit Button */}
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
        >
          <span className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform group-hover:animate-shine"></span>
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
            <span>Sign Up</span>
          </span>
        </LoadingButton>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            Log in
          </Link>
        </p>
      </form>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
