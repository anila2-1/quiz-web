// src/collections/Pages.ts
import { CollectionConfig } from 'payload';
import Hero from '../blocks/Hero';
import RichTextBlock from '../blocks/RichTextBlock';
import ImageBlock from '../blocks/ImageBlock';

const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: () => true, // Sabhi ko read ki ijazat
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Page Title',
      required: true,
      admin: {
        description: 'Page ka title (SEO ke liye important)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'URL ke liye unique identifier (e.g. "about", "contact")',
        position: 'sidebar',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page Layout',
      blocks: [
        Hero,
        RichTextBlock,
        ImageBlock,
      ],
      admin: {
        description: 'Page ke sections ko drag & drop se arrange karein',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Google search result mein dikhne wala title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Search result mein description (160 characters tak)',
          },
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
      async ({ data, operation }) => {
        if (operation === 'create' && !data.slug && data.title) {
          // Auto-generate slug from title
          const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
          return { ...data, slug };
        }
        return data;
      },
    ],
  },
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
  timestamps: true,
};

export default Pages;