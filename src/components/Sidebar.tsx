'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface MenuItem {
  key: string
  label: string
  icon: string
  href: string
}

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems: MenuItem[] = [
    { key: 'overview', label: 'Overview', icon: '📊', href: '/dashboard' },
    { key: 'blog', label: 'Blog', icon: '📝', href: '/blog' }, // ADDED BLOG
    { key: 'referral', label: 'Referral', icon: '🔗', href: '/dashboard/referral' },
    { key: 'withdrawals', label: 'Withdrawals', icon: '💰', href: '/dashboard/withdrawals' },
    { key: 'profile', label: 'Profile', icon: '👤', href: '/dashboard/profile' },
  ]

  const MenuItemComponent = ({ item }: { item: MenuItem }) => (
    <li key={item.key}>
      <Link
        href={item.href}
        className={`group w-full flex items-center space-x-3 px-6 py-3 text-left rounded-xl transition-all
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
    <div className="fixed h-full w-64 bg-white/95 backdrop-blur-lg shadow-xl border-r border-gray-200 transition-transform duration-300 z-40">
      <Navigation />
    </div>
  )
}
