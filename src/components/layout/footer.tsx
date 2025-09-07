import React from 'react'
import { useTranslations } from 'next-intl'

export const Footer: React.FC = () => {
  const t = useTranslations('footer')

  return (
    <footer className="border-t border-dashed bg-white p-4 text-center text-sm font-medium dark:bg-black">
      <p>
        {t('madeWith')} <span className="text-red-700">❤️</span> {t('by')}{' '}
        <a
          className="font-bold text-indigo-700 dark:text-indigo-300"
          href={'https://softhouseit.com'}
          target="_blank"
        >
          Softhouse
        </a>{' '}
        {t('allRights')} {t('slogan')}
      </p>
    </footer>
  )
}
