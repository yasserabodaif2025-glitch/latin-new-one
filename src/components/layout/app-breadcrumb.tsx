'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link, usePathname } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import React from 'react'

export function AppBreadcrumb() {
  const pathname = usePathname()
  const t = useTranslations('breadcrumb')

  const pathnames = pathname.split('/').filter((x) => x)

  return (
    <>
      {pathnames.length >= 1 && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={'/'}>{t('home')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathnames.map((value, index) => {
              const isLast = index === pathnames.length - 1
              const href = `/${pathnames.slice(0, index + 1).join('/')}`
              const isNumber = value.match(/^\d+$/)
              // const isGUID = value.match(
              //   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
              // )
              if (isNumber) {
                return null
              }
              const isExist = t.raw(value as any) !== `breadcrumb.${value}`
              // if (isNumber || isGUID || isSlug || isExist) {
              if (!isExist) {
                return null
              }

              return (
                <React.Fragment key={href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{t(value as any)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={href}>{t(value as any)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </>
  )
}
