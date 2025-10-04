import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'quiz-learn-web.vercel.app', // ← Your production domain
        pathname: '/api/media/file/**', // ← Path to your media files
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/file/**', // ← For local dev
      },
    ],
  },
  experimental: {
    // Disable Vercel's auto-injected flags
    disableExperimentalReactCompiler: true,
  },

  // Force Vercel to use standard build
  output: 'standalone',

  webpack: (webpackConfig) => {
    // Extension aliasing
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // 🚨 Fix: Prevent Tailwind/PostCSS from running on node_modules CSS (like Payload styles)
    webpackConfig.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((one) => {
          if (one.use) {
            // Normalize: sometimes use is an object, sometimes an array
            const uses = Array.isArray(one.use) ? one.use : [one.use]

            uses.forEach((u) => {
              if (
                u?.loader?.includes('postcss-loader') &&
                u?.options?.postcssOptions?.plugins?.['tailwindcss']
              ) {
                delete u.options.postcssOptions.plugins['tailwindcss']
              }
            })
          }
        })
      }
    })

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
