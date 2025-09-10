// src/components/ProfileForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import  {Member}  from './../payload-types';


export default function ProfileForm({ member }: { member: Member }) {
  const [name, setName] = useState<string>(member.name || '');
  const [username] = useState<string>(member.username || '');
  const [walletAddress, setWalletAddress] = useState<string>(member.walletAddress || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, walletAddress }),
    });

      if (res.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const json = await res.json();
        throw new Error(json.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setMessage(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
  
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="bg-white/90 w-full ms-20 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl relative"
    >
      
      {/* Message Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 text-sm rounded-xl border ${
            message.includes('successfully') || message.includes('success')
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {message}
        </motion.div>
      )}
        

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={member.email}
            disabled
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-500 dark:text-gray-400 cursor-not-allowed select-none"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={username}
            // onChange={(e) => setUsername(e.target.value)}
            disabled
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Choose a username"
          />
        </div>

        {/* Wallet Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Wallet Address (USDT / Crypto)
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="your@upi or wallet address"
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow hover:shadow-lg disabled:opacity-70"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              fetch('/api/auth/logout', { method: 'POST' }).then(() => {
                window.location.href = '/';
              });
            }
          }}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl shadow hover:shadow-lg"
        >
          Logout
        </motion.button>
      </div>
    </motion.form>
  );
}