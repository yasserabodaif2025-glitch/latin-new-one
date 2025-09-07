import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: routing.localePrefix,
})

function isPublicPath(pathname: string) {
  // Allow public: root redirect, auth pages, api routes, static assets, and next internals
  if (
    pathname === '/' ||
    /^\/(ar|en)\/auth(\/|$)/.test(pathname) ||
    /^\/api(\/|$)/.test(pathname) ||
    /^\/(ar|en)\/api(\/|$)/.test(pathname) ||
    /^\/_next\//.test(pathname) ||
    /^\/favicon\.ico$/.test(pathname) ||
    /^\/.*\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt)$/.test(pathname)
  ) {
    return true
  }
  return false
}

export default function combinedMiddleware(req: NextRequest) {
  // Run i18n middleware first
  const i18nResponse = intlMiddleware(req)
  // i18n middleware may return a response (redirect/rewrites); respect it
  if (i18nResponse) {
    // We still want to enforce auth on navigable pages
  }

  const { pathname } = req.nextUrl
  if (!isPublicPath(pathname)) {
    const token = req.cookies.get('token')?.value
    if (!token) {
      // Build login URL with locale and returnUrl
      const segments = pathname.split('/').filter(Boolean)
      const locale = segments[0] === 'ar' || segments[0] === 'en' ? segments[0] : routing.defaultLocale
      const url = req.nextUrl.clone()
      url.pathname = `/${locale}/auth/login`
      url.searchParams.set('returnUrl', pathname + (req.nextUrl.search || ''))
      return NextResponse.redirect(url)
    }
  }

  return i18nResponse as NextResponse | undefined
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
