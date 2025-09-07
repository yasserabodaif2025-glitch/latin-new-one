'use client'

import * as React from 'react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface UploadImageProps {
  images?: string[]
  onImagesChange?: (images: string[]) => void
  onUpload?: (files: File[]) => void
  maxFiles?: number
  className?: string
  dir?: 'ltr' | 'rtl'
}

export function UploadImage({
  images: initialImages = [],
  onImagesChange,
  onUpload,
  maxFiles = 5,
  className,
  dir = 'ltr',
}: UploadImageProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [previewImages, setPreviewImages] = useState<string[]>(initialImages)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length + images.length > maxFiles) {
        alert(`You can only upload up to ${maxFiles} images`)
        return
      }

      const newImages = acceptedFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
      setPreviewImages((prev) => [...prev, ...newImages])
      onImagesChange?.(newImages)
      onUpload?.(acceptedFiles)
    },
    [images, maxFiles, onImagesChange, onUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxFiles: maxFiles - images.length,
  })

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    onImagesChange?.(images.filter((_, i) => i !== index))

    // If we're in the preview dialog, handle the image removal
    if (selectedImageIndex !== null) {
      if (selectedImageIndex === index) {
        // If we're removing the current image, close the dialog
        setSelectedImageIndex(null)
      } else if (selectedImageIndex > index) {
        // If we're removing an image before the current one, adjust the index
        setSelectedImageIndex(selectedImageIndex - 1)
      }
    }
  }

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < previewImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  return (
    <div className={cn('space-y-4', className)} dir={dir}>
      <div
        {...getRootProps()}
        className={cn(
          'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive ? 'Drop the images here' : 'Drag & drop images here, or click to select'}
          </p>
          <p className="text-xs text-muted-foreground">
            {images.length}/{maxFiles} images
          </p>
        </div>
      </div>

      {previewImages.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {previewImages.map((image, index) => (
            <div
              key={index}
              className="group relative aspect-square h-20 w-20 overflow-hidden rounded-lg md:h-28 md:w-28"
            >
              <Image
                src={image}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={selectedImageIndex !== null}
        onOpenChange={(open) => !open && setSelectedImageIndex(null)}
      >
        <DialogContent className="">
          <DialogHeader className="!p-6">
            <DialogTitle className="text-center text-lg">
              Image {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} of{' '}
              {previewImages.length}
            </DialogTitle>
          </DialogHeader>
          {selectedImageIndex !== null && (
            <div className="relative aspect-square w-full p-6">
              <Image
                src={previewImages[selectedImageIndex]}
                alt={`Preview ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-between px-8">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={dir === 'rtl' ? handleNext : handlePrevious}
                  disabled={
                    dir === 'rtl'
                      ? selectedImageIndex === previewImages.length - 1
                      : selectedImageIndex === 0
                  }
                  className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-lg hover:bg-background/90"
                >
                  {dir === 'rtl' ? (
                    <ChevronRight className="h-6 w-6" />
                  ) : (
                    <ChevronLeft className="h-6 w-6" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={dir === 'rtl' ? handlePrevious : handleNext}
                  disabled={
                    dir === 'rtl'
                      ? selectedImageIndex === 0
                      : selectedImageIndex === previewImages.length - 1
                  }
                  className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                >
                  {dir === 'rtl' ? (
                    <ChevronLeft className="h-6 w-6" />
                  ) : (
                    <ChevronRight className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
