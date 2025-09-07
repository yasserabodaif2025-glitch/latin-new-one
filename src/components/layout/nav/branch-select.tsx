'use client'

import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { useBranches } from '@/app/[locale]/branches/(components)/useBranches'
import { IBranch } from '@/app/[locale]/branches/(components)/branch.interface'

const LOCAL_STORAGE_KEY = 'defaultBranchId'
const COOKIE_KEY = 'defaultBranchId'

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

function getCookie(name: string): string | null {
  return (
    document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='))
      ?.split('=')[1] || null
  )
}

export const BranchSelect = () => {
  const branches = useBranches()
  const [selected, setSelected] = useState<string | undefined>(undefined)

  console.log('🏢 Branch Select Debug:', {
    branchesCount: branches?.length || 0,
    branches: branches?.map(b => ({ id: b.id, name: b.name })) || [],
    selectedBranch: selected
  })

  useEffect(() => {
    // Check localStorage and cookies for saved branch
    const local = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null
    const cookie = typeof document !== 'undefined' ? getCookie(COOKIE_KEY) : null
    
    console.log('🔍 Branch Select Storage Check:', {
      localStorage: local,
      cookie: cookie,
      branchesLoaded: branches?.length > 0
    })
    
    if (local) setSelected(local)
    else if (cookie) setSelected(cookie)
    else if (branches?.length > 0 && !selected) {
      // Auto-select first branch if none selected
      const firstBranch = branches[0].id.toString()
      setSelected(firstBranch)
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, firstBranch)
      }
      setCookie(COOKIE_KEY, firstBranch)
    }
  }, [branches, selected])

  const handleChange = (value: string) => {
    console.log('🔄 Branch Selection Changed:', value)
    setSelected(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, value)
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('branchChanged', { detail: value }))
    }
    setCookie(COOKIE_KEY, value)
  }

  if (!branches || branches.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Loading branches..." />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={selected} onValueChange={handleChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select branch" />
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch: IBranch) => (
          <SelectItem key={branch.id} value={branch.id.toString()}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
