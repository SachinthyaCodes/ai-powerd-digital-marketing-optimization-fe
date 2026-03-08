/** @type {import('next').NextConfig} */
const path = require('path');
const CONTENT_API_URL = process.env.NEXT_PUBLIC_CONTENT_API_URL || 'https://gimhanijayasuriya-content-generator-api.hf.space';

const nextConfig = {
  // Pin Turbopack workspace root to this directory so chunk names stay short
  // (avoids ERR_CONTENT_LENGTH_MISMATCH from long Windows paths)
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Allow Next.js <Image> to load poster images from the content generator HF Space
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gimhanijayasuriya-content-generator-api.hf.space',
      },
    ],
  },
  // Proxy /api/* to the strategy backend.
  // Exclude /api/sa-proxy/* which is handled by the built-in Route Handler.
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_STRATEGY_BASE_URL || 'https://sachinthya-marketing-strategy-recommender.hf.space';
    return [
      {
        source: '/api/:path((?!sa-proxy).*)',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
