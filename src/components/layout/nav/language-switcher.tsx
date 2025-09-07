'use client'

import { Button } from '../../ui/button'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import arFlag from '@/assets/ar-flag.webp'
import enFlag from '@/assets/en-flag.webp'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface LanguageSwitcherProps {
  isIcon?: boolean
}

export function LanguageSwitcher({ isIcon = true }: LanguageSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()

  // Show the target language (what user will switch to)
  const targetLocale = locale === 'ar' ? 'en' : 'ar'
  const label = targetLocale === 'ar' ? 'العربية' : 'English'
  const flag = targetLocale === 'ar' ? arFlag : enFlag

  return (
    <Link href={pathname.replace(locale, targetLocale)}>
      <Button variant="ghost" size="sm" className="flex gap-3">
        {!isIcon && <p>{label}</p>}
        <Image src={flag} alt="language-flag" height={20} />
      </Button>
    </Link>
  )
}
