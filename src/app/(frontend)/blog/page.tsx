// src/app/(frontend)/blog/page.tsx
import { Metadata } from 'next'
import BlogGrid from './BlogGrid'
import Footer from '../components/Footer'
import Link from 'next/link'

// ✅ SEO metadata
export const metadata: Metadata = {
  title: 'Learn & Earn Blog | Discover Articles & Earn Rewards',
  description:
    'Explore insightful articles, tips, and guides to boost your knowledge and earn rewards through quizzes.',
}

async function fetchBlogs(page: number = 1, limit: number = 6) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs?where[status][equals]=published&sort=-createdAt&page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
      },
    )
    if (!res.ok) throw new Error('Failed to fetch blogs')
    return res.json()
  } catch (error) {
    console.error('Fetch blogs error:', error)
    return { docs: [], totalPages: 0, page: 1 }
  }
}

export default async function BlogList({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = parseInt(searchParams?.page || '1', 10)
  const limit = 6 // ✅ number of blogs per page
  const { docs: posts, totalPages } = await fetchBlogs(currentPage, limit)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative px-6 py-16 sm:py-20 md:py-24 text-center">
        <h1 className="text-4xl p-2.5 sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight">
          Learn & Earn Blog
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insightful articles, tips, and guides to boost your knowledge and earn rewards.
        </p>
      </div>

      {/* Blog Posts */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <BlogGrid posts={posts} />

        {/* ✅ Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-3">
            {/* Prev Button */}
            {currentPage > 1 && (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                ← Prev
              </Link>
            )}

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blog?page=${page}`}
                  className={`px-4 py-2 rounded-lg transition ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>

            {/* Next Button */}
            {currentPage < totalPages && (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
