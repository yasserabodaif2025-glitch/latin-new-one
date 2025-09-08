'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('common.error500')

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-destructive">500</h1>
        <h2 className="text-2xl font-semibold">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => reset()}>
            {t('tryAgain')}
          </Button>
          <Button asChild>
            <Link href="/">{t('backToHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
