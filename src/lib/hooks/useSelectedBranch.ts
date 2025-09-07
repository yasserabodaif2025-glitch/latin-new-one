'use client'

import { useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = 'defaultBranchId'
const COOKIE_KEY = 'defaultBranchId'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

export const useSelectedBranch = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)

  useEffect(() => {
    // Initial load
    const updateBranchId = () => {
      const local = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null
      const cookie = getCookie(COOKIE_KEY)
      
      const newBranchId = local ? parseInt(local) : cookie ? parseInt(cookie) : null
      
      console.log('🔄 Branch ID updated:', {
        localStorage: local,
        cookie: cookie,
        newBranchId: newBranchId,
        previousBranchId: selectedBranchId
      })
      
      setSelectedBranchId(newBranchId)
    }

    updateBranchId()

    // Listen for storage changes (when branch is changed in another tab or component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        console.log('📡 Storage change detected for branch:', e.newValue)
        updateBranchId()
      }
    }

    // Listen for custom events (when branch is changed in same tab)
    const handleBranchChange = () => {
      console.log('📡 Custom branch change event detected')
      updateBranchId()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('branchChanged', handleBranchChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('branchChanged', handleBranchChange)
    }
  }, [selectedBranchId])

  return selectedBranchId
}
