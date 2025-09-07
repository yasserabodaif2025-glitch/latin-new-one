import { createSharedPathnamesNavigation } from 'next-intl/navigation'

export const locales = ['en', 'ar'] as const
export const localePrefix = 'always' as const
export const defaultLocale = 'en' as const

export const routing = {
  locales,
  defaultLocale,
  localePrefix,
}

// Create navigation utilities with proper typing
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
  localePrefix,
})

// Helper function to get the current locale
export function getCurrentLocale(pathname: string): string {
  const locale = pathname.split('/')[1]
  return locales.includes(locale as any) ? locale : 'en'
}

// Helper function to get the current path without locale
export function getPathWithoutLocale(pathname: string): string {
  const locale = getCurrentLocale(pathname)
  return pathname.replace(new RegExp(`^/${locale}`), '') || '/'
}

// Re-export types for convenience
export type AppPathname = `/${string}`
export type AppLocale = (typeof locales)[number]
