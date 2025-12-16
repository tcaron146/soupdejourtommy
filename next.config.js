/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    skipMiddlewareUrlNormalize: true,
  },
};

module.exports = nextConfig;