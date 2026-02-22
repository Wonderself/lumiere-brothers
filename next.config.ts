import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Fix workspace root detection warning (non-ASCII chars in parent path)
  outputFileTracingRoot: path.join(__dirname),
  // Server external packages (needed for Prisma adapter)
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
