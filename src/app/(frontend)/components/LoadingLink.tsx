'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface LoadingLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  whileHover?: any
  whileTap?: any
  theme?: 'light' | 'dark' | 'auto' // ← New Prop!
}

export default function LoadingLink({
  href,
  children,
  className = '',
  whileHover,
  whileTap,
  theme = 'auto',
}: LoadingLinkProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      router.push(href)
    }, 400)
  }

  // Auto-detect theme based on className (simple heuristic)
  let spinnerColor = 'border-white'
  let textColor = 'text-white'

  if (
    theme === 'light' ||
    className.includes('bg-white') ||
    className.includes('text-indigo-600')
  ) {
    spinnerColor = 'border-gray-700'
    textColor = 'text-gray-700'
  } else if (theme === 'dark') {
    spinnerColor = 'border-white'
    textColor = 'text-white'
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={whileHover}
      whileTap={whileTap}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-80 cursor-wait' : ''} flex items-center justify-center gap-2`}
    >
      {isLoading ? (
        <>
          {/* Smart Contrast Spinner */}
          <div
            className={`w-6 h-6 md:w-8 md:h-8 border-4 ${spinnerColor} border-t-transparent rounded-full animate-spin drop-shadow-sm`}
          ></div>
          <span className={`text-sm font-medium ${textColor} hidden sm:inline animate-pulse`}>
            Loading...
          </span>
        </>
      ) : (
        children
      )}
    </motion.button>
  )
}
