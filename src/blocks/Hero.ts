// src/blocks/Hero.ts
import { Block } from 'payload'
const Hero: Block = {
  slug: 'hero',
  labels: { // ✅ Correct: plural 'labels'
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Welcome to Our Site',
    },
    {
      name: 'subheading',
      type: 'textarea',
      defaultValue: 'This is a beautiful hero section with a call to action.',
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Call to Action Text',
      defaultValue: 'Get Started',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Call to Action Link',
      defaultValue: '/dashboard',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        description: 'Optional background image for the hero section',
      },
    },
    {
      name: 'theme',
      type: 'select',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
      defaultValue: 'light',
      admin: {
        description: 'Choose the color theme',
      },
    },
  ],
};

export default Hero; // ✅ Default export