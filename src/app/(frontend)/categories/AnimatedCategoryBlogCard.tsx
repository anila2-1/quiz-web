// src/app/categories/AnimatedCategoryBlogCard.tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function AnimatedCategoryBlogCard({ post }: { post: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col"
    >
      {post.image && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post.image.url}`}
            alt={post.title?.toString() || 'Blog Image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-500 hover:scale-110"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}
      <div className="flex-grow p-6 flex flex-col">
        {post.category && (
          <div className="mb-3">
            <span
              className="inline-block px-2 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: post.category.color ? `${post.category.color}20` : '#e0e7ff',
                color: post.category.color || '#4F46E5',
              }}
            >
              {post.category.title}
            </span>
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        <div className="mt-auto">
          <Link href={`/${post.slug}`}>
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer">
              Read More →
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
