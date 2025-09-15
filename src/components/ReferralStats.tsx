// src/app/(frontend)/components/ReferralStats.tsx
import { motion } from 'framer-motion'

export default function ReferralStats({ count, code }: { count: number; code: string }) {
  // Har referral par kitne points milte hain?
  const pointsPerReferral = 10
  const totalReferralPoints = count * pointsPerReferral
  const referralLink = `https://quiz-learn-web.vercel.app/referral/${code}` // Fixed spacing issue

  // Copy function
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(
      () => {
        // Optional: Show visual feedback (without alert)
        const button = document.getElementById('copy-btn')
        const originalText = button?.innerText
        if (button) button.innerText = 'Copied!'
        setTimeout(() => {
          if (button) button.innerText = originalText || 'Copy'
        }, 2000)
      },
      (err) => {
        console.error('Copy failed:', err)
        alert('Failed to copy. Please manually copy the link.')
      },
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white/90 top-10 mb-6 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-2xl hover:scale-101 relative overflow-hidden"
    >
      {/* Background Gradient Blob */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-32 h-30 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-70"></div>

      {/* Card Content */}
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">💰 Referral Earnings</h3>
        <div className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {totalReferralPoints * 10} Points
        </div>
        <p className="text-gray-600 text-sm mb-5">
          {count} referral{count !== 1 ? 's' : ''} joined via you
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            onClick={(e) => e.currentTarget.select()} // Click to select all
            className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm truncate"
            title="Click to select"
          />
          <motion.button
            id="copy-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all duration-300 text-sm font-medium whitespace-nowrap"
          >
            Copy
          </motion.button>
        </div>
      </div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform group-hover:animate-shine"
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
