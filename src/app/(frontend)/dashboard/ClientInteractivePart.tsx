// src/app/(frontend)/dashboard/ClientInteractivePart.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './../../../components/Sidebar'
import DashboardHeader from './../../../components/DashboardHeader'
import WalletCard from './../../../components/WalletCard'
import ReferralStats from './../../../components/ReferralStats'
import QuizStats from '../../../components/QuizStats'
import { useSidebar } from '../SidebarContext'

interface User {
  id: string
  name?: string | null
  email: string
  wallet?: number | null
  totalPoints?: number | null
  referralCode?: string | null
  referralsCount?: number | null
}

interface ClientInteractivePartProps {
  user: User | null
}

export default function ClientInteractivePart({ user: serverUser }: ClientInteractivePartProps) {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setUser(serverUser)
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
      {/* Sidebar Desktop — unchanged */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar Mobile Overlay */}
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

      {/* Main Content */}
      <div className="flex-1 w-full">
        {/* Page Content — unchanged */}
        <div className="p-4 sm:p-6 lg:ml-64 transition-all duration-300">
          <DashboardHeader user={user} activeTab="overview" />
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <WalletCard />
              <ReferralStats count={user.referralsCount || 0} code={user.referralCode || ''} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <QuizStats />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
