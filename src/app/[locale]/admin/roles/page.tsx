import { getLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { rolesService } from '@/lib/api/roles.service'
import RolesClient from './(components)/RolesClient'
import { getToken, getRefreshToken } from '@/app/[locale]/auth/token.action'
import { refreshToken as performRefresh } from '@/app/[locale]/auth/login/login.action'

export default async function RolesPage() {
  try {
    // Try to attach Authorization header explicitly from server cookie
    let token = await getToken()

    // If no token, try to refresh using refresh token (server-side)
    if (!token) {
      try {
        const refresh = await getRefreshToken()
        if (refresh) {
          await performRefresh()
          token = await getToken()
        }
      } catch (refreshErr) {
        console.error('RolesPage: refresh attempt failed', refreshErr)
      }
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    const roles = await rolesService.getRoles({}, headers)
    return <RolesClient initialData={roles.data ?? []} />
  } catch (error: any) {
    // If unauthorized on server fetch, don't redirect immediately.
    // Render the client component so the browser can perform the request
    // (browser will send cookies) and handle auth redirects there.
    const status = error?.response?.status
    if (status === 401) {
      return <RolesClient initialData={[]} forceFetch />
    }
    throw error
  }
}
