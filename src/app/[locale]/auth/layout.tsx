import { ReactNode } from 'react'
import { Geist, Geist_Mono, Cairo } from 'next/font/google'
import { ThemeProvider } from '@/components/provider/theme-provider'
import { HTMLAttributes } from '@/components/provider/html-attributes'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Toaster } from '@/components/ui/sonner'
import '../../globals.css'

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

interface AuthLayoutProps {
  children: ReactNode
  params: { locale: string }
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await Promise.resolve(params)
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <HTMLAttributes locale={locale} />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div
          className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} min-h-screen w-full bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800`}
          style={{ fontFamily: 'var(--font-cairo)' }}
        >
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
        <Toaster richColors />
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
