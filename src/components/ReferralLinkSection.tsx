// src/app/(frontend)/components/ReferralLinkSection.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ReferralLinkSectionProps {
  referralLink: string
  referralCode: string
}

export default function ReferralLinkSection({
  referralLink,
  referralCode,
}: ReferralLinkSectionProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [cleanLink, setCleanLink] = useState('')

  // Clean the referral link (remove accidental spaces)
  useEffect(() => {
    const cleaned = `https://quiz-learn-web.vercel.app/referral/${referralCode}`.trim()
    setCleanLink(cleaned)
  }, [referralCode])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanLink)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      <p className="text-gray-700 mb-4">
        Share your referral link with friends. You&apos;ll earn 100 points for each person who signs
        up using your code!
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={cleanLink}
            readOnly
            onClick={(e) => e.currentTarget.select()}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-800 truncate focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            title="Click to select all"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          className={`px-4 py-2.5 rounded-lg font-medium text-white whitespace-nowrap transition-all duration-300 min-w-[90px] flex items-center justify-center ${
            copyStatus === 'copied'
              ? 'bg-green-600 hover:bg-green-700'
              : copyStatus === 'error'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {copyStatus === 'copied' ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </span>
          ) : copyStatus === 'error' ? (
            'Try Again'
          ) : (
            'Copy Link'
          )}
        </motion.button>
      </div>

      <p className="text-sm text-gray-600">
        Your referral code:{' '}
        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{referralCode}</span>
      </p>
    </div>
  )
}
