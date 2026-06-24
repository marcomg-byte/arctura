import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@arctura/atomics', '@arctura/theme'],
};

export default nextConfig;
