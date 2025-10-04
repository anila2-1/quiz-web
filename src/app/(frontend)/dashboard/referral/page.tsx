// src/app/(frontend)/dashboard/referral/page.tsx
'use client'

import { useEffect, useState } from 'react'
import ReferralLinkSection from '@/components/ReferralLinkSection'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { useSidebar } from '../../SidebarContext'

interface ReferralData {
  referralsCount: number
  referralEarnings: number
  referralCode: string
  referralLink: string
  referredMembers: any[]
}

export default function ReferralPage() {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const [data, setData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/referral')
        if (!res.ok) throw new Error('Failed to fetch referral data')
        const result = await res.json()
        setData(result)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Reusable content wrapper
  const renderContent = (children: React.ReactNode) => (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar is always rendered */}
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 md:hidden bg-opacity-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 md:ml-64">{children}</div>
    </div>
  )

  if (loading) {
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

  if (error || !data) {
    return renderContent(
      <div className="flex justify-center items-center h-screen">
        <div className="max-w-md text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Please sign in to view your referral dashboard.
          </div>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>,
    )
  }

  return renderContent(
    <div className="max-w-4xl mt-10 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Refer Friends & Earn Points</h1>
        <p className="text-gray-600">
          Share your link and earn 100 points for each friend who signs up
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              {data.referralsCount}
            </div>
            <div className="text-sm font-medium text-gray-600">Total Referrals</div>
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              {data.referralEarnings}
            </div>
            <div className="text-sm font-medium text-gray-600">Points Earned</div>
          </div>
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              100
            </div>
            <div className="text-sm font-medium text-gray-600">Points per Referral</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-3xl p-8 mb-10 border border-gray-100 hover:shadow-3xl transition-all duration-500 group">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Referral Link</h2>
        <ReferralLinkSection referralLink={data.referralLink} referralCode={data.referralCode} />
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Referrals</h2>
          <span className="text-sm text-gray-500">
            {data.referredMembers.length} {data.referredMembers.length === 1 ? 'friend' : 'friends'}
          </span>
        </div>

        {data.referredMembers.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No referrals yet</h3>
            <p className="mt-2 text-gray-500">Share your referral link to start earning points!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.referredMembers.map((referredMember) => (
                  <tr
                    key={referredMember.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {referredMember.name || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {referredMember.username || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{referredMember.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(referredMember.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>,
  )
}
