'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import logo from '@/assets/logo-1.webp'
import { SheetMenu } from './sheet-menu'
import { usePathname } from 'next/navigation'
import { ModeToggle } from './mode-toggle'
import { LanguageSwitcher } from './language-switcher'
import { LoginModal } from '@/app/[locale]/auth/login/(components)/login-modal'
import { BranchSelect } from './branch-select'
import { useTranslations, useLocale } from 'next-intl'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'

const locales = ['en', 'ar'] as const
const { Link } = createSharedPathnamesNavigation({ locales })


export function NavBar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const locale = useLocale()

  // Navigation items with their paths and translation keys
  const navItems = [
    { href: '/dashboard', label: 'home' },
    { href: '/students', label: 'students' },
    { href: '/courses', label: 'courses' },
    { href: '/groups-schedule', label: 'groups-schedule' },
    { href: '/receipts', label: 'receipt' },
    { href: '/messages', label: 'messages' },
    { href: '/leads', label: 'leads' },
    { href: '/admin/roles', label: 'roles' },
  ] as const

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    const pathWithoutLocale = pathname?.replace(new RegExp(`^/${locale}`), '') || '/'
    return pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
  }

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/60'
      )}
    >
      <div className={cn('mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-2')}>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 md:flex">
            <span className="text-sm text-gray-500">{t('branch')}: </span>
            <BranchSelect />
          </div>
          <div className="block md:hidden">
            <SheetMenu />
          </div>
        </div>

        {/* Desktop logo */}
        <div className="hidden h-10 w-10 shrink-0 rounded-full border shadow-md md:block">
          <Link href="/" className="cursor-pointer">
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>

        {/* Desktop main nav */}
        <div className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm text-foreground/80 hover:text-foreground',
                isActive(item.href) && 'font-medium text-foreground'
              )}
            >
              {t(item.label as any)}
            </Link>
          ))}
        </div>
        <div className={cn('flex items-center justify-between')}>
          <div className="hidden w-full !items-center !justify-center gap-2 md:flex">
            <ModeToggle />
            <LanguageSwitcher isIcon={false} />
            <LoginModal isIcon={false} />
          </div>
          <div className="block h-10 w-10 shrink-0 rounded-full border shadow-md md:hidden">
            <Link href="/" className="cursor-pointer">
              <Image
                src={logo}
                alt="Logo"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
