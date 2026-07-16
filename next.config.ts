// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // WordPress media
      {
        protocol: 'https',
        hostname: 'ubfsf.org',
        pathname: '/wp-content/uploads/**',
      },
      // WordPress media via Jetpack CDN
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        pathname: '/ubfsf.org/**',
      },
      // WordPress media via i1.wp.com, i2.wp.com, i3.wp.com (Jetpack CDN variants)
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
        pathname: '/ubfsf.org/**',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
        pathname: '/ubfsf.org/**',
      },
      {
        protocol: 'https',
        hostname: 'i3.wp.com',
        pathname: '/ubfsf.org/**',
      },
      // Unsplash placeholder images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Zo Media Productions
      {
        protocol: 'https',
        hostname: 'zomediaproductions.com',
        pathname: '/**',
      },
      // For any other fallback or external images
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
        pathname: '/**',
      },
    ],
    // Optional: Add device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Add any other Next.js config options here
  // For example:
  // reactStrictMode: true,
  // swcMinify: true,
};

export default nextConfig;