import { routing } from '@/i18n/routing'

export const dynamic = 'force-static'

export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=/${routing.defaultLocale}`} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p>Redirecting...</p>
      </main>
    </>
  )
}
