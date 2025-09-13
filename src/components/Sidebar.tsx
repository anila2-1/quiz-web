// Sidebar.tsx (fixed responsive toggle)
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface MenuItem {
  key: string
  label: string
  icon: string
  href: string
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(true) // desktop always open
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const menuItems: MenuItem[] = [
    { key: 'overview', label: 'Overview', icon: '📊', href: '/dashboard' },
    { key: 'withdrawals', label: 'Withdrawals', icon: '💰', href: '/dashboard/withdrawals' },
    { key: 'profile', label: 'Profile', icon: '👤', href: '/dashboard/profile' },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
    if (isMobile) setIsOpen(false)
  }

  const toggleSidebar = () => setIsOpen((prev) => !prev)

  // Brand Header
  const BrandHeader = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold text-indigo-700">Dashboard</h2>
    </div>
  )

  const MenuItemComponent = ({ item }: { item: MenuItem }) => (
    <li key={item.key}>
      <button
        onClick={() => handleNavigation(item.href)}
        className={`group w-full flex items-center space-x-3 px-6 py-3 text-left rounded-xl transition-all
          ${
            pathname === item.href
              ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600'
              : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
          }`}
      >
        <span>{item.icon}</span>
        <span className="font-medium">{item.label}</span>
      </button>
    </li>
  )

  const Navigation = () => (
    <nav className="mt-4 px-2">
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <MenuItemComponent key={item.key} item={item} />
        ))}
        <li className="mt-6 px-6">
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
  )

  return (
    <>
      {/* ✅ Toggle Button (Mobile only) */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-16 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg md:hidden"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
            >
              <path d="M18 6L6 18M6 6l12 12" strokeWidth={2} />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
            >
              <path d="M3 12h18M3 6h18M3 18h18" strokeWidth={2} />
            </svg>
          )}
        </button>
      )}

      {/* ✅ Sidebar */}
      <div
        className={`fixed h-full w-64 bg-white/95 backdrop-blur-lg shadow-xl border-r border-gray-200 transition-transform duration-300 z-40
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}
      >
        <BrandHeader />
        <Navigation />
      </div>

      {/* ✅ Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={toggleSidebar}></div>
      )}
    </>
  )
}
