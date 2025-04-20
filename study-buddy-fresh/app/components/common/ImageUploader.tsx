import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<void>
  accept?: string
  maxSize?: number
  disabled?: boolean
}

export function ImageUploader({ 
  onUpload, 
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024,
  disabled = false 
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && validateFile(file)) {
      await onUpload(file)
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) {
      await onUpload(file)
    }
  }

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return false
    }
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / 1024 / 1024}MB`)
      return false
    }
    return true
  }

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 text-center 
        ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
      />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2">Drag and drop an image, or click to select</p>
      <p className="text-sm text-gray-500">PNG, JPG up to {maxSize / 1024 / 1024}MB</p>
    </div>
  )
} 
