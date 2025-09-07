import { ReactNode } from 'react'
import './globals.css'
import { NavigationLoader } from '@/components/navigation-loader'

export const metadata = {
  title: 'Latin Academy',
  description: 'Learn Latin with ease',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <NavigationLoader />
        {children}
      </body>
    </html>
  )
}
