import Image from 'next/image'
import React from 'react'

export const HeroBlock: React.FC<any> = ({
  heading,
  subheading,
  ctaText,
  ctaLink,
  backgroundImage,
  theme,
}) => {
  return (
    <div className={`hero ${theme === 'dark' ? 'dark' : ''}`}>
      {backgroundImage && (
        <Image
          src={backgroundImage.url}
          alt=""
          width={800} // Example: 800px wide
          height={600} // Example: 600px tall
          unoptimized
        />
      )}
      <h1>{heading}</h1>
      {subheading && <p>{subheading}</p>}
      {ctaText && ctaLink && <a href={ctaLink}>{ctaText}</a>}
    </div>
  )
}

export default HeroBlock
