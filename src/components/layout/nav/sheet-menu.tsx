'use client'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { SideMenu } from '../sidemenu/side-menu'
import Image from 'next/image'
import logo from '@/assets/logo-1.webp'
import { LanguageSwitcher } from './language-switcher'
import { ModeToggle } from './mode-toggle'
import { useLocale } from 'next-intl'
import { LoginModal } from '@/app/[locale]/auth/login/(components)/login-modal'
import { useTranslations } from 'next-intl'
import { useWindowSize } from '@/lib/useWindowSize'
import { BranchSelect } from './branch-select'
export function SheetMenu() {
  const locale = useLocale()
  const t = useTranslations('common')
  const { width } = useWindowSize()
  if (width > 768) {
    return null
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={'icon'} variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={locale === 'ar' ? 'right' : 'left'} className="flex w-72 flex-col">
        <SheetHeader className="flex flex-col items-center justify-center">
          <Image
            src={logo}
            className="rounded-full border shadow-md"
            alt="Avatar"
            width={120}
            height={120}
          />
          <SheetTitle className="capitalize">{t('guest')}</SheetTitle>
          <SheetDescription className="!mt-0">
            {<LoginModal isIcon={false} />}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t('branch')}: </span>
              <BranchSelect />
            </div>
            {/* {session?.user ? session?.user?.email : <LoginModal isIcon={false} />} */}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <SideMenu />
        </div>
        <SheetFooter className="flex w-full !flex-row !items-center !justify-center gap-2">
          <ModeToggle />
          <LanguageSwitcher />
          <LoginModal />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
