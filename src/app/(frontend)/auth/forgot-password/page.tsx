// src/app/auth/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) throw new Error('Failed to send reset email')

      setMessage('If an account exists, a reset link has been sent to your email.')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden px-4">
      {/* Soft Background Blobs */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-l from-pink-100 to-indigo-100 rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 transition-all duration-300 hover:shadow-2xl"
      >
        <h1 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Forgot Password?
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm animate-fadeIn">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {message}
          </div>
        )}

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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-500 transition-all duration-300 
                       focus:border-indigo-500 focus:bg-white focus:shadow-md focus:shadow-indigo-100"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={loading ? {} : { scale: 1.02 }}
          whileTap={loading ? {} : { scale: 0.98 }}
          className={`group w-full py-3 px-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative
            ${loading ? 'cursor-not-allowed opacity-90' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'}`}
        >
          {!loading && (
            <span className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform group-hover:animate-shine"></span>
          )}
          <span className="relative z-10 flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <svg
                  className="animate-spin w-5 h-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
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
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
                <span>Send Reset Link</span>
              </>
            )}
          </span>
        </motion.button>

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
            ← Back to Login
          </Link>
        </div>
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
