'use client'
import { LoginFormData, loginSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import logo from '@/assets/logo-1.webp'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { login } from '../login.action'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { LoginResponse } from './login.interface'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { PasswordInput } from '@/components/ui/password-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'

type LoginFormProps = {
  loginSuccess?: (response: LoginResponse) => void
  hideHeader?: boolean
}

export function LoginForm({ loginSuccess, hideHeader = false }: LoginFormProps) {
  const t = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  
  // تحميل البيانات المحفوظة من localStorage
  const getDefaultValues = (): LoginFormData => {
    if (typeof window !== 'undefined') {
      const rememberedUser = localStorage.getItem('rememberedUser')
      if (rememberedUser) {
        try {
          const parsed = JSON.parse(rememberedUser)
          return {
            userNameOrEmail: parsed.userNameOrEmail || '',
            password: '',
            rememberMe: parsed.rememberMe || false,
          }
        } catch (error) {
          console.error('Error parsing remembered user:', error)
        }
      }
    }
    return {
      userNameOrEmail: '',
      password: '',
      rememberMe: false,
    }
  }
  
  const defaultValues: LoginFormData = getDefaultValues()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  })
  const { handleSubmit } = form

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      const response = await login(
        { userNameOrEmail: data.userNameOrEmail, password: data.password },
        Boolean(data.rememberMe)
      )
      // Remembered user persistence (client-side)
      if (data.rememberMe) {
        try {
          localStorage.setItem('rememberedUser', JSON.stringify({
            userNameOrEmail: data.userNameOrEmail,
            rememberMe: true,
          }))
        } catch {}
      } else {
        try { localStorage.removeItem('rememberedUser') } catch {}
      }

      toast.success(t('loginSuccess'))

      if (loginSuccess) {
        loginSuccess(response)
      } else {
        // Check for returnUrl in query params
        const searchParams = new URLSearchParams(window.location.search)
        const returnUrl = searchParams.get('returnUrl')

        // If there's a returnUrl, redirect there, otherwise redirect to home
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl))
        } else {
          router.push(`/${locale}`)
        }
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || t('loginError')
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="relative mx-auto min-h-[500px] w-full max-w-md">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-background to-background opacity-80" />
      <div className="absolute left-1/2 top-0 -z-10 h-[60%] w-[120%] -translate-x-1/2 rounded-b-[50%] bg-primary/20 blur-[80px]" />
      <div className="absolute bottom-0 left-1/2 -z-10 h-[40%] w-[90%] -translate-x-1/2 rounded-t-[50%] bg-primary/10 blur-[60px]" />
      {/* Animated glow spots */}
      <motion.div
        className="absolute left-1/4 top-1/4 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-[60px]"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-[60px]"
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', delay: 1 }}
      />
      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-xl border border-border/30 bg-background/30 p-8 shadow-xl backdrop-blur-xl"
      >
        <Form {...form}>
          {!hideHeader && (
            <motion.div
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/50 to-primary/30 opacity-70 blur-sm"
                  animate={{ opacity: [0.5, 0.7, 0.5], scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
                />
                <div className="relative rounded-full bg-background/50 p-1 backdrop-blur-sm">
                  <Image
                    src={logo}
                    alt="logo"
                    width={80}
                    height={80}
                    className="rounded-full border shadow-md"
                  />
                </div>
              </div>
              <motion.h3
                className="mt-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-2xl font-bold leading-tight text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {t('login')}
              </motion.h3>
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {t('loginDescription')}
              </motion.p>
            </motion.div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <FormField
              control={form.control}
              name="userNameOrEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">{t('usernameOrEmail')}</FormLabel>
                  <div className={`relative ${focusedInput === 'userNameOrEmail' ? 'z-10' : ''}`}>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Mail
                          className={cn(
                            `absolute h-4 w-4 transition-colors duration-200 ${focusedInput === 'userNameOrEmail' ? 'text-primary' : 'text-muted-foreground'}`,
                            locale === 'ar' ? 'left-3' : 'right-3'
                          )}
                        />
                        <Input
                          {...field}
                          placeholder={t('usernameOrEmailPlaceholder')}
                          className="border-border/50 bg-background/50 pe-10 transition-all duration-200 focus:border-primary/50"
                          onFocus={() => setFocusedInput('userNameOrEmail')}
                          onBlur={() => setFocusedInput(null)}
                          autoComplete="username"
                          tabIndex={1}
                        />
                        {focusedInput === 'userNameOrEmail' && (
                          <motion.div
                            layoutId="input-highlight"
                            className="absolute inset-0 -z-10 rounded-md border border-primary/30 ring-2 ring-primary/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">{t('password')}</FormLabel>
                  <div className={`relative ${focusedInput === 'password' ? 'z-10' : ''}`}>
                    <FormControl>
                      <div className="relative flex items-center">
                        {/* <Lock
                          className={`absolute left-3 h-4 w-4 transition-colors duration-200 ${focusedInput === 'password' ? 'text-primary' : 'text-muted-foreground'}`}
                        /> */}
                        <PasswordInput
                          {...field}
                          placeholder={t('passwordPlaceholder')}
                          className="w-full border-border/50 bg-background/50 pe-10 transition-all duration-200 focus:border-primary/50"
                          onFocus={() => setFocusedInput('password')}
                          onBlur={() => setFocusedInput(null)}
                          autoComplete="current-password"
                          tabIndex={2}
                        />
                        {focusedInput === 'password' && (
                          <motion.div
                            layoutId="input-highlight"
                            className="absolute inset-0 -z-10 rounded-md border border-primary/30 ring-2 ring-primary/20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          id="rememberMe"
                          checked={!!field.value}
                          onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                          tabIndex={3}
                        />
                      </FormControl>
                      <label
                        htmlFor="rememberMe"
                        className="cursor-pointer text-sm text-foreground/80"
                      >
                        {t('rememberMe')}
                      </label>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            {/* <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                <a href="#" className="text-primary transition-colors hover:text-primary/80">
                  Forgot password?
                </a>
              </div>
            </div> */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-md bg-primary/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-70" />
              <Button
                type="submit"
                disabled={isLoading}
                className="group relative mt-2 w-full overflow-hidden"
                tabIndex={4}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    duration: 1.5,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                  style={{ opacity: isLoading ? 1 : 0, transition: 'opacity 0.3s ease' }}
                />
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      {t('loggingIn')}
                    </motion.div>
                  ) : (
                    <motion.span
                      key="button-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-1"
                    >
                      {locale === 'ar' && (
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                      {t('login')}
                      {locale === 'en' && (
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
            {/* <div className="relative mb-6 mt-6 flex items-center">
              <div className="flex-grow border-t border-border/30"></div>
              <motion.span
                className="mx-3 text-xs text-muted-foreground"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: [0.7, 0.9, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                or
              </motion.span>
              <div className="flex-grow border-t border-border/30"></div>
            </div> */}
            {/* <motion.p
              className="text-center text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Don&apos;t have an account?{' '}
              <a href="#" className="group relative inline-block">
                <span className="relative z-10 font-medium text-primary transition-colors duration-300 group-hover:text-primary/80">
                  Sign Up
                </span>
                <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            </motion.p> */}
          </form>
        </Form>
      </motion.div>
    </div>
  )
}
