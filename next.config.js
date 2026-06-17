/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
  // Disable middleware for Edge runtime
  experimental: {
    middleware: true,
  },
  // Ensure Firebase modules are not bundled for Edge
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
