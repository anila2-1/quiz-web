// src/app/(frontend)/auth/signup/page.tsx
import { Suspense } from 'react'
import SignupForm from './SignupForm'

export default function SignupPage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden px-4">
      {/* Soft Background Blobs */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-l from-pink-100 to-indigo-100 rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <Suspense fallback={<div>Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  )
}
