import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getBlogBySlug } from '../../../../lib/getBlogBySlug';
import { BlogClient } from './BlogClient'; // ← Client component

type Props = {
  params: Promise<{ slug: string }>;
};

// ✅ SEO: Dynamic Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const imageUrl = blog.image?.url
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${blog.image.url}`
    : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/og?title=${encodeURIComponent(blog.title)}`;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${blog.slug}`;

  return {
    title: blog.seo?.title || blog.title,
    description: blog.seo?.description || blog.excerpt?.substring(0, 160),
    openGraph: {
      title: blog.seo?.title || blog.title,
      description: blog.seo?.description || blog.excerpt?.substring(0, 160),
      images: [imageUrl],
      url: canonicalUrl,
      type: 'article',
      publishedTime: blog.createdAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seo?.title || blog.title,
      description: blog.seo?.description || blog.excerpt?.substring(0, 160),
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// ✅ Server Component: Fetch data and pass to client
export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return <BlogClient initialBlog={blog} />;
}