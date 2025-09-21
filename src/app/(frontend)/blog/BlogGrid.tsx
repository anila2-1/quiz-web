// src/app/(frontend)/blog/BlogGrid.tsx
import Link from 'next/link'
import AnimatedBlogCard from './AnimatedBlogCard'

export default function BlogGrid({ posts }: { posts: any[] }) {
  return (
    <div className="container mx-auto px-6 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Link key={post.id} href={`/${post.slug}`} className="block h-full">
              <AnimatedBlogCard post={post} />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-700">No blogs available.</h3>
            <p className="text-gray-500 mt-2">Check back later for new content!</p>
          </div>
        )}
      </div>
    </div>
  )
}
