// src/collections/Blogs.ts

import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'
import { seoFields } from '../fields/seoFields'
import { generateSlug } from '../hooks/generateSlug'

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
    group: 'Content',
    preview: (doc) => {
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/blog/${doc.slug}`,
      )}`
    },
  },
  access: {
    // Sabhi ko read ki ijazat
    read: () => true,

    // Sirf w1techy8@gmail.com create, update, delete kar sake
    create: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
    update: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
    delete: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
    readVersions: ({ req }) => req.user?.email === 'w1techy8@gmail.com',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      admin: {
        description: 'Blog post ka title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'Slug',
      admin: {
        description: 'Unique identifier for the blog post',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Excerpt',
      maxLength: 200,
      admin: {
        description: 'Short summary shown in blog list',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Technology', value: 'technology' },
        { label: 'Finance', value: 'finance' },
        { label: 'Health', value: 'health' },
        { label: 'Education', value: 'education' },
        { label: 'Lifestyle', value: 'lifestyle' },
      ],
      defaultValue: 'education',
    },
    {
  name: 'status',
  type: 'select',
  defaultValue: 'draft',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
},
    {
      name: 'quizzes',
      type: 'relationship',
      relationTo: 'quizzes',
      hasMany: true,
      admin: {
        description: 'Is blog se related quizzes',
      },
    },

  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Optional: Log who created/updated
        if (operation === 'create') {
          req.payload.logger.info(`Blog created by: ${req.user?.email}`)
        }
        return data
      },
    ],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  timestamps: true,
}

export default Blogs