import React from 'react'

export const ImageBlockComponent: React.FC<any> = ({ image, caption, size, alignment }) => {
  const sizeClass =
    size === 'small' ? 'w-1/4' : size === 'medium' ? 'w-1/2' : size === 'large' ? 'w-3/4' : 'w-full'
  const alignClass =
    alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'

  return (
    <div className={`image-block ${alignClass}`}>
      {image && <img src={image.url} alt={image.alt || ''} className={`${sizeClass} mx-auto`} />}
      {caption && <p className="caption">{caption}</p>}
    </div>
  )
}

export default ImageBlockComponent
