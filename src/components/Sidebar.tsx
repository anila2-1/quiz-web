// src/app/components/Sidebar.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSidebar } from '@/app/(frontend)/SidebarContext'
import { motion } from 'framer-motion'

interface MenuItem {
  key: string
  label: string
  icon: string
  href: string
}

const menuItems: MenuItem[] = [
  { key: 'overview', label: 'Overview', icon: '📊', href: '/dashboard' },
  { key: 'referral', label: 'Referral', icon: '🔗', href: '/dashboard/referral' },
  { key: 'withdrawals', label: 'Withdrawals', icon: '💰', href: '/dashboard/withdrawals' },
  { key: 'takequiz', label: 'TakeQuiz', icon: '📋', href: '/dashboard/takequiz' },
  { key: 'profile', label: 'Profile', icon: '👤', href: '/dashboard/profile' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useSidebar()

  return (
    <>
      {/* 📱 Mobile Sidebar (slides in) */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-0 left-0 z-50 h-screen w-64 bg-white/95 backdrop-blur-lg shadow-2xl border-r border-gray-200 md:hidden pt-16"
      >
        <nav className="mt-4 px-2">
          <ul className="space-y-6">
            {menuItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group w-full flex items-center mt-2 space-x-3 px-6 py-3 text-left rounded-xl transition-all
                    ${
                      pathname === item.href
                        ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="mt-8 px-6">
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 font-medium"
              >
                <span>←</span>
                <span>Back to Home</span>
              </Link>
            </li>
          </ul>
        </nav>
      </motion.div>

      {/* 💻 Desktop Sidebar (always visible) */}
      <div className="hidden md:block fixed h-full w-64 bg-white/95 backdrop-blur-lg shadow-xl border-r border-gray-200 z-40 pt-10">
        <nav className="mt-4 px-2">
          <ul className="space-y-8">
            {menuItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`group w-full flex items-center mt-2 space-x-3 px-6 py-3 text-left rounded-xl transition-all
                    ${
                      pathname === item.href
                        ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="mt-8 px-6">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 font-medium"
              >
                <span>←</span>
                <span>Back to Home</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
