import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<void>
  initialImage?: string
  className?: string
}

export function ImageUploader({ onImageUpload, initialImage, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      try {
        setIsUploading(true)
        // Create a preview URL
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)

        // Upload the file
        await onImageUpload(file)

        // Cleanup preview URL after successful upload
        URL.revokeObjectURL(previewUrl)
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        setIsUploading(false)
      }
    },
    [onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  })

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors hover:border-primary"
      >
        <Input {...getInputProps()} />

        {preview ? (
          <div className="relative h-32 w-32">
            <OptimizedImage src={preview} alt="Preview" fill className="rounded-lg object-cover" />
            <Button
              variant="secondary"
              size="sm"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                setPreview(null)
              }}
            >
              ×
            </Button>
          </div>
        ) : (
          <div className="text-center">
            {isDragActive ? (
              <p className="text-sm text-muted-foreground">Drop the file here</p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Drag & drop an image, or click to select
                </p>
                <p className="text-xs text-muted-foreground">Maximum file size: 5MB</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
