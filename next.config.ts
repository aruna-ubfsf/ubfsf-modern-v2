import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ubfsf.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com', // For Jetpack images
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
