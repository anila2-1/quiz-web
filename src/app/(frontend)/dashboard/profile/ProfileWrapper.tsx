// src/app/(frontend)/dashboard/profile/ProfileWrapper.tsx
'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import ProfileForm from '@/components/ProfileForm'
import Link from 'next/link'
import { useSidebar } from '../../SidebarContext'

export default function ProfileWrapper({ member: initialMember }: { member: any }) {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMember(initialMember)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [initialMember])

  // Reusable layout wrapper (same as ReferralPage)
  const renderContent = (children: React.ReactNode) => (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar is always rendered */}
      <Sidebar />

      {/* Optional: Click outside to close (transparent, no black overlay) */}
      {sidebarOpen && (
        <div
          className="fixed top-0 right-0 bottom-0 left-64 bg-transparent z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:ml-64">{children}</div>
    </div>
  )

  if (loading || !member) {
    return renderContent(
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
          <p className="text-xl font-semibold text-gray-700 animate-pulse">Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Almost there — just a moment please 😊</p>
        </div>
      </div>,
    )
  }

  return renderContent(
    <div className="max-w-2xl mt-10 mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 drop-shadow-sm flex items-center gap-3 mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Edit Profile
        </h1>

        <ProfileForm member={member} />
      </div>
    </div>,
  )
}
