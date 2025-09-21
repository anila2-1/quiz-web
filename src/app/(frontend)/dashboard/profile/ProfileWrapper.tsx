// src/app/(frontend)/dashboard/profile/ProfileWrapper.tsx
'use client'

import Sidebar from '@/components/Sidebar'
import ProfileForm from '@/components/ProfileForm'
import Link from 'next/link'

export default function ProfileWrapper({ member }: { member: any }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (hidden on small screens, visible on md+) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 md:ml-64 flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-6 sm:p-8">
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
          <div className="mt-10 pt-6 border-t border-gray-100">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-white border border-gray-200 
               hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-gray-700 font-medium text-sm sm:text-base
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 group-hover:bg-indigo-50 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300 group-hover:-translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </span>

              <span className="font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                Back to Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
