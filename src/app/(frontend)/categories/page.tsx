import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Footer from '../components/Footer'
import Image from 'next/image'

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories?depth=1`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error('Failed to fetch categories')

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { docs: [] }
  }
}

export const metadata: Metadata = {
  title: 'Categories',
  description: 'Browse all our learning categories',
}

export default async function CategoriesPage() {
  const { docs: categories } = await getCategories()

  if (!categories?.length) {
    return notFound()
  }

  return (
    <>
      {/* ✅ Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="relative px-4 py-8 sm:py-10 md:py-12 text-center">
          <h1 className="text-4xl p-2.5 sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 tracking-tight">
            Categories
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg"
            >
              {/* Featured Image */}
              {category.featuredImage && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${category.featuredImage.filename}`}
                    alt={category.title}
                    width={800} // Example: 800px wide
                    height={600} // Example: 600px tall
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h2
                  className="text-2xl font-semibold mb-2"
                  style={{ color: category.color || '#4F46E5' }}
                >
                  {category.title}
                </h2>

                {category.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                )}

                <span
                  className="inline-flex items-center text-sm font-medium transition-colors"
                  style={{ color: category.color || '#4F46E5' }}
                >
                  Browse Category
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
      </div>

      {/* ✅ Footer — Outside container, full width */}
      <div className="mt-12 sm:mt-16 md:mt-20">
        <Footer />
      </div>
    </>
  )
}
