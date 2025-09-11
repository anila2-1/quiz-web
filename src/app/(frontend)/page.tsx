// src/app/(frontend)/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';

export default function HomePage() {
  const [member, setMember] = useState<any>(null);
  const [, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetch('/api/get-member')
      .then(res => res.json())
      .then(data => setMember(data.member));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Gradient Background */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Orb 1: Slow pulsing */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-70 animate-pulse"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(79, 70, 229, 0.3), transparent 50%)',
            left: '-10%',
            top: '-10%',
            animation: 'float 20s ease-in-out infinite',
          }}
        ></div>

        {/* Orb 2: Bouncing */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-60 animate-bounce"
          style={{
            background: 'radial-gradient(circle at 70% 70%, rgba(192, 38, 211, 0.2), transparent 60%)',
            right: '-10%',
            bottom: '-10%',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        ></div>

        {/* Orb 3: Rotating */}
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-2xl opacity-40 animate-spin"
          style={{
            background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.2), transparent 70%)',
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
        > </div>
      </div>

      {/* Animated Ink Smoke Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Colorful Ink Cloud 1 */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            filter: 'blur(40px)',
            transform: 'scale(1.2)',
            animation: 'float 20s ease-in-out infinite',
          }}
        ></motion.div>

        {/* Colorful Ink Cloud 2 */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-l from-cyan-400 via-blue-400 to-indigo-400 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            filter: 'blur(35px)',
            transform: 'scale(1.1)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        ></motion.div>

        {/* Colorful Ink Cloud 3 */}
        <motion.div
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 2, delay: 2.5 }}
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-t from-green-200 via-yellow-200 to-orange-200 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            filter: 'blur(30px)',
            transform: 'translate(-50%, -50%) scale(1.3)',
            animation: 'float 30s ease-in-out infinite',
          }}
        ></motion.div>
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
      `}</style>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Logo & Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight">
            QuizEarn
          </h1>
          <p className="mt-3 text-lg text-gray-600 font-medium">Learn. Quiz. Earn. Repeat.</p>
        </motion.div>

        {/* Hero Content */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Earn Points by Learning &{' '}
              <span className="relative inline-block">
                Taking Quizzes
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform scale-x-0 origin-left animate-grow"></span>
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Read blogs, test your knowledge, and earn rewards. Refer friends and earn extra{' '}
              <span className="font-bold text-indigo-600">100 points</span> per signup!
            </p>
            
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-20 animate-pulse"></div>
<div className="absolute -bottom-40 -left-40 w-86 h-86 
     bg-gradient-to-l from-pink-300 to-indigo-300 
     rounded-full opacity-20 animate-bounce-slow"></div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              {!member ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-200 text-lg"
                  >
                    <Link href="/auth/signup">Join Now</Link>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl border-2 border-indigo-200 transform transition-all duration-200 text-lg"
                  >
                    <Link href="/auth/login">Login</Link>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-200 text-lg"
                >
                  <Link href="/dashboard">Go to Dashboard</Link>
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats Cards */}
        <motion.div
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200/50 transition-all duration-300 transform hover:-translate-y-2"
            >
              <h3 className={`text-4xl font-extrabold text-${stat.color}-600 mb-2`}>{stat.number}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
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
            <motion.div
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
            </motion.div>
          ))}
        </motion.div>
         
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Add animation to grow underline
<style>{`
  @keyframes grow {
    0% { transform: scaleX(0); }
    100% { transform: scaleX(1); }
  }
  .animate-grow {
    animation: grow 1.5s ease-out forwards;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(20px, 20px); }
    50% { transform: translate(-10px, -10px); }
    75% { transform: translate(-20px, 20px); }
  }
`}</style>