/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push('undici');
        }
        return config;
    },
    turbopack: {
        root: process.cwd(),
    },
};

module.exports = nextConfig;