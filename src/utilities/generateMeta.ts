import type { Metadata } from 'next'
import type { Media, Page, Blog } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

interface DocumentWithMeta {
  meta?: {
    title?: string
    description?: string
    image?: Media | string | null
  }
  slug?: string | string[]
}

const hasMeta = (doc: unknown): doc is DocumentWithMeta => {
  return doc != null && typeof doc === 'object' && 'meta' in doc
}

const getImageURL = (image?: Media | string | null) => {
  const serverUrl = getServerSideURL()
  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    url = serverUrl + image.url
  }
  // If image is a string (e.g., direct URL), you could handle it here if needed
  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Blog> | null
}): Promise<Metadata> => {
  const { doc } = args

  const baseTitle = 'Learn & Earn Quiz Platform'
  let title = baseTitle
  let description: string | undefined = undefined
  let slug: string = '/'

  if (hasMeta(doc)) {
    if (doc.meta?.title) {
      title = `${doc.meta.title} | ${baseTitle}`
    }
    description = doc.meta?.description
    if (doc.slug) {
      slug = Array.isArray(doc.slug) ? doc.slug.join('/') : String(doc.slug)
    }
  }

  const ogImage = hasMeta(doc) ? getImageURL(doc.meta?.image) : undefined

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      description: description || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      url: slug,
    }),
  }
}
