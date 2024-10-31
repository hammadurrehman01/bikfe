/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  swcMinify: true,
  cleanDistDir: true,
  optimizeFonts: true,
  reactStrictMode: true,
  output: 'standalone',
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  images: {
    domains: [
      'us-southeast-1.linodeobjects.com',
      'techlabs.us-southeast-1.linodeobjects.com',
    ],
    // domains: ['194.195.210.247'],
  },
};

module.exports = nextConfig;
