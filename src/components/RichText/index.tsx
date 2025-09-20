// src/components/RichText.tsx
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import MediaBlock from './../../blocks/MediaBlock/Component'
// Define missing types locally since blocks are not registered in payload config
type BannerBlockProps = {
  style: 'info' | 'warning' | 'error' | 'success'
  content: any // RichText content
  id?: string
  blockName?: string
  blockType: 'banner'
}

type CTABlockProps = {
  richText: any // RichText content
  links?: any[] // From linkGroup
  id?: string
  blockName?: string
  blockType: 'cta'
}

type MediaBlockProps = {
  resource: {
    url: string
    alt?: string
    filename?: string
  }
  className?: string
  imgClassName?: string
}

// Simple class name utility
const cn = (...args: (string | boolean | Record<string, boolean> | undefined)[]): string => {
  const classes: string[] = []
  for (const arg of args) {
    if (typeof arg === 'string') {
      classes.push(arg)
    } else if (typeof arg === 'object' && arg !== null) {
      for (const key in arg) {
        if (arg[key]) {
          classes.push(key)
        }
      }
    }
  }
  return classes.join(' ')
}

// Define SerializedImageNode type for image rendering
type SerializedImageNode = {
  type: string
  fields?: {
    image?: {
      url?: string
      src?: string
    }
    altText?: string
    caption?: string
    [x: string]: any
  }
  [key: string]: any
}

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),

  // 🖼️ STYLISH IMAGE RENDERING - CENTERED
  image: ({ node }) => {
    const imgNode = node as SerializedImageNode
    let src = ''
    let alt = 'Image'
    let caption = ''

    const fields = imgNode.fields || {}

    // Get image URL from either `image.url` or `image.src`
    if (fields.image) {
      src = fields.image.url || fields.image.src || ''
    }

    alt = fields.altText || 'Image'
    caption = fields.caption || ''

    if (!src) return null

    // Default width & height
    const width = fields.width || 800
    const height = fields.height || 600

    // Alignment logic
    const align = fields.alignment || 'center'

    const containerClass = cn('flex justify-center my-8', {
      'justify-start': align === 'left',
      'justify-end': align === 'right',
      'justify-center': align === 'center',
    })

    return (
      <div className={containerClass}>
        <figure className="group max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02]">
            <img
              src={src}
              alt={alt}
              className="w-full h-auto object-cover max-h-[600px] transition-opacity duration-300 group-hover:opacity-95"
              style={{
                maxWidth: `${width}px`,
                maxHeight: `${height}px`,
              }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          {caption && (
            <figcaption className="mt-3 text-center text-sm text-gray-600 font-medium italic">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>
    )
  },

  // 🎨 Override specific converters for better styling
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const tag = (node as any).tag

    switch (tag) {
      case 'h1':
        return (
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 mt-10 text-gray-900 leading-tight">
            {children}
          </h1>
        )
      case 'h2':
        return (
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 mt-8 text-gray-900 border-b border-gray-200 pb-2">
            {children}
          </h2>
        )
      case 'h3':
        return (
          <h3 className="text-2xl sm:text-3xl font-semibold mb-4 mt-6 text-gray-800">{children}</h3>
        )
      case 'h4':
        return <h4 className="text-xl font-semibold mb-3 mt-5 text-gray-800">{children}</h4>
      case 'h5':
        return <h5 className="text-lg font-medium mb-2 mt-4 text-gray-700">{children}</h5>
      case 'h6':
        return <h6 className="text-base font-medium mb-2 mt-3 text-gray-700">{children}</h6>
      default:
        return (
          <h2 className="text-3xl font-bold mb-5 mt-8 text-gray-900 border-b border-gray-200 pb-2">
            {children}
          </h2>
        )
    }
  },

  list: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const listNode = node as any

    const isOrderedList =
      listNode.listType === 'number' ||
      listNode.listType === 'ordered' ||
      listNode.tag === 'ol' ||
      listNode.type === 'numberedlist' ||
      listNode.ordered === true

    const className = isOrderedList
      ? 'list-decimal list-outside mb-6 space-y-3 text-gray-800 pl-8 marker:text-indigo-600'
      : 'list-disc list-outside mb-6 space-y-3 text-gray-800 pl-8 marker:text-indigo-600'

    return isOrderedList ? (
      <ol className={className}>{children}</ol>
    ) : (
      <ul className={className}>{children}</ul>
    )
  },

  listitem: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return <li className="text-gray-700 leading-relaxed">{children}</li>
  },

  code: ({ node }) => {
    const text = (node as any).text || (node as any).children?.[0]?.text || ''
    return (
      <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono border border-gray-200">
        {text}
      </code>
    )
  },

  codeblock: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    return (
      <pre className="bg-gray-900 text-white p-5 rounded-xl overflow-x-auto mb-6 shadow-md">
        <code className="font-mono text-sm leading-relaxed">{children}</code>
      </pre>
    )
  },

  // 🧩 Custom Blocks - CENTERED MEDIA BLOCK
  blocks: {
    banner: ({ node }: { node: SerializedBlockNode<BannerBlockProps> }) => (
      <BannerBlock className="col-start-2 mb-6" {...node.fields} />
    ),
    mediaBlock: ({ node }: { node: SerializedBlockNode<any> }) => {
      // Extract media resource and caption
      const resource = node.fields?.resource
      const caption = node.fields?.caption

      if (!resource?.url) {
        console.warn('MediaBlock: Missing required resource URL')
        return null
      }

      return (
        <div className="flex justify-center my-6">
          <MediaBlock
            content={{
              url: resource.url,
              alt: resource.alt || '',
              caption: caption || '',
            }}
            className="max-w-4xl w-full"
            enableGutter={false}
          />
        </div>
      )
    },
    code: ({ node }: { node: SerializedBlockNode<CodeBlockProps> }) => (
      <CodeBlock className="col-start-2 my-6" {...node.fields} />
    ),
    cta: ({ node }: { node: SerializedBlockNode<CTABlockProps> }) => (
      <CallToActionBlock {...node.fields} />
    ),
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props

  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose prose-lg md:prose-xl dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-ul:space-y-2 prose-ol:space-y-2':
            enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
