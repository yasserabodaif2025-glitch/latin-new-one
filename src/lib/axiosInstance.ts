import axios from 'axios'
import { apis } from '@/lib/const/api.enum'

// Determine runtime (client vs server)
const isClient = typeof window !== 'undefined'

// Client requests use relative /api/proxy/ server-side proxy which attaches
// Authorization header from httpOnly cookies. Server requests use the real API_URL from env.
// Server requests use the real API_URL from env; fallback to apis.baseUrl if not provided
const serverBase = process.env.API_URL ?? apis.baseUrl
// Ensure no double slashes issues
const normalize = (u: string) => u.replace(/\/+$/, '') + '/'
const baseURL = isClient ? '/api/proxy/' : normalize(serverBase)

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // إضافة timeout لتجنب الانتظار الطويل
})

// Debug: log baseURL on server start
if (!isClient) {
  console.log('axiosInstance running on server. baseURL=', baseURL)
}

// Request interceptor: add auth token on both client and server
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { getToken } = await import('@/app/[locale]/auth/token.action')
      const token = await getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      // Silently fail - don't log token errors to reduce noise
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Track refresh attempts to prevent infinite loops
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  
  failedQueue = []
}

// Response interceptor: handle 401 with proper queue management
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Only handle 401 errors and avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return axiosInstance(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Try to get refresh token
        const { getRefreshToken } = await import('@/app/[locale]/auth/token.action')
        const refreshToken = await getRefreshToken()
        
        if (refreshToken) {
          // Use the correct base URL for refresh endpoint
          const refreshBaseURL = isClient ? '/api/proxy/' : normalize(serverBase)
          const refreshUrl = `${refreshBaseURL}auth/refresh`
          
          // Try to refresh the token
          const response = await axios.post(refreshUrl, {
            refreshToken,
          }, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 5000, // Shorter timeout for refresh requests
          })

          if (response.data?.accessToken) {
            // Save the new tokens
            try {
              const { setToken, setRefreshToken } = await import('@/app/[locale]/auth/token.action')
              if (setToken && response.data.accessToken) {
                await setToken(response.data.accessToken)
              }
              if (setRefreshToken && response.data.refreshToken) {
                await setRefreshToken(response.data.refreshToken)
              }
            } catch (tokenSaveError) {
              console.warn('Could not save new tokens to cookies:', tokenSaveError)
            }
            
            // Process queued requests
            processQueue(null, response.data.accessToken)
            
            // Update auth header and retry original request
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
            return axiosInstance(originalRequest)
          }
        }
        
        // If refresh failed, clear tokens and redirect
        throw new Error('Token refresh failed')
        
      } catch (refreshError) {
        processQueue(refreshError, null)
        
        // Clear invalid tokens
        try {
          const { clearTokens } = await import('@/app/[locale]/auth/token.action')
          if (clearTokens) {
            await clearTokens()
          }
        } catch (clearError) {
          // Silently fail
        }

        // Redirect to login only if on client and not already on login page
        if (isClient && !window.location.pathname.includes('/auth/login')) {
          const currentPath = window.location.pathname
          const parts = currentPath.split('/')
          const locale = parts.length > 1 ? parts[1] : 'ar'
          const returnUrl = encodeURIComponent(currentPath)
          window.location.href = `/${locale}/auth/login?returnUrl=${returnUrl}`
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)