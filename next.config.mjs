/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
