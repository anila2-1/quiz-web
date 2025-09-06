// src/collections/Pages.ts
import { CollectionConfig } from 'payload';
import Hero from '../blocks/Hero';
// import RichTextBlock from '../blocks/RichTextBlock';
// import ImageBlock from '../blocks/ImageBlock';

const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [Hero],
    },
  ],
};

export default Pages;