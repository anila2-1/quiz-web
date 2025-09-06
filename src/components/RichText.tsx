// src/components/RichText.tsx
import React from 'react'

interface Props {
  content: any // Can be string, array, or object
}

export const RichText: React.FC<Props> = ({ content }) => {
  if (!content) return <p className="text-gray-500">No content available</p>

  // Case 1: String (HTML)
  if (typeof content === 'string') {
    return (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // Case 2: Array (Lexical blocks)
  if (Array.isArray(content)) {
    return (
      <>
        {content.map((node, i) => {
          switch (node.type) {
            case 'paragraph':
              return (
                <p key={i} className="mb-4">
                  {node.children?.map((child: any, index: number) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: child.bold ? 'bold' : 'normal',
                        fontStyle: child.italic ? 'italic' : 'normal',
                        textDecoration: child.underline ? 'underline' : 'none',
                      }}
                    >
                      {child.text}
                    </span>
                  ))}
                </p>
              )

            case 'h1':
              return (
                <h1 key={i} className="text-3xl font-bold mt-6 mb-4">
                  {node.children?.map((child: any, index: number) => <span key={index}>{child.text}</span>)}
                </h1>
              )

            default:
              return (
                <p key={i} className="text-gray-500">
                  Unsupported block: {node.type}
                </p>
              )
          }
        })}
      </>
    )
  }

  // Case 3: Object (JSON format like your API)
  if (typeof content === 'object' && content.root && content.root.children) {
    return (
      <div className="prose max-w-none">
        {content.root.children.map((paragraph: any, i: number) => {
          if (paragraph.type === 'paragraph') {
            return (
              <p key={i} className="mb-4">
                {paragraph.children?.map((child: any, index: number) => (
                  <span key={index}>
                    {child.text}
                  </span>
                ))}
              </p>
            )
          }
          return null
        })}
      </div>
    )
  }

  // Fallback
  return <p className="text-red-500">Invalid content format</p>
}

export default RichText