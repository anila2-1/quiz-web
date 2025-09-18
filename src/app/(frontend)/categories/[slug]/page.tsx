import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Footer from './../../components/Footer'

import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getCategory(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories?where[slug][equals]=${slug}&depth=1`,
      {
        next: { revalidate: 60 },
      },
    )
    if (!res.ok) throw new Error('Failed to fetch category')
    const data = await res.json()
    return data.docs[0]
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

// ✅ FIXED: Query by category.id inside relationship object
async function getCategoryBlogs(categoryId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs?where[category][equals][id]=${categoryId}&depth=2`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (!res.ok) throw new Error('Failed to fetch blogs')
    const data = await res.json()
    return data.docs
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.title}`,
    description: category.description || `Browse all ${category.title} content`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return notFound()
  }

  const blogs = await getCategoryBlogs(category.id)

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        {/* Category Header */}
        <div className="mb-12 text-center">
          {category.featuredImage && (
            <div className="relative mx-auto mb-8 h-64 w-full max-w-3xl overflow-hidden rounded-2xl">
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}${category.featuredImage.url}`}
                alt={category.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4" style={{ color: category.color || '#4F46E5' }}>
            {category.title}
          </h1>

          {category.description && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{category.description}</p>
          )}
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any) => (
            <Link
              key={blog.id}
              href={`/${blog.slug}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg"
            >
              {/* Blog Image */}
              {blog.image && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}${blog.image.url}`}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600">
                  {blog.title}
                </h2>

                {blog.excerpt && <p className="text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>}

                {/* Category Tag */}
                {blog.category && (
                  <div className="mb-3">
                    <span
                      className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800"
                      style={{
                        backgroundColor: blog.category.color
                          ? `${blog.category.color}20`
                          : '#e0e7ff',
                        color: blog.category.color || '#4F46E5',
                      }}
                    >
                      {blog.category.title}
                    </span>
                  </div>
                )}

                <span className="inline-flex items-center text-sm font-medium text-indigo-600">
                  Read More
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">No blogs found in this category yet.</h3>
          </div>
        )}
      </div>
      {/* ✅ Footer — Outside container, full width */}
      <div className="mt-12 sm:mt-16 md:mt-20">
        <Footer />
      </div>
    </>
  )
}
