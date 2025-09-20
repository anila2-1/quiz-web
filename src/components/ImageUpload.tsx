import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'

interface ImageUploadProps {
  onUpload: (file: File) => void
  className?: string
  maxSize?: number // in MB
  aspectRatio?: string
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  className = '',
  maxSize = 5,
  aspectRatio = '16/9',
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File is too large. Max size is ${maxSize}MB.`)
          return
        }
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file.')
          return
        }
        onUpload(file)
      }
    },
    [onUpload, maxSize],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer ${className}`}
      style={{ aspectRatio }}
    >
      <input {...getInputProps()} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
        {isDragActive ? (
          <p className="text-sm text-gray-500">Drop your image here...</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-600">Click or drag image to upload</p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPG, GIF up to {maxSize}MB</p>
          </>
        )}
      </div>
    </div>
  )
}
