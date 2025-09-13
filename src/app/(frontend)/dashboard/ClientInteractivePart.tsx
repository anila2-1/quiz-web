// src/app/(frontend)/dashboard/ClientInteractivePart.tsx
'use client'

import React, { useState } from 'react'
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

export default function ClientInteractivePart({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState<string>('overview')

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 transition-all duration-300">
        <DashboardHeader user={user} activeTab={activeTab!} />

        <div className="mt-8 space-y-8">
          {activeTab === 'overview' && (
            <>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <WalletCard />
                </div>
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <ReferralStats count={user.referralsCount || 0} code={user.referralCode || ''} />
                </div>
              </div>

              {/* Quiz History */}
              <div className="transform hover:translate-y-[-2px] transition-transform duration-300">
                <QuizStats />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed -top-20 -left-20 w-80 h-80 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-pink-100 to-indigo-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
    </div>
  )
}
