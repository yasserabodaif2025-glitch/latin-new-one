import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function Error500() {
  const t = useTranslations('common.error500')
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-destructive">500</h1>
        <h2 className="text-2xl font-semibold">{t('title')}</h2>
        <p className="text-muted-foreground">{t('description')}</p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/dashboard">{t('backToHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
