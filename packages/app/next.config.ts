import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@arctura/atomics', '@arctura/docs', '@arctura/theme'],
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
