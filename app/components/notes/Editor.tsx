import * as React from 'react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface EditorProps {
  content: string
  readOnly?: boolean
  mobileOptimized?: boolean
  onChange?: (content: string) => void
}

export function Editor({
  content,
  readOnly = true,
  mobileOptimized = false,
  onChange
}: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div
      ref={editorRef}
      contentEditable={!readOnly}
      onInput={handleInput}
      className={cn(
        'prose max-w-none focus:outline-none',
        mobileOptimized && 'text-base',
        readOnly && 'cursor-default'
      )}
    />
  )
} 