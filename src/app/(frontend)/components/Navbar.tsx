// src/app/(frontend)/components/Navbar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [member, setMember] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Check system preference or localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = savedMode ? JSON.parse(savedMode) : systemPrefersDark;
    
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch('/api/get-member');
        const data = await res.json();
        setMember(data.member);
      } catch (err) {
        console.error('Failed to fetch member:', err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchMember();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/60 dark:border-gray-800 shadow-lg transition-all duration-300"
      style={{ height: '64px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-pink-400 bg-clip-text text-transparent"
            >
              QuizEarn
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 h-full">
            {(['Home', 'Blogs'] as const).map((item) => (
              <motion.div key={item} whileHover={{ y: -2 }}>
                <Link
                  href={item === 'Home' ? '/' : '/blog'}
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}

            {isLoaded ? (
              member ? (
                <>
                  <motion.div whileHover={{ y: -2 }}>
                    <Link
                      href="/dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium relative group"
                    >
                      Dashboard
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="relative group px-5 py-2.5 text-red-600 font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    {/* Background Glow on Hover */}
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></span>
                    
                    {/* Border Pulse Effect */}
                    <span className="absolute inset-0 rounded-full border border-red-200 group-hover:border-red-300 opacity-0 group-hover:opacity-60 transition-all duration-300 animate-pulse"></span>
                    
                    {/* Text with Gradient Underline */}
                    <span className="relative z-10 flex items-center space-x-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>Logout</span>
                    </span>

                    {/* Slide-in Underline */}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                  </motion.button>
                </>
              ) : (
                <AnimatedSignUpButton />
              )
            ) : (
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            )}

            {/* Dark Mode Toggle
            <motion.button
              whileHover={{ rotate: 360, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-yellow-300 shadow hover:shadow-md transition-all duration-300"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </motion.button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            <motion.svg
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-xl rounded-b-2xl overflow-hidden"
            >
              <div className="px-4 pt-2 pb-4 space-y-1">
                {(['Home', 'Blogs'] as const).map((item) => (
                  <Link
                    key={item}
                    href={item === 'Home' ? '/' : '/blog'}
                    className="block relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r from-indigo-500 to-pink-500 after:transition-all after:duration-300 hover:after:w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                {isLoaded ? (
                  member ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800 rounded transition"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-2 space-y-2">
                      <AnimatedSignUpButtonMobile />
                      Dark Mode in Mobile
                      <motion.button
                        whileHover={{ rotate: 360, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleDarkMode}
                        className="flex items-center space-x-2 w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      >
                        {darkMode ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="5" />
                              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                            </svg>
                            <span>Light Mode</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                            <span>Dark Mode</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  )
                ) : (
                  <div className="px-4 py-2">
                    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// ✅ Premium Animated Sign Up Button (Desktop)
function AnimatedSignUpButton() {
  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      className="relative"
    >
      <Link
        href="/auth/signup"
        className="px-6 py-2.5 text-white font-semibold rounded-full shadow-lg relative overflow-hidden z-10"
        style={{
          background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #4F46E5)',
          backgroundSize: '300% 100%',
          backgroundPosition: '0%',
        }}
      >
        <span className="relative z-10 whitespace-nowrap">Sign Up</span>
      </Link>

      {/* Glowing Border */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm"
        style={{ border: '2px solid transparent', backgroundClip: 'padding-box' }}
        variants={{
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.4 }}
      ></motion.div>

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
        style={{ backgroundSize: '60% 100%', transform: 'skewX(-20deg)' }}
        variants={{
          hover: { 
            x: '100%',
            transition: { duration: 1, repeat: Infinity, repeatType: 'loop' }
          },
        }}
      ></motion.div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0%; }
          100% { background-position: 200%; }
        }
        [style*="background: linear-gradient"] {
          animation: gradientShift 3s ease-in-out infinite alternate;
        }
      `}</style>
    </motion.div>
  );
}

// ✅ Premium Animated Sign Up Button (Mobile)
function AnimatedSignUpButtonMobile() {
  return (
    <motion.div
      whileHover="hover"
      whileTap="tap"
      className="relative"
    >
      <Link
        href="/auth/signup"
        className="block w-full text-center py-2.5 text-white font-semibold rounded-lg shadow relative overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #EC4899, #4F46E5)',
          backgroundSize: '300% 100%',
          backgroundPosition: '0%',
        }}
      >
        <span className="relative z-10">Sign Up</span>
      </Link>

      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-sm"
        style={{ border: '2px solid transparent', backgroundClip: 'padding-box' }}
        variants={{
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.4 }}
      ></motion.div>

      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
        style={{ backgroundSize: '60% 100%', transform: 'skewX(-20deg)' }}
        variants={{
          hover: { 
            x: '100%',
            transition: { duration: 1, repeat: Infinity, repeatType: 'loop' }
          },
        }}
      ></motion.div>

      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0%; }
          100% { background-position: 200%; }
        }
        [style*="background: linear-gradient"] {
          animation: gradientShift 3s ease-in-out infinite alternate;
        }
      `}</style>
    </motion.div>
  );
}