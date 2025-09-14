// src/app/(frontend)/blog/BlogGrid.tsx
'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function BlogGrid({ posts }: { posts: any[] }) {
  return (
    <div className="container mx-auto px-6 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden transition-all duration-300 hover:shadow-2xl"
              >
                {post.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post.image.url}`}
                      alt={post.title?.toString() || 'Blog Image'}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link
                    href={`/${post.slug}`}
                    className="inline-block px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all duration-300 transform hover:scale-105"
                  >
                    Read More →
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-semibold text-gray-700">No blogs available.</h3>
              <p className="text-gray-500 mt-2">Check back later for new content!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
