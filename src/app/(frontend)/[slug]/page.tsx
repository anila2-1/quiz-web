// src/app/(frontend)/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getBlogBySlug } from '../../../lib/getBlogBySlug'
import Footer from '../components/Footer'
import { BlogClient } from './BlogClient'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage({ params }: Props) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  //  Fetch category
  let category = null
  if (blog.category?.id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories/${blog.category.id}?depth=1`,
        { next: { revalidate: 3600 } },
      )
      if (res.ok) {
        category = await res.json()
      }
    } catch (error) {
      console.error('Error fetching category:', error)
    }
  }

  //  Fetch related blogs on server
  let relatedBlogs = []
  if (category?.id && blog.id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs?where[category][equals][id]=${category.id}&limit=6&depth=1`,
        { next: { revalidate: 3600 } },
      )
      if (res.ok) {
        const data = await res.json()
        relatedBlogs = data.docs.filter((b: any) => b.id !== blog.id)
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error)
    }
  }

  return (
    <div>
      {/* Preload critical images */}
      {blog.image?.url && (
        <link
          rel="preload"
          as="image"
          href={`${process.env.NEXT_PUBLIC_SERVER_URL}${blog.image.url}`}
        />
      )}
      <BlogClient
        initialBlog={blog}
        initialCategory={category}
        initialRelatedBlogs={relatedBlogs}
      />
      <Footer />
    </div>
  )
}
