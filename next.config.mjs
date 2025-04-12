/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'react-native',
    'react-native-web',
    'expo',
    '@expo/vector-icons',
    'react-native-paper',
    'react-native-safe-area-context',
    'react-native-screens',
    '@react-navigation/native',
    '@react-navigation/stack',
    '@react-navigation/bottom-tabs'
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    serverActions: true,
    optimizeCss: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    config.module.rules.push({
      test: /\.(ts|tsx)$/, // Match TypeScript files
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
          },
        },
      ],
    });
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig
