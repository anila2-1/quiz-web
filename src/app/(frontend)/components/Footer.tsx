// src/app/(frontend)/components/Footer.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook, FaArrowUp } from 'react-icons/fa'

const Footer = () => {
  const [showButton, setShowButton] = useState(false)

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-purple-50/20 py-16 px-6 border-t border-gray-100">
        {/* Background Accents (Soft Blur Blobs) */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-50/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-700">
            {/* Brand Info */}
            <div className="space-y-5 max-w-xs">
              <Link href="/" className="inline-block group">
                <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight transition-all duration-300">
                  QuizEarn
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-600 pr-4">
                Learn through interactive quizzes, earn points, and redeem rewards. Invite friends —
                get <span className="font-medium text-indigo-600">100 points</span> per referral.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 tracking-wide">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { href: '/blog', label: 'Blogs' },
                  { href: '/dashboard', label: 'Dashboard' },
                  // { href: '/about', label: 'About Us' },
                  // { href: '/contact', label: 'Contact' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="group flex items-center space-x-2 text-gray-600 hover:text-indigo-600 font-medium text-sm transition-all duration-300"
                    >
                      <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative">
                        {link.label}
                        <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social + CTA */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-gray-800 tracking-wide">Connect With Us</h3>
              <div className="flex space-x-4">
                {[
                  {
                    href: 'https://github.com/yourusername',
                    icon: <FaGithub size={20} />,
                    bg: 'bg-gray-100 hover:bg-gray-200',
                    colors: 'from-gray-800 via-gray-900 to-black',
                    title: 'GitHub',
                  },
                  {
                    href: 'https://twitter.com/quizearn',
                    icon: <FaTwitter size={20} />,
                    bg: 'bg-sky-50 hover:bg-sky-100',
                    colors: 'from-sky-400 via-sky-500 to-blue-600',

                    title: 'Twitter',
                  },
                  {
                    href: 'https://linkedin.com/company/quizearn',
                    icon: <FaLinkedin size={20} />,
                    bg: 'bg-blue-50 hover:bg-blue-100',
                    colors: 'from-blue-500 via-blue-600 to-blue-700',

                    title: 'LinkedIn',
                  },
                  {
                    href: 'https://facebook.com/quizearn',
                    icon: <FaFacebook size={20} />,
                    bg: 'bg-blue-50 hover:bg-blue-100',
                    colors: 'from-blue-400 via-blue-600 to-blue-700',

                    title: 'Facebook',
                  },
                ].map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-11 h-11 rounded-xl 
                                ${social.bg} text-gray-700 bg-gradient-to-tr ${social.colors} 
                                text-white shadow-lg shadow-gray-700/40
                                hover:shadow-2xl hover:-translate-y-2 hover:rotate-3 hover:scale-110
                                transition-all duration-500 ease-out group`}
                    title={social.title}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-10 border-gray-200/50" />

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()}{' '}
            <Link href="/" className="font-medium text-gray-700 hover:text-indigo-600 transition">
              QuizEarn
            </Link>{' '}
            — Where Learning Meets Rewards.
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full 
                     bg-white border border-gray-200 
                     text-indigo-600 shadow-lg hover:shadow-xl 
                     hover:scale-110 active:scale-100 
                     transition-all duration-300 ease-in-out 
                     z-50"
          title="Back to Top"
        >
          <FaArrowUp size={18} />
        </button>
      )}
    </>
  )
}

export default Footer
