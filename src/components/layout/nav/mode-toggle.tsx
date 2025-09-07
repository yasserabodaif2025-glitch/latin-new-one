'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
export function ModeToggle() {
  const t = useTranslations('common')
  const { theme, setTheme } = useTheme()

  return (
    <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <p>{t(theme === 'dark' ? 'lightMode' : 'darkMode')}</p>
      {theme === 'dark' ? <Sun height={20} /> : <Moon height={20} />}
    </Button>
  )
}
