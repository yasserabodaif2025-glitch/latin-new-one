import type { Metadata } from 'next'
import { Geist, Geist_Mono, Cairo } from 'next/font/google'
import { ThemeProvider } from '@/components/provider/theme-provider'
import { HTMLAttributes } from '@/components/provider/html-attributes'
import '../globals.css'
import { NavBar } from '@/components/layout'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { AppBreadcrumb } from '@/components/layout/app-breadcrumb'
import { Toaster } from '@/components/ui/sonner'
import { Footer } from '@/components/layout/footer'
import { DesktopSideMenu } from '@/components/layout/sidemenu/desktop-side-menu'
import { cookies } from 'next/headers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Latin Academy',
  description: 'Learn Latin with ease',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/favicon.ico',
    },
  },
}

export default async function LocaleLayout(props: any) {
  const { children, params } = await Promise.resolve(props)
  const { locale } = await Promise.resolve(params)
  
  try {
    // Validate that the incoming locale is valid
    if (locale !== 'en' && locale !== 'ar') {
      notFound()
    }
    const messages = await getMessages({ locale })
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    const isAuthenticated = Boolean(token)
    
    // For non-authenticated users, let auth layout handle the rendering
    if (!isAuthenticated) {
      return children
    }

    return (
      <NextIntlClientProvider messages={messages} locale={locale}>
        {/* Client component that sets HTML attributes on mount */}
        <HTMLAttributes locale={locale} />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div
            className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} flex h-screen w-screen flex-col gap-4 overflow-hidden bg-neutral-100 antialiased dark:bg-neutral-900`}
            style={{ fontFamily: 'var(--font-cairo)' }}
          >
            {isAuthenticated && <NavBar />}
            <div className="flex w-full flex-grow gap-4 overflow-auto">
              {isAuthenticated && <DesktopSideMenu />}
              <div className="flex flex-1 grow overflow-hidden rounded-lg">
                <main className="flex grow overflow-auto">
                  <div className="flex grow">
                    <div className="mx-auto flex w-full max-w-screen-2xl grow flex-col gap-3 px-4 pe-4 md:px-0 md:pe-4">
                      {isAuthenticated && <AppBreadcrumb />}
                      <div className="flex w-full grow flex-col overflow-auto rounded-xl border bg-white p-4 shadow-sm dark:border-border/40 dark:bg-black">
                        <div className="flex w-full grow">{children}</div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
            {isAuthenticated && <Footer />}
          </div>
          <Toaster richColors />
        </ThemeProvider>
      </NextIntlClientProvider>
    )
  } catch (error) {
    console.error('LocaleLayout error:', error)
    // If messages fail to load or another error occurs, show 404
    notFound()
  }
}
