import React from 'react'

import RichText from '@/components/RichText'

export const RichTextBlockComponent: React.FC<any> = ({ content }) => {
  return <div>{content && <RichText data={content} enableGutter={false} />}</div>
}

export default RichTextBlockComponent
