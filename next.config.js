/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // Pin Turbopack workspace root to this directory so chunk names stay short
  // (avoids ERR_CONTENT_LENGTH_MISMATCH from long Windows paths)
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Proxy /api/* to the Node.js backend, but exclude /api/sa-proxy/* which
  // is handled by the built-in Route Handler (Smart Assistant VM proxy)
  async rewrites() {
    return [
      {
        source: '/api/:path((?!sa-proxy).*)',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig