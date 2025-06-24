/** @type {import('next').NextConfig} */
const nextConfig = {
  /**output: 'export',**/ // ✅ Enables static export for Firebase

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    serverActions: true,
  },

  // ✅ This disables image optimization so <Image /> works in static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
