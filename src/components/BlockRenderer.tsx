import React from 'react';
import RichText from '../components/RichText';
import Image from 'next/image';

export const getBlockContent = (block: { blockType: any; id: React.Key | null | undefined; theme: string; heading: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; subheading: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; ctaText: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; content: any; alignment: any; size: string; image: { filename: any; }; }) => {
  switch (block.blockType) {
    case 'hero':
      return (
        <div
          key={block.id}
          className={`py-24 text-center bg-${block.theme === 'dark' ? 'gray-900 text-white' : 'gray-50'} `}
        >
          <h1 className="text-5xl font-bold mb-4">{block.heading}</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{block.subheading}</p>
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg">
            {block.ctaText}
          </button>
        </div>
      );

    case 'richText':
      return (
        <div key={block.id} className="py-12 px-4 max-w-4xl mx-auto">
          <RichText content={block.content} />
        </div>
      );

    case 'image':
      return (
        <div
          key={block.id}
          className={`py-8 flex justify-${block.alignment} ${block.size === 'full' ? 'w-full' : 'max-w-4xl mx-auto'}`}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${block.image.filename}`}
            alt="Content Image"
            className={`${block.size === 'small' ? 'w-1/4' : block.size === 'medium' ? 'w-1/2' : block.size === 'large' ? 'w-3/4' : 'w-full'} rounded-lg`}
          />
        </div>
      );

    default:
      return null;
  }
};