// src/app/(frontend)/blog/BlogListClient.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BlogGrid from './BlogGrid'
import Footer from '../components/Footer'

interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  image?: { url: string }
  category?: {
    title: string
    color?: string
  }
}

interface BlogResponse {
  docs: Blog[]
  totalPages: number
  page: number
}

export default function BlogListClient({ initialPage = 1 }: { initialPage?: number }) {
  const [posts, setPosts] = useState<Blog[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogs = async (page: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs?where[status][equals]=published&sort=-createdAt&page=${page}&limit=6`,
        {
          // No caching — fresh data on client
        },
      )
      if (!res.ok) throw new Error('Failed to fetch blogs')
      const data: BlogResponse = await res.json()
      setPosts(data.docs)
      setTotalPages(data.totalPages)
      setCurrentPage(page)
    } catch (err: any) {
      console.error('Fetch blogs error:', err)
      setError('Failed to load blogs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs(initialPage)
  }, [initialPage])

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        {/* Blog Grid Skeleton - EXACTLY like CategoryLoading */}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">Oops! Something went wrong.</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => fetchBlogs(currentPage)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Retry
        </button>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <BlogGrid posts={posts} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-3">
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                onClick={(e) => {
                  e.preventDefault()
                  fetchBlogs(currentPage - 1)
                }}
              >
                ← Prev
              </Link>
            )}

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchBlogs(page)}
                  className={`px-4 py-2 rounded-lg transition ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {currentPage < totalPages && (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                onClick={(e) => {
                  e.preventDefault()
                  fetchBlogs(currentPage + 1)
                }}
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
