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
      {backgroundImage && <img src={backgroundImage.url} alt="" />}
      <h1>{heading}</h1>
      {subheading && <p>{subheading}</p>}
      {ctaText && ctaLink && <a href={ctaLink}>{ctaText}</a>}
    </div>
  )
}

export default HeroBlock
