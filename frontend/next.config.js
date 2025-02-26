/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react', 'retry', 'p-retry'],
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
