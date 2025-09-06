// src/app/(frontend)/components/Footer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaFacebook, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Footer */}
      <footer className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 px-6 border-t border-gray-200">
        
        {/* Background Accents (Blur Blobs) */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -right-32 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl opacity-70"></div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-800">
            
            {/* Brand Info */}
            <div className="space-y-4 max-w-xs relative z-10">
              <Link href="/" className="flex items-center space-x-2 group">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight group-hover:tracking-wide transition-all duration-300">
                  QuizEarn
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-gray-600">
                Earn points by <span className="font-semibold text-indigo-600">learning</span> and taking <span className="font-semibold text-purple-600">quizzes</span>. 
                Refer friends and earn <span className="italic text-indigo-500">100 points</span> per signup.
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></span>
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { href: '/blog', label: 'Blogs' },
                  { href: '/dashboard', label: 'Dashboard' },
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="group flex items-center space-x-2 text-gray-700 hover:text-indigo-600 font-medium transition-all duration-300"
                    >
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                      <span className="relative">
                        {link.label}
                        <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social + CTA */}
            <div className="space-y-6 relative z-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect with Us</h3>
              <div className="flex space-x-5">
                {[
                  {
                    href: 'https://github.com/yourusername',
                    icon: <FaGithub size={22} />,
                    colors: 'from-gray-800 via-gray-900 to-black',
                    title: 'GitHub',
                  },
                  {
                    href: 'https://twitter.com/quizearn',
                    icon: <FaTwitter size={22} />,
                    colors: 'from-sky-400 via-sky-500 to-blue-600',
                    title: 'Twitter',
                  },
                  {
                    href: 'https://linkedin.com/company/quizearn',
                    icon: <FaLinkedin size={22} />,
                    colors: 'from-blue-500 via-blue-600 to-blue-700',
                    title: 'LinkedIn',
                  },
                  {
                    href: 'https://facebook.com/quizearn',
                    icon: <FaFacebook size={22} />,
                    colors: 'from-blue-400 via-blue-600 to-blue-700',
                    title: 'Facebook',
                  },
                ].map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative flex items-center justify-center w-12 h-12
                                rounded-2xl bg-gradient-to-tr ${social.colors} 
                                text-white shadow-lg shadow-gray-700/40
                                hover:shadow-2xl hover:-translate-y-2 hover:rotate-3 hover:scale-110
                                transition-all duration-500 ease-out group`}
                    title={social.title}
                  >
                    <span className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 animate-pulse"></span>
                    <span className="relative z-10 drop-shadow-md">{social.icon}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-10 border-gray-300/70 relative z-10" />

          {/* Copyright */}
          <div className="text-center text-sm text-gray-600 relative z-10">
            © {new Date().getFullYear()}{' '}
            <Link href="/" className="font-medium text-gray-800 hover:text-indigo-600 transition">
              QuizEarn
            </Link>. Learn. Quiz. Earn. Repeat.
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-4 rounded-full 
                     bg-gradient-to-r from-indigo-600 to-purple-600 
                     text-white shadow-lg hover:shadow-2xl 
                     hover:scale-110 active:scale-100 
                     transition-all duration-300 ease-in-out 
                     z-50"
          title="Back to Top"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default Footer;