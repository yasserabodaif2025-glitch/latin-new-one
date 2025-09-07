'use client'

import { useEffect } from 'react'

interface HTMLAttributesProps {
  locale: string
}

export function HTMLAttributes({ locale }: HTMLAttributesProps) {
  useEffect(() => {
    // Set language and direction attributes
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  return null
}
