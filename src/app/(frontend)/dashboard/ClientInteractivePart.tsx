'use client'

import React, { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './../../../components/Sidebar'
import DashboardHeader from './../../../components/DashboardHeader'
import WalletCard from './../../../components/WalletCard'
import ReferralStats from './../../../components/ReferralStats'
import QuizStats from '../../../components/QuizStats'

interface User {
  id: string
  name?: string | null
  email: string
  wallet?: number | null
  totalPoints?: number | null
  referralCode?: string | null
  referralsCount?: number | null
}

export default function ClientInteractivePart({ user: serverUser }: { user: User | null }) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Simulate client-side loading
    setTimeout(() => {
      setUser(serverUser) // replace with API call if needed
    }, 1000)
  }, [serverUser])

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-semibold text-gray-700 animate-pulse">Loading your content...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {' '}
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="relative w-64 bg-white shadow-lg h-full">
            <Sidebar />
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Mobile Header */}
        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden px-4 py-3 border-b bg-white shadow-sm sticky top-0 z-10">
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
        {/* Content */}
        <div className="p-4 sm:p-6 lg:ml-64 transition-all duration-300">
          <DashboardHeader user={user} activeTab="overview" />
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <WalletCard />
              <ReferralStats count={user.referralsCount || 0} code={user.referralCode || ''} />
            </div>
            <QuizStats />
          </div>
        </div>
      </div>
    </div>
  )
}
