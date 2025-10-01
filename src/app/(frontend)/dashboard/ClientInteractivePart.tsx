// src/app/(frontend)/dashboard/ClientInteractivePart.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from './../../../components/Sidebar'
import DashboardHeader from './../../../components/DashboardHeader'
import WalletCard from './../../../components/WalletCard'
import ReferralStats from './../../../components/ReferralStats'
import QuizStats from '../../../components/QuizStats'
import { useSidebar } from '../SidebarContext'
import Link from 'next/link'

interface User {
  id: string
  name?: string | null
  email: string
  wallet?: number | null
  usdtBalance?: number | null // ✅ Added USDT balance
  referralCode?: string | null
  referralsCount?: number | null
}

interface ClientInteractivePartProps {
  user: User | null
}

export default function ClientInteractivePart({ user: serverUser }: ClientInteractivePartProps) {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(serverUser)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [serverUser])

  if (isLoading || user === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 sm:p-6 md:ml-64 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
            <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading...</p>
            <p className="text-sm text-gray-500 mt-2 animate-fade-in">
              Almost there — just a moment please 😊
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 sm:p-6 md:ml-64 flex justify-center items-center">
          <div className="max-w-md text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              Please sign in to view your dashboard.
            </div>
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full w-64 bg-white shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 p-4 sm:p-6 md:ml-64">
        <div className="max-w-4xl mx-auto">
          {/* ✨ Stylish Welcome Back Message */}
          <div className="relative mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/60 to-teal-50/60 backdrop-blur-sm rounded-3xl border border-emerald-100 shadow-sm"></div>
            <div className="relative z-10 text-center p-6 sm:p-8 rounded-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {user.name || user.email.split('@')[0]}
                </span>
                !
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                Here’s your account overview and earnings summary.
              </p>
            </div>
          </div>
          <style jsx>{`
            .backdrop-blur-sm {
              background: rgba(236, 253, 245, 0.6);
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
            }
          `}</style>

          {/* ✅ Account Overview - Wallet + USDT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-indigo-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  ₹{(user.wallet || 0).toFixed(2)}
                </div>
                <div className="text-sm font-medium text-gray-600">Wallet Balance (Points)</div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  ${(user.usdtBalance || 0).toFixed(4)}
                </div>
                <div className="text-sm font-medium text-gray-600">USDT Balance</div>
              </div>
            </div>
          </div>

          {/* Components */}
          <div className="space-y-8">
            {/* ✨ Referral Earnings - Stylish */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">💰 Referral Earnings</h2>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="card-icon h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M12 18v-6"
                    />
                  </svg>
                </div>
              </div>
              <ReferralStats count={user.referralsCount || 0} code={user.referralCode || ''} />
            </div>
            {/* 💰 Your Wallet - Stylish */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> 💰 Your Wallet</h2>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="card-icon h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
              <WalletCard />
            </div>

            {/* 🧠 Quiz Earnings - Stylish */}
            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">📝Quiz Earnings</h2>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="card-icon h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <QuizStats />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
