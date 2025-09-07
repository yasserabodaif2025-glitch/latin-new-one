'use server'

import { getCookie, setCookie, deleteCookie } from 'cookies-next/server'
import { cookies } from 'next/headers'

export async function getToken() {
  const token = await getCookie('token', { cookies })
  return token
}

export async function getRefreshToken() {
  const refreshToken = await getCookie('refreshToken', { cookies })
  return refreshToken
}

export async function setToken(token: string) {
  await setCookie('token', token, { 
    cookies,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

export async function setRefreshToken(refreshToken: string) {
  await setCookie('refreshToken', refreshToken, { 
    cookies,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })
}

export async function clearTokens() {
  await deleteCookie('token', { cookies })
  await deleteCookie('refreshToken', { cookies })
}
