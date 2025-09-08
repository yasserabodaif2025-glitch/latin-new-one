import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error500() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-destructive">500</h1>
        <h2 className="text-2xl font-semibold">Server Error</h2>
        <p className="text-muted-foreground">
          Sorry, something went wrong. Please try again later.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
