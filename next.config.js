/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ML-Algorithm-Visualizer',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
