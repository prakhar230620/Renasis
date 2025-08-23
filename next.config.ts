import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    // This is required to allow requests from the development environment.
    allowedDevOrigins: [
      'https://6000-firebase-studio-1755953688288.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
