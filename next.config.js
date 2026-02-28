/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy internal /api/* calls to the Node.js Express backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig