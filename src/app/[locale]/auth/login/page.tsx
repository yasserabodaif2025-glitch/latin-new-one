import { LoginForm } from './(components)/login-form'
import { cookies } from 'next/headers'
import { getCookie } from 'cookies-next/server'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

export default async function LoginPage() {
  const locale = await getLocale()
  const token = await getCookie('token', { cookies })
  if (token) {
    redirect(`/${locale}`)
  }
  return <LoginForm />
}
