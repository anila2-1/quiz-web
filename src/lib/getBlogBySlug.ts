export async function getBlogBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs?where[slug][equals]=${encodeURIComponent(
      slug
    )}&depth=2`,
    {
      next: { tags: ['blog', `blog-${slug}`], revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json.docs?.[0] || null;
}