// src/app/(frontend)/components/QuizStats.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface QuizStatsData {
  totalQuizPoints: number
  quizCount: number
  latestQuiz: {
    title: string
    date: string
    score: number
    points: number
  } | null
}

export default function QuizStats() {
  const [stats, setStats] = useState<QuizStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuizStats = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/quiz-stats')

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to load quiz stats')
        }

        const data = await res.json()
        setStats(data)
      } catch (err: any) {
        console.error('Error fetching quiz stats:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizStats()
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/90 top-14 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-5"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 Loading Quiz Stats...</h3>
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-red-200 p-5"
      >
        <div className="text-red-600 text-center">❌ {error}</div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-5 transition-all duration-300 hover:shadow-2xl hover:scale-101 relative overflow-hidden"
    >
      {/* Background Gradient Blob */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-32 h-30 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-full blur-3xl opacity-70"></div>

      {/* Card Content */}
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📝 Quiz Earnings</h3>
        <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
          {stats?.totalQuizPoints || 0} Points
        </div>
        <p className="text-gray-600 text-sm mb-4">
          {stats?.quizCount || 0} quiz{stats?.quizCount !== 1 ? 'zes' : ''} completed
        </p>

        {stats?.latestQuiz && (
          <div className="text-xs text-gray-500">
            <strong>Latest:</strong> — {new Date(stats.latestQuiz.date).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
