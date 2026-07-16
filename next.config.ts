// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ubfsf.org',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/ubfsf.org/**', // For Jetpack CDN images
      },
    ],
  },
};

export default nextConfig;