// src/app/(frontend)/components/Navbar.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useSidebar } from '../SidebarContext'

export default function Navbar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const [member, setMember] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Show sidebar toggle on Dashboard + mobile
  const shouldShowSidebarToggle = pathname.startsWith('/dashboard')
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch('/api/get-member')
        const data = await res.json()
        setMember(data.member)
      } catch (err) {
        console.error('Failed to fetch member:', err)
      } finally {
        setIsLoaded(true)
      }
    }

    fetchMember()
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setSidebarOpen(false)
  }, [pathname, setSidebarOpen])

  return (
    <nav
      id="navbar"
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/60 shadow-lg transition-all duration-300"
      style={{ height: '64px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              QuizEarn
            </Link>
          </motion.div>

          {/* Right Side: Toggle Buttons */}
          <div className="flex items-center gap-4">
            {/* Dashboard Sidebar Toggle — Only on Dashboard (Mobile) */}
            {shouldShowSidebarToggle && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle Dashboard Sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* Hamburger Menu — Hide on Dashboard (Mobile) */}
            {!shouldShowSidebarToggle && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 h-full">
            <NavItem href="/">Home</NavItem>
            <NavItem href="/categories">Category</NavItem>
            {isLoaded && member && <NavItem href="/dashboard">Dashboard</NavItem>}
            {isLoaded ? (
              member ? (
                <LogoutButton onClick={handleLogout} />
              ) : (
                <AnimatedSignUpButton />
              )
            ) : (
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 bg-white/90 backdrop-blur-md"
            >
              <div className="py-4 space-y-3 px-4">
                <MobileNavItem href="/">Home</MobileNavItem>
                <MobileNavItem href="/categories">Category</MobileNavItem>
                {isLoaded && member && pathname !== '/dashboard' && (
                  <MobileNavItem href="/dashboard">Dashboard</MobileNavItem>
                )}
                {isLoaded ? (
                  member ? (
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-3 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Sign Up
                    </Link>
                  )
                ) : (
                  <div className="h-10 bg-gray-200 rounded animate-pulse mx-4"></div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

// ✅ Reusable Desktop Nav Item
function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.div whileHover={{ y: -2 }}>
      <Link href={href} className="text-gray-700 hover:text-indigo-600 font-medium relative group">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
      </Link>
    </motion.div>
  )
}

// ✅ Reusable Mobile Nav Item
function MobileNavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      onClick={() => {
        const navbar = document.getElementById('navbar')
        if (navbar) navbar.scrollIntoView({ behavior: 'smooth' })
      }}
      className={`block px-4 py-3 font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
      }`}
    >
      {children}
    </Link>
  )
}

// ✅ Logout Button (Desktop)
function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative group px-5 py-2.5 text-red-600 font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-300"
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
      <span className="absolute inset-0 rounded-full border border-red-200 group-hover:border-red-300 opacity-0 group-hover:opacity-60 transition-all duration-300 animate-pulse"></span>
      <span className="relative z-10 flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Logout</span>
      </span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
    </motion.button>
  )
}

// ✅ Premium Animated Sign Up Button (Desktop)
function AnimatedSignUpButton() {
  return (
    <motion.div whileHover="hover" whileTap="tap" className="relative">
      <Link
        href="/auth/signup"
        className="px-6 py-2.5 text-white font-semibold rounded-full shadow-lg relative overflow-hidden z-10"
        style={{
          background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #4F46E5)',
          backgroundSize: '300% 100%',
          backgroundPosition: '0%',
        }}
      >
        <span className="relative z-10 whitespace-nowrap">Sign Up</span>
      </Link>

      <motion.div
        className="absolute inset-0 rounded-full opacity-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm"
        style={{ border: '2px solid transparent', backgroundClip: 'padding-box' }}
        variants={{
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.4 }}
      ></motion.div>

      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
        style={{ backgroundSize: '60% 100%', transform: 'skewX(-20deg)' }}
        variants={{
          hover: {
            x: '100%',
            transition: { duration: 1, repeat: Infinity, repeatType: 'loop' },
          },
        }}
      ></motion.div>

      <style jsx>{`
        @keyframes gradientShift {
          0% {
            background-position: 0%;
          }
          100% {
            background-position: 200%;
          }
        }
        [style*='background: linear-gradient'] {
          animation: gradientShift 3s ease-in-out infinite alternate;
        }
      `}</style>
    </motion.div>
  )
}
