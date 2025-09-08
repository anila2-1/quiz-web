import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { RichText } from '@/components/RichText';
import { getBlockContent } from '@/components/BlockRenderer';

async function getPageBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) return null;
  const json = await res.json();
  return json.docs?.[0] || null;
}

type Props = {
  params: Promise<{ slug: string }>; // ✅ Make params a Promise
};

// ✅ Await params before using
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ✅ Await here
  const page = await getPageBySlug(slug);

  if (!page) return { title: 'Page Not Found' };

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description,
      images: page.seo?.image
        ? [`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${page.seo.image.filename}`]
        : [],
    },
  };
}

// ✅ Await params in component too
export default async function CustomPage({ params }: Props) {
  const { slug } = await params; // ✅ Await here
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12 px-4 max-w-6xl mx-auto">
      <h1 className="sr-only">{page.title}</h1>
      {page.layout?.map((block: { blockType: any; id: React.Key | null | undefined; theme: string; heading: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; subheading: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; ctaText: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; content: any; alignment: any; size: string; image: { filename: any; }; }) => getBlockContent(block))}
    </div>
  );
}