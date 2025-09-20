import Link from 'next/link'
import type { Blog } from '@/payload-types'

export const CollectionArchive: React.FC<{ posts: Blog[] }> = ({ posts }) => {
  return (
    <div className="container mx-auto px-6 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              {post.image && typeof post.image === 'object' && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}${post.image.url}`}
                    alt={post.title || 'Blog Image'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {post.category && (
                <div className="mb-3 p-6 pt-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {typeof post.category === 'object' ? post.category.title : post.category}
                  </span>
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <Link
                  href={`/${post.slug}`}
                  className="inline-block px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg"
                >
                  Read More →
                </Link>
              </div>
            </div>
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
