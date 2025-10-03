// src/app/(frontend)/dashboard/takoz/TakeQuizListClient.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

export default function TakeQuizListClient() {
  const [articles, setArticles] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  // Fetch categories (once)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories?depth=0`)
        const data = await res.json()
        setCategories(
          (data.docs || []).map((cat: any) => ({
            id: cat.id,
            name: cat.title || cat.name,
            slug: cat.slug,
          })),
        )
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch incomplete articles
  useEffect(() => {
    const fetchIncompleteArticles = async () => {
      setLoading(true)
      try {
        // Get member_id from cookies (client-side)
        const memberId =
          typeof window !== 'undefined'
            ? document.cookie
                .split('; ')
                .find((row) => row.startsWith('member_id='))
                ?.split('=')[1]
            : null

        if (!memberId) {
          console.warn('No member_id cookie found')
          setArticles([])
          setLoading(false)
          return
        }

        const res = await fetch('/api/get-incomplete-articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId,
            searchTerm,
            categorySlug: selectedCategorySlug,
            page: currentPage,
            limit: itemsPerPage,
          }),
        })

        const data = await res.json()
        if (res.ok) {
          setArticles(data.articles || [])
        } else {
          console.error('API Error:', data.error)
          setArticles([])
        }
      } catch (error) {
        console.error('Failed to fetch incomplete articles:', error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchIncompleteArticles()
  }, [searchTerm, selectedCategorySlug, currentPage])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 sm:p-6 md:ml-64 flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6 mx-auto"></div>
            <p className="text-xl font-semibold text-gray-700">Loading...</p>
            <p className="text-sm text-gray-500 mt-2">Almost there — just a moment please 😊</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 sm:p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            📝 TakeQuiz: Incomplete Articles
          </h1>
          <p className="text-gray-600 mb-8">
            Complete these articles to earn points and unlock rewards.
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by title, category, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={selectedCategorySlug || ''}
              onChange={(e) => setSelectedCategorySlug(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            {(searchTerm || selectedCategorySlug) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategorySlug(null)
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Article List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.length > 0 ? (
              articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="block p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{article.title}</h3>
                  {article.category?.title && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                      {article.category.title}
                    </span>
                  )}
                  <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{article.readTime} min read</span>
                    <span>
                      ✅ {article.completedQuizzes || 0}/{article.totalQuizzes} quizzes
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                No incomplete articles found. 🎉 You’ve completed them all!
              </div>
            )}
          </div>

          {/* Pagination */}
          {articles.length === itemsPerPage && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-1 bg-indigo-600 text-white rounded-lg">
                Page {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 mx-1 bg-gray-200 text-gray-700 rounded-lg"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
