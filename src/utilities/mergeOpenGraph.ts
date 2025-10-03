import type { Metadata } from 'next'

type OpenGraph = Metadata['openGraph']

export const mergeOpenGraph = (og?: OpenGraph): OpenGraph => {
  return {
    ...og,
    siteName: 'Learn & Earn Quiz Platform',
    images: og?.images ? og.images : [],
  }
}
