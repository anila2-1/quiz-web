import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link' // Update this path if the Link component is located elsewhere, e.g. './Link' or '../components/Link'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <div className="container">
      <div
        className="bg-white rounded p-4 flex flex-col gap-8 
      md:flex-row md:justify-center md:items-center"
      >
        <div className="max-w-[48rem] flex items-center">
          {richText && <RichText className="mb-0" data={richText} enableGutter={false} />}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            const { appearance, ...rest } = link
            return <CMSLink key={i} size="lg" appearance={appearance || undefined} {...rest} />
          })}
        </div>
      </div>
    </div>
  )
}
