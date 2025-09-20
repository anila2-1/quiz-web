// src/collections/Blogs.ts
import { CollectionConfig } from 'payload'
import { slugField } from '../fields/slugField'
import { isAdmin } from '../access/isAdmin'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'updatedAt'],
    group: 'Content',
    preview: (doc) => {
      return `${process.env.NEXT_PUBLIC_SERVER_URL}/api/preview?url=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/${doc.slug}`,
      )}`
    },
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    readVersions: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      admin: {
        description: 'Title of Blog post ',
      },
    },
    slugField,
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
      admin: {
        description:
          'The main content of your blog post. Supports rich formatting, lists, images, etc.',
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => defaultFeatures,
      }),
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Category',
      required: true,
      hasMany: false,
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
        description: 'blog related quizzes',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          admin: { description: 'Leave blank to auto-generate from title' },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          admin: { description: 'Leave blank to auto-generate from excerpt' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image (1200x630)',
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Log who created/updated
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
