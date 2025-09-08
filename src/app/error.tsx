'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-destructive">500</h1>
        <h2 className="text-2xl font-semibold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          Sorry, we are having some technical issues. Please try again later.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => reset()}>
            Try Again
          </Button>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
