/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ML-Algorithm-Visualizer',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
