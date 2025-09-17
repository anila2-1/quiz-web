'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface LoadingButtonProps {
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  whileHover?: any
  whileTap?: any
  isLoading?: boolean
  children: React.ReactNode
}

export default function LoadingButton({
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  whileHover,
  whileTap,
  isLoading = false,
  children,
}: LoadingButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={whileHover}
      whileTap={whileTap}
      className={`${className} ${isLoading ? 'opacity-80 cursor-wait' : ''} flex items-center justify-center gap-2 relative`}
    >
      {isLoading ? (
        <>
          {/* Spinner — White for colored buttons, Gray for white buttons */}
          <div
            className={`w-5 h-5 md:w-6 md:h-6 border-3 border-white border-t-transparent rounded-full animate-spin drop-shadow-sm`}
          ></div>
          <span className="text-sm font-medium text-white hidden sm:inline animate-pulse">
            Loading...
          </span>
        </>
      ) : (
        children
      )}
    </motion.button>
  )
}
