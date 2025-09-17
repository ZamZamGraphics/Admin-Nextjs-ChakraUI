/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },
};

export default nextConfig;
