// src/blocks/RichTextBlock.ts
import { Block } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      // editor: lexicalEditor,
      required: true,
    },
  ],
};

export default RichTextBlock;