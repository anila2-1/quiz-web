// src/app/(frontend)/components/WalletCard.tsx
'use client' // ← Add this

import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './../_providers/Auth'
import { useEffect, useState } from 'react'

export default function WalletCard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)

  useEffect(() => {
    // Wait for user to be available
    if (user !== undefined) {
      setIsLoading(false)
      setWalletBalance(user?.wallet || 0)
    }
  }, [user])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group bg-white/90 top-10 mb-6 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 p-7 transition-all duration-300 hover:shadow-2xl hover:scale-101 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-70"></div>

      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          💰 Wallet Balance
        </h3>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-12 bg-gray-200 rounded-lg animate-pulse mb-5"
            ></motion.div>
          ) : (
            <motion.div
              key="balance"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-5"
            >
              ₹{walletBalance?.toFixed(2)}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => (window.location.href = '/dashboard/withdrawals')}
          className="relative w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Withdraw Funds'}
        </motion.button>
      </div>

      {!isLoading && (
        <motion.div
          className="pointer-events-none absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform group-hover:animate-shine"
          style={{ height: '100%', width: '50%' }}
        ></motion.div>
      )}

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  )
}
