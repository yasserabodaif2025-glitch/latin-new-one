'use client'

import { useState } from 'react'
import { NavigationEvents } from '@/components/navigation-events'
import { LoadingSpinner } from './ui/loading-spinner'

export function NavigationLoader() {
  const [loading, setLoading] = useState(false)

  return (
    <>
      <NavigationEvents onStart={() => setLoading(true)} onComplete={() => setLoading(false)} />
      {loading && <LoadingSpinner />}
    </>
  )
}
