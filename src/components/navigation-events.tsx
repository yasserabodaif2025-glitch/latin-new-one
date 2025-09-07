'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

interface NavigationEventsContentProps {
  onStart?: () => void
  onComplete?: () => void
}

function NavigationEventsContent({ onStart, onComplete }: NavigationEventsContentProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    onComplete?.()
    NProgress.done()
    return () => {
      onStart?.()
      NProgress.start()
    }
  }, [pathname, searchParams, onStart, onComplete])

  return null
}

export function NavigationEvents(props: NavigationEventsContentProps) {
  return (
    <Suspense>
      <NavigationEventsContent {...props} />
    </Suspense>
  )
}
