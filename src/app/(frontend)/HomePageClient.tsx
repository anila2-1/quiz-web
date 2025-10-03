'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Code-split heavy components
const Footer = dynamic(() => import('./components/Footer'), {
  ssr: false,
  loading: () => <div className="h-20 bg-gray-100 animate-pulse"></div>,
})

const LoadingLink = dynamic(() => import('./components/LoadingLink'), {
  ssr: false,
  loading: () => (
    <button className="px-6 py-3 bg-gray-200 text-gray-500 rounded-lg animate-pulse cursor-wait">
      Loading...
    </button>
  ),
})

const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false,
})

const AnimatePresence = dynamic(() => import('framer-motion').then((mod) => mod.AnimatePresence), {
  ssr: false,
})

export default function HomePageClient() {
  const [member, setMember] = useState<any>(null)
  const [, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    fetch('/api/get-member')
      .then((res) => res.json())
      .then((data) => setMember(data.member))
      .catch((err) => console.error('Failed to fetch member:', err))
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orb 1: Slow pulsing */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-70 animate-pulse"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.3), transparent 50%)',
            left: '-10%',
            top: '-10%',
            animation: 'float 20s ease-in-out infinite',
          }}
        ></div>

        {/* Orb 2: Bouncing */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-60 animate-bounce"
          style={{
            background:
              'radial-gradient(circle at 70% 70%, rgba(192, 38, 211, 0.2), transparent 60%)',
            right: '-10%',
            bottom: '-10%',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        ></div>

        {/* Orb 3: Rotating */}
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl opacity-40 animate-spin"
          style={{
            background:
              'radial-gradient(circle at center, rgba(14, 165, 233, 0.2), transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animationDuration: '40s',
          }}
        ></div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        ></div>
      </div>

      {/* Animated Ink Smoke Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <MotionDiv
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            filter: 'blur(40px)',
            transform: 'scale(1.2)',
            animation: 'float 20s ease-in-out infinite',
          }}
        ></MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-l from-cyan-400 via-blue-400 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            filter: 'blur(35px)',
            transform: 'scale(1.1)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        ></MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 2.5 }}
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-t from-green-200 via-yellow-200 to-orange-200 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            filter: 'blur(30px)',
            transform: 'translate(-50%, -50%) scale(1.3)',
            animation: 'float 30s ease-in-out infinite',
          }}
        ></MotionDiv>
      </div>

      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, 20px); }
          50% { transform: translate(-10px, -10px); }
          75% { transform: translate(-20px, 20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        @keyframes grow {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 5px 15px rgba(32, 211, 200, 0.2); }
          50% { box-shadow: 0 5px 30px rgba(32, 211, 200, 0.4); }
        }

        .animate-grow {
          animation: grow 1.5s ease-out forwards;
        }

        .button-glow:hover {
          animation: glow 1.5s infinite;
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        <MotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        ></MotionDiv>

        <AnimatePresence>
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Learn, Quiz & Earn Real Rewards
              <span className="block mt-4 text-lg text-gray-600 font-normal">
                Master new skills, test your knowledge, and get rewarded.
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Refer friends and get{' '}
              <span className="font-bold text-indigo-600">100 bonus points</span> per signup!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              {!member ? (
                <>
                  <LoadingLink
                    href="/auth/signup"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 text-base"
                  >
                    Join Now — It’s Free
                  </LoadingLink>
                  <LoadingLink
                    href="/auth/login"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    theme="light"
                    className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-indigo-200 transform transition-all duration-200 text-base"
                  >
                    Login
                  </LoadingLink>
                </>
              ) : (
                <LoadingLink
                  href="/dashboard"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 text-base"
                >
                  Go to Dashboard
                </LoadingLink>
              )}
            </div>
          </MotionDiv>
        </AnimatePresence>

        {/* Blog Section */}
        <div className="my-16 md:my-24 max-w-5xl mx-auto px-2 sm:px-4">
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-gray-200/40 shadow-xl md:shadow-2xl hover:shadow-2xl md:hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 overflow-hidden group"
          >
            <div className="hidden md:block absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-bl-full -translate-y-8 md:-translate-y-12 translate-x-8 md:translate-x-12 group-hover:translate-x-6 md:group-hover:translate-x-8 group-hover:-translate-y-6 md:group-hover:-translate-y-8 transition-transform duration-500"></div>
            <div className="hidden md:block absolute bottom-0 left-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-tr from-purple-400/10 to-indigo-400/10 rounded-tr-full translate-y-8 md:translate-y-12 -translate-x-8 md:-translate-x-12 group-hover:-translate-x-6 md:group-hover:-translate-x-8 group-hover:translate-y-6 md:group-hover:translate-y-8 transition-transform duration-500"></div>

            <div className="relative z-10 text-center">
              <MotionDiv
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
                className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 px-3 sm:px-5 py-2 sm:py-3 rounded-full border border-teal-200/50"
              >
                <span className="text-xl sm:text-2xl">📖</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700 tracking-wide uppercase">
                  New Knowledge Awaits
                </span>
              </MotionDiv>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 sm:mb-4 leading-tight px-2">
                Ready to Learn Something{' '}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  New?
                </span>
              </h3>

              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
                Learn from experts. Quiz with confidence. Earn as you grow.
              </p>

              <LoadingLink
                href="/blog"
                whileHover={{ scale: 1.03, boxShadow: '0 20px 40px -10px rgba(32, 211, 200, 0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 text-white font-bold rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl hover:shadow-xl sm:hover:shadow-2xl transform transition-all duration-300 text-base sm:text-lg relative overflow-hidden mx-auto block"
              >
                <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2">
                  Explore Blogs Now
                  <span className="text-base sm:text-lg">→</span>
                </span>
              </LoadingLink>

              <div className="hidden lg:block absolute -top-2 -left-2 w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping"></div>
              <div className="hidden lg:block absolute -bottom-4 -right-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-1000"></div>
            </div>
          </MotionDiv>
        </div>

        {/* Stats Cards */}
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            { number: '100+', label: 'Learning Posts', color: 'indigo' },
            { number: '50K+', label: 'Quizzes Taken', color: 'purple' },
            { number: '₹5L+', label: 'Rewards Distributed', color: 'pink' },
          ].map((stat, idx) => (
            <MotionDiv
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200/50 transition-all duration-300 transform hover:-translate-y-2"
            >
              <h3 className={`text-4xl font-extrabold text-${stat.color}-600 mb-2`}>
                {stat.number}
              </h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </MotionDiv>
          ))}
        </MotionDiv>

        {/* Feature Highlights */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
        >
          {[
            {
              icon: '📚',
              title: 'Learn from Blogs',
              desc: 'Read well-researched articles on tech, finance, and more before taking quizzes.',
            },
            {
              icon: '🏆',
              title: 'Earn Points & Rewards',
              desc: 'Get points for correct answers and redeem them for real rewards.',
            },
            {
              icon: '🔗',
              title: 'Refer & Earn',
              desc: 'Share your referral link and earn 100 bonus points per signup.',
            },
            {
              icon: '📱',
              title: 'Mobile Friendly',
              desc: 'Access quizzes and track earnings from any device, anytime.',
            },
          ].map((feature, idx) => (
            <MotionDiv
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + idx * 0.1 }}
              className="flex items-start space-x-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="text-3xl">{feature.icon}</span>
              <div className="text-left">
                <h4 className="text-xl font-semibold text-gray-800">{feature.title}</h4>
                <p className="text-gray-600 mt-1">{feature.desc}</p>
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>

      <Footer />
    </div>
  )
}
