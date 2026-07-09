// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // This bypasses Next.js image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'isab-server.fitinfotech.net',
      },
    ],
  },
  staticPageGenerationTimeout: 300,
}

export default nextConfig

