import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import RichText from '@/components/RichText'
import Image from 'next/image'

import type { Blog } from '@/payload-types'

import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type RelatedPostsProps = {
  className?: string
  docs?: Blog[]
  introContent?: SerializedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className, 'mb-16 mt-16')}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 justify-between rounded-lg">
        {docs?.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
          >
            {doc.image && typeof doc.image === 'object' && (
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}${doc.image.url}`}
                  alt={doc.title || 'Blog Image'}
                  width={800} // Example: 800px wide
                  height={600} // Example: 600px tall
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {doc.category && (
              <div className="mb-3 p-6 pt-4">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                  {typeof doc.category === 'object' ? doc.category.title : doc.category}
                </span>
              </div>
            )}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{doc.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{doc.excerpt}</p>
              <Link
                href={`/${doc.slug}`}
                className="inline-block px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
