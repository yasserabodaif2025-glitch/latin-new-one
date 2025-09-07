import createNextIntlPlugin from 'next-intl/plugin'
import { type NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const config: NextConfig = {
  experimental: {
    optimizeCss: true,
    // Note: removed `swcMinify` and `modularizeImports` which are not
    // valid under `experimental` for this Next.js version.
    // If you relied on modularized imports or package optimizations,
    // consider adding a babel plugin or a dedicated build-time transform.
  },
  webpack: (config, { isServer }) => {
    // Fix for "self is not defined" error during SSR
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
      
      // Add alias to handle self references
      config.resolve.alias = {
        ...config.resolve.alias,
        'self': false,
      }
    }

    // Code splitting optimization
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 50000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
        },
      },
    }
    return config
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  // Proxy API requests during development to avoid CORS issues.
  // Ensure you set API_URL in your .env.local, e.g. API_URL=http://localhost:5000/
  async rewrites() {
    const apiUrl = process.env.API_URL ? String(process.env.API_URL).replace(/\/$/, '') : undefined
    if (!apiUrl) {
      // No API_URL configured — do not add rewrites to avoid invalid destinations.
      return []
    }
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ]
  },
  images: {
    domains: [
      'avatars.githubusercontent.com', // GitHub avatars
      'lh3.googleusercontent.com', // Google avatars
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default withNextIntl(config)
