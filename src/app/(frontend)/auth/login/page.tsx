// src/app/(frontend)/auth/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const memberId = document.cookie
      .split('; ')
      .find(row => row.startsWith('member_id='));
    if (memberId) router.push('/dashboard');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const json = await res.json();
      setError(json.error || 'Login failed');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden px-4">
      {/* Soft Background Blobs - FULL SCREEN */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-l from-pink-100 to-indigo-100 rounded-full opacity-50 blur-3xl translate-x-1/3 translate-y-1/3"></div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 transition-all duration-300 hover:shadow-2xl"
      >
        <h1 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">Sign in to continue to QuizEarn</p>

        {error && (
          <div className="mb-6 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm animate-fadeIn">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 20c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Email */}
        <div className="relative mb-5 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

        {/* Password */}
        <div className="relative mb-6 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-500 transition-all duration-300 
                       focus:border-indigo-500 focus:bg-white focus:shadow-md focus:shadow-indigo-100"
          />
        </div>

       {/* Submit Button */}
        <button
          type="submit"
          className="group w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] 
                     transition-all duration-300 overflow-hidden relative"
        >
          {/* Shine Effect */}
          <span className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform group-hover:animate-shine"></span>
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Log In</span>
          </span>
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-700 transition">
            Sign up
          </a>
        </p>
      </form>

      {/* Animations */}
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
  );
}
