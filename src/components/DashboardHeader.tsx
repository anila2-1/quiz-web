// src/app/(frontend)/components/DashboardHeader.tsx
'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function DashboardHeader({ user, activeTab }: { user: any; activeTab: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'overview', label: '📊 Overview' },
    { value: 'withdrawals', label: '💳 Withdrawals' },
  ];

  const selectedLabel = options.find(opt => opt.value === activeTab)?.label || 'Overview';

  const handleSelect = (value: string) => {
    router.push(`/dashboard/${value}`);
    setIsOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/90 top-2.5 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-800 p-8 transition-all duration-300 hover:shadow-2xl relative "
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-pink-100 to-indigo-100 rounded-full opacity-40 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-gray-200 bg-clip-text text-transparent transition-all duration-300 hover:from-indigo-500 hover:to-purple-500">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
            Welcome back,{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {user.name || 'User'}
            </span>
          </p>
        </div>

        <div className="mt-4 md:mt-0 transform hover:scale-105 transition-transform duration-300 relative">
          {/* Custom Dropdown */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-3 text-gray-800 dark:text-gray-200 font-medium shadow-sm transition-all duration-300 flex items-center justify-between w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <span className="flex items-center gap-2">{selectedLabel}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>

          {/* Dropdown Options */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="py-1">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`w-full text-left px-5 py-3 flex items-center gap-2 text-sm transition-all duration-200 ${
                        activeTab === option.value
                          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}