// src/app/(frontend)/blog/page.tsx
import BlogListClient from './BlogListClient'
import { generateStaticMetadata } from '@/utilities/generateStaticMetadata'

export const metadata = generateStaticMetadata({
  title: 'Learn & Earn Blog',
  description:
    'Explore insightful articles, tips, and guides to boost your knowledge and earn rewards through quizzes.',
  url: '/blog',
})

export default async function BlogList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const currentPage = parseInt(params?.page || '1', 10)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="relative px-6 py-16 sm:py-20 md:py-24 text-center">
        <h1 className="text-4xl p-2.5 sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight">
          Learn & Earn Blog
        </h1>
        <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insightful articles, tips, and guides to boost your knowledge and earn rewards.
        </p>
      </div>

      <BlogListClient initialPage={currentPage} />
    </div>
  )
}
