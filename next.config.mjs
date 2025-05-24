/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scriptum.odysseyus.fr',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '',
        port: '',
        pathname: '/public/memes/*',
      },
      {
        protocol: 'https',
        hostname: '',
        port: '3000',
        pathname: '/public/memes/*',
      },
    ],
  },
  webpack: (config) => {
    config.module.exprContextCritical = false;
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },

};

export default nextConfig;
