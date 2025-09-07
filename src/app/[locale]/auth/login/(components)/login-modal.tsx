'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { logout } from '../login.action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LogIn, LogOut } from 'lucide-react'
import { LoginForm } from './login-form'
import { LoginResponse } from './login.interface'
// Removed server action import in client component
import Image from 'next/image'
import logo from '@/assets/logo-1.webp'

type LoginModalProps = {
  isIcon?: boolean
}

export function LoginModal({ isIcon = true }: LoginModalProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const t = useTranslations('auth')
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/auth/status', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as { authenticated: boolean }
        if (active) setToken(data.authenticated ? '1' : null)
      } catch (e) {
        console.error(e)
      }
    })()
    return () => {
      active = false
    }
  }, [])
  const handleLogin = (response: LoginResponse) => {
    // Immediately reflect authenticated state in UI
    setToken('1')
    setOpen(false)
    router.refresh()
  }

  const handleLogout = async () => {
    await logout()
    // Immediately reflect unauthenticated state in UI
    setToken(null)
    router.refresh()
    toast.success(t('logoutSuccess'))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={isIcon ? 'icon' : 'default'} variant={'ghost'}>
          {token ? isIcon ? <LogOut /> : t('logout') : isIcon ? <LogIn /> : t('login')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-center">
            <Image
              src={logo}
              alt="logo"
              width={100}
              height={100}
              className="mb-8 rounded-full border shadow"
            />
          </div>
          <DialogTitle className="text-center">{token ? t('logout') : t('login')}</DialogTitle>
          <DialogDescription className="text-center">
            {token ? t('logoutDescription') : t('loginDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {token ? (
            <div className="flex w-full items-center justify-center gap-2">
              <Button variant={'outline'} onClick={() => setOpen(false)}>
                {t('cancel')}
              </Button>
              <Button onClick={handleLogout}>{t('logout')}</Button>
            </div>
          ) : (
            <LoginForm hideHeader={true} loginSuccess={(response) => handleLogin(response)} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
