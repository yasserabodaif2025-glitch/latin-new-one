import { cookies } from 'next/headers'

/**
 * Server-side utility to check if user is authenticated
 * by verifying the presence of auth token in cookies
 */
export async function getServerAuthStatus(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')
    return !!token?.value
  } catch (error) {
    console.error('Error checking auth status:', error)
    return false
  }
}
