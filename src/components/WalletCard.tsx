// src/app/(frontend)/components/WalletCard.tsx
import { motion } from 'framer-motion'
import { useAuth } from './../_providers/Auth'

export default function WalletCard() {
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group bg-white/90 top-6 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 p-7 transition-all duration-300 hover:shadow-2xl hover:scale-101 relative overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-70"></div>

      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          💰 Wallet Balance
        </h3>
        <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-5">
          ₹{user?.wallet?.toFixed(2) || ''}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => (window.location.href = '/dashboard/withdrawals')}
          className="relative w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Withdraw Funds
        </motion.button>
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform group-hover:animate-shine"
        style={{ height: '100%', width: '50%' }}
      ></motion.div>

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
