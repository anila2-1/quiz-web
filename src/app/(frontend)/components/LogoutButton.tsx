// src/app/(frontend)/components/LogoutButton.tsx
'use client';

import { motion } from 'framer-motion';

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
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
  );
}